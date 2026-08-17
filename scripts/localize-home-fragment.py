"""Localize asset URLs in the exported homepage fragment (data/wp-rendered/home.{html,css}).

Maps WP upload URLs to local /images/ paths via static/images/manifest.json,
falling back to stripping -WxH size suffixes. Site links become root-relative.
Writes home.local.html / home.local.css and reports unmapped assets.
"""
import re
import json
import urllib.parse

manifest = json.load(open('static/images/manifest.json', encoding='utf-8'))
url_to_local = {}
for it in manifest:
    local = '/' + it['local_path'].replace('static/', '', 1).replace('\\', '/')
    url_to_local[it['wp_url']] = local

html = open('data/wp-rendered/home.html', encoding='utf-8').read()
css = open('data/wp-rendered/home.css', encoding='utf-8').read()

missing = []


def map_url(u):
    if u in url_to_local:
        return url_to_local[u]
    uq = urllib.parse.unquote(u)
    if uq in url_to_local:
        return url_to_local[uq]
    base = re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', u)
    if base in url_to_local:
        return url_to_local[base]
    baseq = urllib.parse.unquote(base)
    if baseq in url_to_local:
        return url_to_local[baseq]
    missing.append(u)
    return u


pat = re.compile(r'https://xrnavigation\.io/wp-content/uploads/[^"\')\s>]+')
html = pat.sub(lambda m: map_url(m.group(0)), html)
css = pat.sub(lambda m: map_url(m.group(0)), css)

html = html.replace(
    'https://xrnavigation.io/wp-content/plugins/wpforms/assets/images/submit-spin.svg',
    '/wp-content/plugins/wpforms/assets/images/submit-spin.svg')
html = re.sub(r'href="https://xrnavigation\.io(/[^"]*)"', r'href="\1"', html)

open('data/wp-rendered/home.local.html', 'w', encoding='utf-8').write(html)
open('data/wp-rendered/home.local.css', 'w', encoding='utf-8').write(css)
print('missing assets:')
for u in sorted(set(missing)):
    print(' ', u)
print('remaining absolute html refs:', len(re.findall(r'https://xrnavigation\.io', html)))
print('remaining absolute css refs:', len(re.findall(r'https://xrnavigation\.io', css)))
