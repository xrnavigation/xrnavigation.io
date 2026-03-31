"""Extract inline <style> blocks from downloaded WordPress HTML source."""
import re
import os

import tempfile, platform
if platform.system() == "Windows":
    HTML_FILE = os.path.join(tempfile.gettempdir(), "xrnav-homepage.html")
else:
    HTML_FILE = "/tmp/xrnav-homepage.html"
OUT_DIR = "data/wp-css"

with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# Extract all style blocks with IDs
pattern = r"<style\s+id=[\"']([^\"']*)[\"'][^>]*>(.*?)</style>"
matches = re.findall(pattern, html, re.DOTALL)

for id_val, content in matches:
    if len(content.strip()) > 10:
        fname = os.path.join(OUT_DIR, f"inline-{id_val}.css")
        with open(fname, "w", encoding="utf-8") as out:
            out.write(content)
        print(f"{id_val}: {len(content)} chars -> {fname}")

# Extract style blocks without IDs
pattern2 = r"<style(?:\s+[^>]*)?>(?!\s*$)(.*?)</style>"
anon_matches = re.findall(pattern2, html, re.DOTALL)
anon_idx = 0
for content in anon_matches:
    content_stripped = content.strip()
    if len(content_stripped) > 10:
        found = False
        for id_val, id_content in matches:
            if content_stripped == id_content.strip():
                found = True
                break
        if not found:
            fname = os.path.join(OUT_DIR, f"inline-anonymous-{anon_idx}.css")
            with open(fname, "w", encoding="utf-8") as out:
                out.write(content_stripped)
            print(f"anonymous-{anon_idx}: {len(content_stripped)} chars -> {fname}")
            anon_idx += 1

print("\nDone.")
