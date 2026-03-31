"""Extract HTML structure from WordPress pages for Hugo template migration.

Downloads page HTML via requests/urllib, then uses BeautifulSoup to extract
structural patterns (tag + class + nesting) for key page sections.
"""
import os
import re
import tempfile
import platform
from html.parser import HTMLParser

# Pages to capture
PAGES = {
    "homepage": "https://xrnavigation.io/",
    "about": "https://xrnavigation.io/about/",
    "blog": "https://xrnavigation.io/blog/",
    "audiom-demo": "https://xrnavigation.io/audiom-demo/",
    "blog-post": "https://xrnavigation.io/how-to-make-detailed-map-text-descriptions/",
}

OUT_DIR = "data/wp-html"
os.makedirs(OUT_DIR, exist_ok=True)

def download_page(url):
    """Download page HTML using urllib (no external deps)."""
    from urllib.request import urlopen, Request
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; migration-tool)"})
    with urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def sanitize_urls(html_str):
    """Replace URLs to avoid exposing them in output."""
    return re.sub(r'https?://[^\s"\'<>]+', '[URL]', html_str)


class StructureWalker(HTMLParser):
    """Walk HTML and output tag structure with classes and IDs."""

    SELF_CLOSING = {"img", "br", "hr", "input", "meta", "link", "source", "area", "col", "embed", "wbr"}

    def __init__(self, max_depth=8):
        super().__init__()
        self.max_depth = max_depth
        self.depth = 0
        self.lines = []
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        if self.depth > self.max_depth:
            if tag not in self.SELF_CLOSING:
                self.depth += 1
                self.tag_stack.append(tag)
            return

        attrs_dict = dict(attrs)
        indent = "  " * self.depth
        parts = [f"<{tag}"]

        if "id" in attrs_dict and attrs_dict["id"]:
            parts.append(f'id="{attrs_dict["id"]}"')
        if "class" in attrs_dict and attrs_dict["class"]:
            parts.append(f'class="{attrs_dict["class"]}"')
        if "role" in attrs_dict and attrs_dict["role"]:
            parts.append(f'role="{attrs_dict["role"]}"')
        if "aria-label" in attrs_dict and attrs_dict["aria-label"]:
            parts.append(f'aria-label="{attrs_dict["aria-label"]}"')
        if tag == "img" and "alt" in attrs_dict:
            parts.append(f'alt="{attrs_dict.get("alt", "")}"')
        if tag == "a" and "href" in attrs_dict:
            parts.append('href="[URL]"')

        line = indent + " ".join(parts) + ">"
        self.lines.append(line)

        if tag not in self.SELF_CLOSING:
            self.depth += 1
            self.tag_stack.append(tag)

    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
            self.depth -= 1

    def get_output(self):
        return "\n".join(self.lines)


def extract_section(html, start_tag, start_pattern, end_tag=None):
    """Extract a section of HTML between patterns."""
    match = re.search(start_pattern, html, re.IGNORECASE)
    if not match:
        return None
    start = match.start()

    if end_tag:
        # Find matching closing tag
        depth = 0
        i = start
        while i < len(html):
            open_match = re.match(f'<{start_tag}[\\s>]', html[i:], re.IGNORECASE)
            close_match = re.match(f'</{start_tag}>', html[i:], re.IGNORECASE)
            if open_match:
                depth += 1
                i += len(open_match.group())
            elif close_match:
                depth -= 1
                if depth == 0:
                    return html[start:i + len(close_match.group())]
                i += len(close_match.group())
            else:
                i += 1
        return html[start:]
    return html[start:]


def walk_structure(html_fragment, max_depth=8):
    """Parse HTML fragment and return structure."""
    walker = StructureWalker(max_depth=max_depth)
    walker.feed(html_fragment)
    return walker.get_output()


def process_homepage(html):
    """Extract homepage header, first 2 content sections, and footer."""
    sections = {}

    # Header
    header_match = re.search(r'<header[^>]*>.*?</header>', html, re.DOTALL)
    if header_match:
        sections["header"] = walk_structure(header_match.group(), max_depth=7)

    # Content sections - find UAGB containers
    uagb_pattern = r'<div[^>]*class="[^"]*wp-block-uagb-container[^"]*"[^>]*>'
    uagb_matches = list(re.finditer(uagb_pattern, html))
    for i, m in enumerate(uagb_matches[:3]):
        # Extract the full container div
        start = m.start()
        depth = 0
        pos = start
        while pos < len(html):
            if html[pos:pos+4] == '<div':
                depth += 1
                pos += 4
            elif html[pos:pos+6] == '</div>':
                depth -= 1
                if depth == 0:
                    container = html[start:pos+6]
                    sections[f"content-section-{i}"] = walk_structure(container, max_depth=6)
                    break
                pos += 6
            else:
                pos += 1

    # Footer
    footer_match = re.search(r'<footer[^>]*>.*?</footer>', html, re.DOTALL)
    if footer_match:
        sections["footer"] = walk_structure(footer_match.group(), max_depth=7)

    return sections


def process_page(html, page_name):
    """Extract main content area structure."""
    sections = {}

    # Main content
    main_match = re.search(r'<main[^>]*>.*?</main>', html, re.DOTALL)
    if not main_match:
        # Try #content or .entry-content
        main_match = re.search(r'<div[^>]*id="content"[^>]*>.*?</div>\s*<!--\s*#content\s*-->', html, re.DOTALL)
    if main_match:
        sections["main-content"] = walk_structure(main_match.group(), max_depth=7)

    # Also grab header and footer if present
    header_match = re.search(r'<header[^>]*>.*?</header>', html, re.DOTALL)
    if header_match:
        sections["header"] = walk_structure(header_match.group(), max_depth=5)

    footer_match = re.search(r'<footer[^>]*>.*?</footer>', html, re.DOTALL)
    if footer_match:
        sections["footer"] = walk_structure(footer_match.group(), max_depth=5)

    return sections


def main():
    for page_name, url in PAGES.items():
        print(f"\n{'='*60}")
        print(f"Processing: {page_name} ({url})")
        print(f"{'='*60}")

        try:
            html = download_page(url)
            print(f"  Downloaded: {len(html)} bytes")
        except Exception as e:
            print(f"  ERROR downloading: {e}")
            continue

        if page_name == "homepage":
            sections = process_homepage(html)
        else:
            sections = process_page(html, page_name)

        # Write output
        out_path = os.path.join(OUT_DIR, f"{page_name}.md")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"# HTML Structure: {page_name}\n")
            f.write(f"Source: {url}\n")
            f.write(f"Captured: 2026-03-30\n\n")

            for section_name, structure in sections.items():
                f.write(f"## {section_name}\n\n")
                f.write("```html\n")
                f.write(structure)
                f.write("\n```\n\n")

        print(f"  Wrote: {out_path} ({len(sections)} sections)")

        # Also save raw HTML for reference
        raw_path = os.path.join(OUT_DIR, f"{page_name}.html")
        with open(raw_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  Saved raw HTML: {raw_path}")

    print("\nAll pages processed.")


if __name__ == "__main__":
    main()
