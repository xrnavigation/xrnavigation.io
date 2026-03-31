"""Extract typography-related CSS rules from Astra theme inline CSS."""
import re

with open('data/wp-css/inline-astra-theme-css-inline-css.css', 'r') as f:
    css = f.read()

rules = re.findall(r'([^{}]+)\{([^}]+)\}', css)
for selector, body in rules:
    sel = selector.strip()
    bod = body.strip()
    has_spacing = any(kw in bod for kw in ['margin', 'line-height', 'padding'])
    has_typo_selector = any(kw in sel for kw in [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        ' p ', 'p,', 'p{', '.entry-content',
        'blockquote', 'figure', 'figcaption',
        'li ', 'ul ', 'ol ',
        '.wp-block', '.ast-', 'body'
    ])
    if has_spacing and has_typo_selector:
        print(f'{sel[:100]}')
        print(f'  {{ {bod[:200]} }}')
        print()
