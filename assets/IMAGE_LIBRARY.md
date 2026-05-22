# PGC Image Library

Asset structure and attribution for all imagery used across Prominent General Contractors LLC web properties.

---

## Source Categories

### 1. PGC Project Photos — `assets/projects/`
Real completed work by Prominent General Contractors LLC. These may be presented as PGC work with appropriate project captions.

| Folder | Contents |
|--------|----------|
| `projects/residential/residential-remodel-2022-04-09/` | Kitchen, bath, shower, vanity, flooring, interior details, exterior — all from the April 2022 residential remodel |
| `projects/commercial/` | *(Empty — populate as commercial projects are documented)* |

**Rule:** Never use any other imagery source in a context that implies it is completed PGC work.

---

### 2. Inspiration Imagery — `assets/inspiration/`
Free-use architectural and interior photography from Unsplash. All images are licensed under the [Unsplash License](https://unsplash.com/license) — free for commercial and editorial use, no attribution required. Attribution listed here as a courtesy.

**Rule:** Always caption as "Design and material inspiration" or similar. Never present as PGC project photography.

#### Kitchens — `inspiration/kitchens/`

| File | Photographer | Unsplash URL |
|------|-------------|-------------|
| `modern_kitchen_white_island_01.jpg` | Zac Gudakov | https://unsplash.com/photos/ahQMzqHrw5I |
| `modern_kitchen_white_cabinets_02.jpg` | Clay Banks | https://unsplash.com/photos/j1XuL3mwi8U |
| `modern_kitchen_wood_countertop_03.jpg` | Clay Banks | https://unsplash.com/photos/mhDeeOvBs9o |

Additional options (download manually):
- White cabinets + stove: https://unsplash.com/photos/MvY303vrKR0 (Zac Gudakov)
- White cabinets + wood floor: https://unsplash.com/photos/QJyLk2urg6I (Brian Wangenheim)
- White cabinets + black appliances: https://unsplash.com/photos/EWa9IuheEWo (Aleksandra Dementeva)

#### Showers — `inspiration/showers/`

| File | Photographer | Unsplash URL |
|------|-------------|-------------|
| `shower_walkin_clean_01.jpg` | Lisa Anna | https://unsplash.com/photos/UpJr4WwpIs4 |
| `shower_walkin_white_bathroom_02.jpg` | Lisa Anna | https://unsplash.com/photos/F9db3tf_kiY |

Additional options (download manually):
- Modern walk-in shower: https://unsplash.com/photos/7m6KfidH3iU (Yevhenii Deshko)
- Bathroom walk-in (glass): https://unsplash.com/photos/EctrGV2TKBY (Yevhenii Deshko)

#### Bathrooms — `inspiration/bathrooms/`

Additional options (download manually):
- Elegant modern bathroom: https://unsplash.com/photos/xS608no3sTk
- Luxury bathroom: https://unsplash.com/photos/L6LSzjhWI0Y
- Modern bathroom, full view: https://unsplash.com/photos/8WG4EXvdM4M

#### Commercial Spaces — `inspiration/commercial/`

| File | Photographer | Unsplash URL |
|------|-------------|-------------|
| `commercial_room_wood_floor_01.jpg` | Lisa Anna | https://unsplash.com/photos/XGTvP4qG7aY |
| `commercial_room_hardwood_02.jpg` | Alex Tyson | https://unsplash.com/photos/uN6nxTYqMCg |

Additional options (download manually):
- Empty room renovation: https://unsplash.com/photos/JLoTZGwmOZ8 (Alex Tyson)
- Empty room white + wood: https://unsplash.com/photos/QspR0F-ezyM

#### Cabinetry — `inspiration/cabinetry/`
Additional options (download manually):
- White cabinets + black appliances detail: https://unsplash.com/photos/EWa9IuheEWo

#### Countertops — `inspiration/countertops/`
Visit: https://unsplash.com/s/photos/quartz-countertop
Visit: https://unsplash.com/s/photos/marble-countertop

#### Carpentry & Details — `inspiration/carpentry/` and `inspiration/details/`
Visit: https://unsplash.com/s/photos/trim-carpentry
Visit: https://unsplash.com/s/photos/interior-finish

#### Exteriors — `inspiration/exteriors/`
Visit: https://unsplash.com/s/photos/storefront
Visit: https://unsplash.com/s/photos/commercial-building

---

### 3. MSI Product Imagery — `assets/msi/`
Product photography from MSI Surfaces (msisurfaces.com). Licensed for use by authorized MSI dealers and installers. PGC should confirm dealer/installer status before placing MSI imagery on live public pages.

**MSI Gallery:** https://www.msisurfaces.com/inspiration-gallery/
**Commercial Gallery:** https://www.msisurfaces.com/inspiration-gallery/commercial/
**Quartz Gallery:** https://www.msisurfaces.com/quartz-countertops/quartz-countertop-gallery/

**Rule:** Caption all MSI imagery as "Material shown: [Product Name] by MSI Surfaces" or "Material inspiration courtesy of MSI." Never present as completed PGC project photography.

| Folder | Use |
|--------|-----|
| `msi/kitchens/` | Kitchen room scenes with MSI countertops or tile |
| `msi/bathrooms/` | Bathroom room scenes with MSI tile or surfaces |
| `msi/showers/` | Shower tile room scenes from MSI |
| `msi/tile/` | MSI tile product photography |
| `msi/lvp/` | MSI LVP product and room photography |
| `msi/countertops/` | MSI quartz and stone countertop imagery |
| `msi/textures/` | Material texture detail photography |
| `msi/commercial/` | MSI commercial application room scenes |

---

## Quick Reference: Caption Templates

```
PGC Project:       "Completed [scope] — [neighborhood], Houston. PGC project archive."
Inspiration:       "Design and finish inspiration — [category] reference."
MSI Product:       "Material shown: [Product Name] by MSI Surfaces."
MSI Room Scene:    "Room scene courtesy of MSI Surfaces — [description]."
```

---

## How to Download

Run the provided script from inside `assets/`:

```bash
cd /path/to/03_Website/assets
python3 download-images.py
```

Requires Python 3.6+ and an internet connection. No additional packages needed.

---

*Last updated: 2026-05-10*
