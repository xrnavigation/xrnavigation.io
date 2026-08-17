"""Localize remaining absolute WP upload URLs in content and layouts.

For each absolute https://xrnavigation.io/wp-content/uploads/... reference:
map via static/images/manifest.json (with -WxH size-suffix fallback); if the
asset is unknown, download it from live into static/images/ and extend the
manifest. Rewrites the referencing files in place, preserving their newline
style.
"""
import re
import json
import os
import urllib.parse
import urllib.request

FILES = [
    'themes/xrnav/layouts/wp-about/single.html',
    'content/about.md',
    'content/events.md',
    'content/magicmap-paloalto.md',
    'content/sonification-awards-2024-application.md',
]

MANIFEST = 'static/images/manifest.json'
manifest = json.load(open(MANIFEST, encoding='utf-8'))
url_to_local = {}
for it in manifest:
    local = '/' + it['local_path'].replace('static/', '', 1).replace('\\', '/')
    url_to_local[it['wp_url']] = local

pat = re.compile(r'https://xrnavigation\.io/wp-content/uploads/[^"\')\s>]+')
downloaded = []


def resolve(u):
    for cand in (u, urllib.parse.unquote(u),
                 re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', u),
                 urllib.parse.unquote(re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', u))):
        if cand in url_to_local:
            return url_to_local[cand]
    # unknown: download into static/images
    name = urllib.parse.unquote(u.rsplit('/', 1)[-1])
    dest = os.path.join('static', 'images', name)
    if not os.path.exists(dest):
        req = urllib.request.Request(u, headers={'User-Agent': 'wp-export/1.0'})
        with urllib.request.urlopen(req) as r, open(dest, 'wb') as f:
            f.write(r.read())
        downloaded.append(name)
    local = '/images/' + name
    url_to_local[u] = local
    manifest.append({'id': None, 'wp_url': u, 'local_path': f'static/images/{name}',
                     'alt_text': '', 'title': name, 'slug': name, 'mime_type': '',
                     'size_bytes': os.path.getsize(dest)})
    return local


for path in FILES:
    raw = open(path, 'rb').read()
    crlf = b'\r\n' in raw
    text = raw.decode('utf-8')
    new = pat.sub(lambda m: resolve(m.group(0)), text)
    if new != text:
        data = new.encode('utf-8')
        if not crlf:
            data = data.replace(b'\r\n', b'\n')
        open(path, 'wb').write(data)
        print('rewrote', path)

json.dump(manifest, open(MANIFEST, 'w', encoding='utf-8'), indent=2)
print('downloaded:', downloaded)
