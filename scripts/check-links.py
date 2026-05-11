"""Crawl public/ for broken internal links and image references."""
import os
import re
import json
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin, unquote
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
STATIC = ROOT / "static"
CONTENT = ROOT / "content"

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []  # (tag, attr, url, text_context)
        self._current_tag = None
        self._current_href = None
        self._current_text = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'a':
            href = attrs_dict.get('href')
            if href:
                self._current_tag = 'a'
                self._current_href = href
                self._current_text = []
        if tag == 'img':
            src = attrs_dict.get('src')
            if src:
                self.links.append(('img', 'src', src, attrs_dict.get('alt', '')))
        if tag == 'link':
            href = attrs_dict.get('href')
            if href:
                self.links.append(('link', 'href', href, ''))
        if tag == 'script':
            src = attrs_dict.get('src')
            if src:
                self.links.append(('script', 'src', src, ''))

    def handle_data(self, data):
        if self._current_tag == 'a':
            self._current_text.append(data.strip())

    def handle_endtag(self, tag):
        if tag == 'a' and self._current_tag == 'a':
            text = ' '.join(self._current_text).strip()
            self.links.append(('a', 'href', self._current_href, text))
            self._current_tag = None
            self._current_href = None
            self._current_text = []


def is_internal(url):
    """Check if URL is internal (not external)."""
    parsed = urlparse(url)
    if parsed.scheme in ('mailto', 'tel', 'javascript', 'data'):
        return False
    if parsed.hostname and parsed.hostname not in ('xrnavigation.io', 'www.xrnavigation.io', 'localhost'):
        return False
    if parsed.scheme in ('http', 'https') and parsed.hostname in ('xrnavigation.io', 'www.xrnavigation.io'):
        return True  # external URL pointing to self — should be relative
    if not parsed.scheme and not parsed.hostname:
        return True
    return False


def resolve_target(url, source_file):
    """Resolve an internal URL to a filesystem path in public/."""
    parsed = urlparse(url)
    path = unquote(parsed.path)

    if not path:
        return None  # fragment-only link

    # Absolute path
    if path.startswith('/'):
        target = PUBLIC / path.lstrip('/')
    else:
        # Relative path
        source_dir = source_file.parent
        target = source_dir / path

    target = target.resolve()

    # Check various possibilities
    candidates = [target]
    if target.is_dir():
        candidates.append(target / 'index.html')
    if not target.suffix:
        candidates.append(target / 'index.html')
        candidates.append(target.with_suffix('.html'))
    # trailing slash normalization
    str_target = str(target)
    if not str_target.endswith(('/', '\\')) and not target.suffix:
        candidates.append(Path(str_target) / 'index.html')

    for c in candidates:
        if c.exists():
            return None  # found it — not broken

    return str(target)


def check_html_files():
    """Crawl all HTML files in public/ and check links."""
    broken = []
    self_referencing = []
    wp_content_refs = []

    for html_file in PUBLIC.rglob('*.html'):
        try:
            content = html_file.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue

        parser = LinkExtractor()
        try:
            parser.feed(content)
        except Exception:
            continue

        rel_source = html_file.relative_to(PUBLIC)

        for tag, attr, url, text in parser.links:
            # Check for wp-content references
            if '/wp-content/' in url:
                wp_content_refs.append({
                    'source': str(rel_source),
                    'url': url,
                    'text': text,
                    'tag': tag,
                })

            # Check for self-referencing external links
            parsed = urlparse(url)
            if parsed.hostname in ('xrnavigation.io', 'www.xrnavigation.io'):
                self_referencing.append({
                    'source': str(rel_source),
                    'url': url,
                    'text': text,
                    'tag': tag,
                    'suggested': parsed.path or '/',
                })

            if not is_internal(url):
                continue

            result = resolve_target(url, html_file)
            if result is not None:
                broken.append({
                    'source': str(rel_source),
                    'url': url,
                    'text': text,
                    'tag': tag,
                    'attr': attr,
                })

    return broken, self_referencing, wp_content_refs


def check_content_files():
    """Check markdown content files for broken links."""
    md_broken = []
    md_wp_content = []

    link_re = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')
    img_re = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')
    html_href_re = re.compile(r'href=["\']([^"\']+)["\']')
    html_src_re = re.compile(r'src=["\']([^"\']+)["\']')

    for md_file in CONTENT.rglob('*.md'):
        try:
            content = md_file.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue

        rel_source = md_file.relative_to(ROOT)

        # Extract markdown links
        for match in link_re.finditer(content):
            text, url = match.group(1), match.group(2)
            if '/wp-content/' in url:
                md_wp_content.append({
                    'source': str(rel_source),
                    'url': url,
                    'text': text,
                })

        # Extract HTML links in markdown
        for match in html_href_re.finditer(content):
            url = match.group(1)
            if '/wp-content/' in url:
                md_wp_content.append({
                    'source': str(rel_source),
                    'url': url,
                    'text': '',
                })

        for match in html_src_re.finditer(content):
            url = match.group(1)
            if '/wp-content/' in url:
                md_wp_content.append({
                    'source': str(rel_source),
                    'url': url,
                    'text': '(image src)',
                })

            # Check if image exists in static/
            if is_internal(url):
                parsed = urlparse(url)
                path = unquote(parsed.path)
                if path.startswith('/'):
                    static_path = STATIC / path.lstrip('/')
                    public_path = PUBLIC / path.lstrip('/')
                    if not static_path.exists() and not public_path.exists():
                        md_broken.append({
                            'source': str(rel_source),
                            'url': url,
                            'text': '(image/resource)',
                            'tag': 'img',
                            'attr': 'src',
                        })

    return md_broken, md_wp_content


