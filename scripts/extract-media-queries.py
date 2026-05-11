"""Extract all @media blocks from the WP inline CSS."""
import re
import sys

css = open('data/wp-css/inline-astra-theme-css-inline-css.css').read()

i = 0
blocks = []
while i < len(css):
    m = re.search(r'@media\s*\([^)]+\)\s*\{', css[i:])
    if not m:
        break
    start = i + m.start()
    depth = 1
    j = start + m.end() - m.start()
    while j < len(css) and depth > 0:
        if css[j] == '{':
            depth += 1
        elif css[j] == '}':
            depth -= 1
        j += 1
    block = css[start:j]
    # Pretty print: add newlines after { and before }
    block = re.sub(r'\{', ' {\n  ', block)
    block = re.sub(r'\}', '\n}\n', block)
    blocks.append(block)
    i = j

for idx, b in enumerate(blocks):
    print(f"=== BLOCK {idx+1} ===")
    print(b[:600])
    if len(b) > 600:
        print("  ...[truncated]")
    print()
