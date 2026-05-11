"""Replace https://xrnavigation.io/... with /... in content markdown link targets."""
import re
from pathlib import Path

CONTENT = Path(__file__).resolve().parent.parent / "content"

# Only replace inside markdown link target parentheses: ](https://xrnavigation.io/...)
# This avoids changing display text
pattern = re.compile(r'\]\(https://xrnavigation\.io(/[^)]*)\)')

def fix_file(path):
    text = path.read_text(encoding='utf-8')
    changes = []

    def replacer(m):
        path_part = m.group(1)
        changes.append(f"  https://xrnavigation.io{path_part} -> {path_part}")
        return f']({path_part})'

    new_text = pattern.sub(replacer, text)

    # Also fix bare https://xrnavigation.io) with no path -> /
    bare_pattern = re.compile(r'\]\(https://xrnavigation\.io\)')
    def bare_replacer(m):
        changes.append(f"  https://xrnavigation.io -> /")
        return '](/)'
    new_text = bare_pattern.sub(bare_replacer, new_text)

    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        return changes
    return []

total_changes = 0
for md in sorted(CONTENT.rglob('*.md')):
    changes = fix_file(md)
    if changes:
        rel = md.relative_to(CONTENT)
        print(f"{rel}:")
        for c in changes:
            print(c)
        total_changes += len(changes)

print(f"\nTotal: {total_changes} links fixed")
