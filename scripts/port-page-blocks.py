"""Port a live page's UAGB block CSS as an authored, page-scoped chunk.

Usage: python scripts/port-page-blocks.py <browser.html> <body-scope-class>
  1. node scripts/extract-uagb-block-css.js pulls every uagb-block id's rules
     (media queries intact) — caller must have saved browser-served HTML via
     scripts/save-live-html.js (curl gets a poorer variant).
  2. url(/wp-content/uploads/...) refs are localized via static/images/manifest.json.
  3. Every selector is prefixed with the body scope class (block ids are reused
     across pages with different generated CSS, e.g. 450c520f).
  4. Appended to wordpress-compat.css with a marker comment.
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse

html, scope = sys.argv[1], sys.argv[2]
ids = sorted(set(re.findall(r'uagb-block-([a-f0-9]{8})', open(html, encoding='utf-8').read())))
if not ids:
    sys.exit('no block ids found')
css = subprocess.run(['node', 'scripts/extract-uagb-block-css.js', html, *ids],
                     capture_output=True, text=True, check=True).stdout

manifest = json.load(open('static/images/manifest.json', encoding='utf-8'))
upload_map = {}
for it in manifest:
    local = '/' + it['local_path'].replace('static/', '', 1).replace(os.sep, '/')
    if '%' in local:
        local = local.replace('%', '%25')
    rel = it['wp_url'].replace('https://xrnavigation.io', '')
    upload_map[rel] = local
    upload_map[urllib.parse.unquote(rel)] = local
missing = []


def loc(m):
    u = m.group(1)
    for cand in (u, urllib.parse.unquote(u)):
        if cand in upload_map:
            return 'url(' + upload_map[cand] + ')'
    missing.append(u)
    return m.group(0)


css = re.sub(r'url\((/wp-content/uploads/[^)]+)\)', loc, css)


def prefix_selectors(css, prefix):
    result = []
    buf = ''
    j = 0
    while j < len(css):
        c = css[j]
        if c == '{':
            sel = buf
            if sel.strip().startswith('@'):
                result.append(sel + '{')
            else:
                result.append(','.join(prefix + ' ' + p.strip() for p in sel.split(',')) + '{')
            buf = ''
        elif c == '}':
            result.append(buf + '}')
            buf = ''
        else:
            buf += c
            j += 1
            continue
        j += 1
    result.append(buf)
    return ''.join(result)


if scope.startswith('file:'):
    out = 'static/css/blocks/' + scope[5:] + '.css'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(
        '/* Live UAGB block CSS for this page, ported via scripts/port-page-blocks.py */\n' + css)
    print(f'wrote {out}: {len(ids)} blocks; unresolved urls: {missing}')
else:
    scoped = prefix_selectors(css, 'body.' + scope)
    header = f'\n/* ---- Page block CSS (scoped {scope}): live UAGB rules for {os.path.basename(html)}, ported via scripts/port-page-blocks.py ---- */\n'
    open('themes/xrnav/static/css/wordpress-compat.css', 'a', encoding='utf-8').write(header + scoped)
    print(f'appended {len(ids)} blocks scoped under body.{scope}; unresolved urls: {missing}')
