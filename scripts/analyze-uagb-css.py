"""Analyze UAGB inline CSS to count unique block IDs and understand structure."""
import re

css = open('data/wp-css/inline-uagb-style-frontend-135.css').read()

# Count unique block IDs
blocks = re.findall(r'\.uagb-block-([a-f0-9]+)', css)
unique = set(blocks)
print(f'Total block references: {len(blocks)}')
print(f'Unique block IDs: {len(unique)}')
print('Sample block IDs:', sorted(unique)[:10])

# Count selectors by type
uagb_classes = re.findall(r'\.(uagb-[a-z-]+)', css)
class_counts = {}
for c in uagb_classes:
    class_counts[c] = class_counts.get(c, 0) + 1

print(f'\nTop 20 UAGB class prefixes:')
for cls, count in sorted(class_counts.items(), key=lambda x: -x[1])[:20]:
    print(f'  {cls}: {count}')

# File size breakdown
print(f'\nTotal CSS size: {len(css)} bytes')
