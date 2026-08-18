"""Blocks 450c520f/7cba2e14 exist on BOTH the blog list and the homepage with
different generated CSS. Scope the blog chunk's rules with body.blog and the
home chunk's with body.home-page so they stop overriding each other.
Chunks are identified by the shared header comment, in append order:
1 = blog, 2 = about, 3 = home."""
import re

P = 'themes/xrnav/static/css/wordpress-compat.css'
HDR = '/* ---- Blog page sections: live UAGB block CSS'
IDS = ('450c520f', '7cba2e14')

s = open(P, encoding='utf-8').read()
starts = [m.start() for m in re.finditer(re.escape(HDR), s)]
assert len(starts) == 3, starts
bounds = starts + [len(s)]
chunks = [(starts[i], bounds[i + 1]) for i in range(3)]


def prefix_selectors(css, prefix):
    # simple state machine: split top-level and media blocks
    def fix_rule(sel):
        parts = []
        for p in sel.split(','):
            if any(b in p for b in IDS):
                parts.append(prefix + ' ' + p.strip())
            else:
                parts.append(p)
        return ','.join(parts)

    result = []
    depth = 0
    buf = ''
    j = 0
    while j < len(css):
        c = css[j]
        if c == '{':
            sel = buf
            if sel.strip().startswith('@'):
                result.append(sel + '{')
            else:
                result.append(fix_rule(sel) + '{')
            buf = ''
            depth += 1
        elif c == '}':
            result.append(buf + '}')
            buf = ''
            depth -= 1
        else:
            buf += c
            j += 1
            continue
        j += 1
    result.append(buf)
    return ''.join(result)


# process later chunks first so earlier offsets stay valid
for (start, end), prefix, name in [(chunks[2], 'body.home-page', 'home'), (chunks[0], 'body.blog', 'blog')]:
    chunk = s[start:end]
    fixed = prefix_selectors(chunk, prefix)
    s = s[:start] + fixed + s[end:]
    print(name, 'chunk scoped,', chunk.count(IDS[0]) + chunk.count(IDS[1]), 'id refs')

open(P, 'w', encoding='utf-8').write(s)
print('done')