def check_menu_links():
    """Check hugo.toml menu links resolve to actual pages."""
    import tomllib
    toml_path = ROOT / 'hugo.toml'
    with open(toml_path, 'rb') as f:
        config = tomllib.load(f)

    menu_broken = []
    menus = config.get('menu', {})
    for menu_name, items in menus.items():
        for item in items:
            url = item.get('url', '')
            name = item.get('name', '')
            params = item.get('params', {})
            if params.get('external'):
                continue
            if not url or not url.startswith('/'):
                continue
            # Check if the URL resolves in public/
            target = PUBLIC / url.lstrip('/')
            candidates = [target, target / 'index.html']
            if not target.suffix:
                candidates.append(target.with_suffix('.html'))
            found = any(c.exists() for c in candidates)
            if not found:
                menu_broken.append({
                    'source': f'hugo.toml [menu.{menu_name}]',
                    'url': url,
                    'text': name,
                    'tag': 'menu',
                    'attr': 'url',
                })

    return menu_broken


def check_static_images():
    """Check that images referenced in HTML exist in static/."""
    missing_images = []

    for html_file in PUBLIC.rglob('*.html'):
        try:
            content = html_file.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue

        parser = LinkExtractor()
        try:
            parser.feed(content)
        except Exception:
            continue

        rel_source = html_file.relative_to(PUBLIC)

        for tag, attr, url, text in parser.links:
            if tag != 'img':
                continue
            if not is_internal(url):
                continue
            parsed = urlparse(url)
            path = unquote(parsed.path)
            if not path:
                continue
            if path.startswith('/'):
                public_path = PUBLIC / path.lstrip('/')
                if not public_path.exists():
                    missing_images.append({
                        'source': str(rel_source),
                        'url': url,
                        'text': text,
                    })

    return missing_images


def main():
    print("Building link audit report...")
    print(f"Public dir: {PUBLIC}")
    print(f"Static dir: {STATIC}")

    html_broken, self_ref, wp_html = check_html_files()
    md_broken, wp_md = check_content_files()
    menu_broken = check_menu_links()
    missing_images = check_static_images()

    all_broken = html_broken + md_broken + menu_broken
    all_wp = wp_html + wp_md

    # Deduplicate broken links
    seen = set()
    deduped_broken = []
    for b in all_broken:
        key = (b['source'], b['url'])
        if key not in seen:
            seen.add(key)
            deduped_broken.append(b)

    # Deduplicate missing images
    seen_img = set()
    deduped_images = []
    for img in missing_images:
        key = (img['source'], img['url'])
        if key not in seen_img:
            seen_img.add(key)
            deduped_images.append(img)

    # Deduplicate wp-content refs
    seen_wp = set()
    deduped_wp = []
    for wp in all_wp:
        key = (wp['source'], wp['url'])
        if key not in seen_wp:
            seen_wp.add(key)
            deduped_wp.append(wp)

    # Deduplicate self-referencing
    seen_self = set()
    deduped_self = []
    for s in self_ref:
        key = (s['source'], s['url'])
        if key not in seen_self:
            seen_self.add(key)
            deduped_self.append(s)

    report = {
        'broken_links': deduped_broken,
        'missing_images': deduped_images,
        'wp_content_references': deduped_wp,
        'self_referencing_external': deduped_self,
        'summary': {
            'broken_link_count': len(deduped_broken),
            'missing_image_count': len(deduped_images),
            'wp_content_count': len(deduped_wp),
            'self_referencing_count': len(deduped_self),
        }
    }

    # Write JSON
    data_dir = ROOT / 'data'
    data_dir.mkdir(exist_ok=True)
    json_path = data_dir / 'broken-links.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    print(f"\nJSON report: {json_path}")

    # Print summary
    print(f"\n=== LINK AUDIT SUMMARY ===")
    print(f"Broken internal links: {len(deduped_broken)}")
    print(f"Missing images: {len(deduped_images)}")
    print(f"wp-content references: {len(deduped_wp)}")
    print(f"Self-referencing external URLs: {len(deduped_self)}")

    if deduped_broken:
        print(f"\n--- BROKEN LINKS ---")
        for b in deduped_broken:
            print(f"  [{b['source']}] {b['url']}  (text: {b.get('text', '')})")

    if deduped_images:
        print(f"\n--- MISSING IMAGES ---")
        for img in deduped_images:
            print(f"  [{img['source']}] {img['url']}  (alt: {img.get('text', '')})")

    if deduped_wp:
        print(f"\n--- WP-CONTENT REFERENCES ---")
        for wp in deduped_wp:
            print(f"  [{wp['source']}] {wp['url']}")

    if deduped_self:
        print(f"\n--- SELF-REFERENCING EXTERNAL ---")
        for s in deduped_self:
            print(f"  [{s['source']}] {s['url']}  -> should be: {s['suggested']}")

    return report


if __name__ == '__main__':
    main()
