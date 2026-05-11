"""Run mobile diffs for representative pages across all types."""
import subprocess, sys, os

# Representative pages per type
pages = [
    # Homepage
    "home",
    # Standard pages (text-heavy)
    "privacy-policy",
    "accessibility-statement",
    "fcoi",
    "about-audiom",
    # Blog listing
    "blog",
    # Blog post
    "fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific",
    # Embed pages
    "audiom-demo",
    "audiom-eclipse24-sun-to-scale-map",
    "audiom-lske-map-1",
    # Collection pages
    "universities",
    "health-care",
    # Embed pages (various)
    "audiom-bovine-manus-diagram",
    "audiom-human-skeleton-diagram",
    # Standard pages (table, short)
    "wcag-map-comparison-table",
    # Misc
    "contact",
    "events",
]

results = []
for slug in pages:
    cmd = ["node", "tests/mobile-diff.js", slug]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd="C:/Users/Q/src/audiom/xrnavigation.io", timeout=60)
    out = r.stdout.strip()
    err = r.stderr.strip()
    if out:
        print(out)
        results.append(out)
    if err and "Error" in err:
        print(f"  ERROR: {err[:200]}")

print("\n=== SUMMARY ===")
for r in results:
    print(r)
