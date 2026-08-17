"""Map remaining relative /wp-content/uploads/ refs in the homepage layout to local /images/ paths."""
import re
import json
import urllib.parse

manifest = json.load(open('static/images/manifest.json', encoding='utf-8'))
m = {}
for it in manifest:
    local = '/' + it['local_path'].replace('static/', '', 1).replace('\\', '/')
    rel = it['wp_url'].replace('https://xrnavigation.io', '')
    m[rel] = local.replace('%', '%25') if '%' in local else local

path = 'themes/xrnav/layouts/index.html'
text = open(path, encoding='utf-8').read()
missing = []


def sub(match):
    u = match.group(0)
    for cand in (u, urllib.parse.unquote(u),
                 re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', u),
                 urllib.parse.unquote(re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', u))):
        if cand in m:
            return m[cand]
    missing.append(u)
    return u


new = re.sub(r'/wp-content/uploads/[^"\')\s>,]+', sub, text)
open(path, 'w', encoding='utf-8').write(new)
print('before:', len(re.findall(r'/wp-content/uploads/', text)),
      'after:', len(re.findall(r'/wp-content/uploads/', new)))
print('missing:', sorted(set(missing)))
