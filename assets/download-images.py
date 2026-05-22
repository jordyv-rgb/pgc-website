#!/usr/bin/env python3
"""
PGC IMAGE LIBRARY DOWNLOADER
─────────────────────────────────────────────────────────────────────────────
Run from the 03_Website/assets/ folder:
    python3 download-images.py

All Unsplash images are free for commercial use under the Unsplash License
(https://unsplash.com/license). No attribution required, but attribution
is appreciated and listed in IMAGE_LIBRARY.md.

DO NOT present these inspiration images as completed PGC project work.
PGC project photos live in assets/projects/residential/ and /commercial/.
─────────────────────────────────────────────────────────────────────────────
"""

import urllib.request
import urllib.error
import os
import time
import sys
import ssl

# ── Base path: resolve relative to this script's location ─────────────────
BASE = os.path.dirname(os.path.abspath(__file__))

# ── Helpers ────────────────────────────────────────────────────────────────
def cdnurl(photo_id, w=1400, q=85):
    """Build an Unsplash CDN URL from a bare photo ID (no 'photo-' prefix needed)."""
    return (
        f"https://images.unsplash.com/photo-{photo_id}"
        f"?auto=format&fit=crop&w={w}&q={q}"
    )

def dest(relative_path):
    return os.path.join(BASE, relative_path.replace("/", os.sep))

def download(url, path, label):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if os.path.exists(path):
        print(f"  SKIP  {label}")
        return True
    try:
        ctx = ssl.create_default_context()
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (PGC-ImageLoader/1.0)"},
        )
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = resp.read()
        with open(path, "wb") as f:
            f.write(data)
        size_kb = len(data) // 1024
        print(f"  OK    {label}  ({size_kb} KB)")
        time.sleep(0.4)   # gentle rate limiting
        return True
    except urllib.error.HTTPError as e:
        print(f"  ERR   {label}: HTTP {e.code}")
    except Exception as e:
        print(f"  ERR   {label}: {e}")
    return False


# ── Image manifest ─────────────────────────────────────────────────────────
# Format: (url, relative_dest_path, human_label)
#
# Photo IDs are from Unsplash CDN (images.unsplash.com/photo-{ID}).
# Unsplash License: free for commercial and editorial use.
# Photographer credit is in IMAGE_LIBRARY.md.

