"""Localize upload URLs in the extracted blog section CSS and append it to
wordpress-compat.css."""
import json
import os
import re
import sys
import urllib.parse

src = sys.argv[1]
css = open(src, encoding='utf-8').read()
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


def sub(m):
    u = m.group(1)
    for cand in (u, urllib.parse.unquote(u)):
        if cand in upload_map:
            return 'url(' + upload_map[cand] + ')'
    missing.append(u)
    return m.group(0)


css = re.sub(r'url\((/wp-content/uploads/[^)]+)\)', sub, css)
header = ('\n/* ---- Blog page sections: live UAGB block CSS (hero 450c520f, heading\n'
          '   933111fa/a327397c, grid section 6ff32c5f) extracted verbatim with\n'
          '   scripts/extract-uagb-block-css.js; hero bg localized. ---- */\n')
open('themes/xrnav/static/css/wordpress-compat.css', 'a', encoding='utf-8').write(header + css)
print('appended; missing:', missing)
