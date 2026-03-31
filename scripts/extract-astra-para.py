"""Extract paragraph, blockquote, figure, list rules from Astra CSS files."""
import re

for fname in ['data/wp-css/astra-main.min.css', 'data/wp-css/inline-astra-theme-css-inline-css.css']:
    print(f"\n{'='*60}")
    print(f"FILE: {fname}")
    print('='*60)
    with open(fname, 'r') as f:
        css = f.read()

    rules = re.findall(r'([^{}]+)\{([^}]+)\}', css)
    for selector, body in rules:
        sel = selector.strip()
        bod = body.strip()
        # Look for paragraph, blockquote, figure, list rules
        keywords = ['blockquote', 'figure', 'figcaption', 'entry-content', '.wp-block-list', '.wp-block-quote', '.wp-block-paragraph']
        if any(kw in sel.lower() for kw in keywords):
            if any(prop in bod for prop in ['margin', 'padding', 'line-height', 'font-size']):
                print(f'\n{sel[:120]}')
                print(f'  {{ {bod[:300]} }}')

# Also check the WP block heading/paragraph inline CSS
for fname in ['data/wp-css/inline-wp-block-heading-inline-css.css', 'data/wp-css/inline-wp-block-paragraph-inline-css.css', 'data/wp-css/inline-wp-block-library-inline-css.css']:
    print(f"\n{'='*60}")
    print(f"FILE: {fname}")
    print('='*60)
    with open(fname, 'r') as f:
        print(f.read()[:2000])