IMAGES = [

    # ── KITCHENS ────────────────────────────────────────────────────────────
    # Use for: kitchen remodel pages, inspiration sections, material context.
    # Caption convention: "Kitchen inspiration — material and design reference."

    (
        cdnurl("1682888813726-24adc990e6f7"),
        "inspiration/kitchens/modern_kitchen_white_island_01.jpg",
        "Kitchen — white island + cabinets (Zac Gudakov)",
    ),
    (
        cdnurl("1770063817031-f3b98dff347f"),
        "inspiration/kitchens/modern_kitchen_white_cabinets_02.jpg",
        "Kitchen — white cabinets, stainless, pendant (Clay Banks)",
    ),
    (
        cdnurl("1759239572496-4ec13e7643d6"),
        "inspiration/kitchens/modern_kitchen_wood_countertop_03.jpg",
        "Kitchen — light wood countertop island (Clay Banks)",
    ),

    # ── SHOWERS ─────────────────────────────────────────────────────────────
    # Use for: shower remodel sections, bathroom inspiration.
    # Caption: "Shower inspiration — design and finish reference."

    (
        cdnurl("1722650271096-bf3af586c406"),
        "inspiration/showers/shower_walkin_clean_01.jpg",
        "Shower — clean walk-in, faucet detail (Lisa Anna)",
    ),
    (
        cdnurl("1723642610226-e4ab4626cbc2"),
        "inspiration/showers/shower_walkin_white_bathroom_02.jpg",
        "Shower — white bathroom walk-in enclosure (Lisa Anna)",
    ),

    # ── COMMERCIAL SPACES ───────────────────────────────────────────────────
    # Use for: commercial improvements page, tenant improvement sections.
    # These show empty, clean commercial/residential rooms with wood floors
    # and white walls — appropriate for showing the "before a refresh" state
    # or a clean finished commercial space.
    # Caption: "Commercial space reference — clean interior with LVP flooring."

    (
        cdnurl("1727872496300-57e476478a54"),
        "inspiration/commercial/commercial_room_wood_floor_01.jpg",
        "Commercial — empty room, warm wood floor, white walls (Lisa Anna)",
    ),
    (
        cdnurl("1722650362348-ef3034f6b864"),
        "inspiration/commercial/commercial_room_hardwood_02.jpg",
        "Commercial — empty room, hardwood floor, clean white walls (Alex Tyson)",
    ),

    # Kitchen — white+brown island (Alexander Fife)
    # Used on: Kitchen_Remodels/index.html — Trim & Finish story
    (
        cdnurl("1609280070598-e1770c80b75c"),
        "inspiration/kitchens/modern_kitchen_brown_island_04.jpg",
        "Kitchen — white and brown island, warm tones (Alexander Fife)",
    ),

    # ── ADDITIONAL KITCHENS (extra options) ─────────────────────────────────
    # These use the Unsplash direct download redirect URL as a fallback.
    # They may require a free Unsplash account login to download.
    # If they fail, visit the URL directly in your browser to download manually.

    # Kitchen — white cabinets + stove top (Zac Gudakov)
    # https://unsplash.com/photos/MvY303vrKR0
    # (
    #     "https://unsplash.com/photos/MvY303vrKR0/download?force=true",
    #     "inspiration/kitchens/modern_kitchen_white_stove_04.jpg",
    #     "Kitchen — white cabinets + stove (Zac Gudakov)",
    # ),

    # Kitchen — white cabinets + wood floor (Brian Wangenheim)
    # https://unsplash.com/photos/QJyLk2urg6I
    # (
    #     "https://unsplash.com/photos/QJyLk2urg6I/download?force=true",
    #     "inspiration/kitchens/modern_kitchen_white_wood_floor_05.jpg",
    #     "Kitchen — white cabinets + wood floor (Brian Wangenheim)",
    # ),

    # ── ADDITIONAL SHOWERS & BATHS ───────────────────────────────────────────
    # Modern bathroom + walk-in shower (Yevhenii Deshko)
    # https://unsplash.com/photos/7m6KfidH3iU
    # (
    #     "https://unsplash.com/photos/7m6KfidH3iU/download?force=true",
    #     "inspiration/showers/shower_walkin_modern_03.jpg",
    #     "Shower — modern bathroom walk-in (Yevhenii Deshko)",
    # ),

    # Elegant bathroom modern fixtures
    # https://unsplash.com/photos/xS608no3sTk
    # (
    #     "https://unsplash.com/photos/xS608no3sTk/download?force=true",
    #     "inspiration/bathrooms/bathroom_elegant_modern_01.jpg",
    #     "Bathroom — elegant modern fixtures",
    # ),

    # ── MSI-STYLE MATERIAL INSPIRATION ──────────────────────────────────────
    # For material/finish reference sections.
    # Visit msisurfaces.com/inspiration-gallery/ to download MSI product imagery
    # and place it in:
    #   assets/msi/kitchens/
    #   assets/msi/bathrooms/
    #   assets/msi/showers/
    #   assets/msi/tile/
    #   assets/msi/countertops/
    # MSI imagery may be used on sites of authorized MSI dealers/installers.
    # Confirm usage rights at msisurfaces.com before placing on live site.

]


# ── Run ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print()
    print("PGC Image Library Downloader")
    print("=" * 50)
    print(f"Target: {BASE}")
    print()

    active = [img for img in IMAGES if not img[0].startswith("#")]
    ok = 0
    for url, rel_path, label in active:
        full_path = dest(rel_path)
        if download(url, full_path, label):
            ok += 1

    print()
    print(f"Complete: {ok}/{len(active)} images downloaded.")
    print()
    if ok < len(active):
        print("Some images failed. Check your internet connection and retry.")
        print("For manual downloads, see IMAGE_LIBRARY.md for direct URLs.")
    else:
        print("All images ready. See IMAGE_LIBRARY.md for attribution details.")
    print()
