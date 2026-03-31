"""Extract Astra margin reset rules from minified CSS."""
import re

with open('data/wp-css/inline-astra-theme-css-inline-css.css', 'r') as f:
    css = f.read()

# Find all margin-related rules
rules = re.findall(r'([^{}]+)\{([^}]*margin[^}]*)\}', css)
for selector, body in rules:
    sel = selector.strip()
    # Only show rules with margin-top or margin-bottom
    if 'margin-top' in body or 'margin-bottom' in body or 'margin-block' in body:
        print(f'{sel[:120]}')
        print(f'  {{ {body.strip()[:250]} }}')
        print()

print("=" * 60)
print("Looking for h1-h6 margin rules in astra-main.min.css...")
with open('data/wp-css/astra-main.min.css', 'r') as f:
    css2 = f.read()

rules2 = re.findall(r'([^{}]+)\{([^}]*)\}', css2)
for selector, body in rules2:
    sel = selector.strip()
    if any(h in sel for h in ['h1','h2','h3','h4','h5','h6']) and ('margin' in body or 'padding' in body):
        print(f'{sel[:120]}')
        print(f'  {{ {body.strip()[:250]} }}')
        print()
