# Chronos — A Complete Atlas of World History

A static, dependency-free reference site covering the whole of recorded human history:
every realm, every named ruler, every turning point.

```
134 realms    337 rulers    51 chapters    163 dated events    10 eras    11 regions
```

Spanning **4500 BCE → 2026 CE**.

---

## Run it

```bash
node scripts/serve.mjs        # http://localhost:4173
```

No build step. No framework. No dependencies at runtime. Any static file server works —
the site is plain HTML, CSS and ES modules.

## What's inside

| Route | What it is |
| --- | --- |
| `#/` | The atlas front page — deep-time chart, featured realms, rulers, chapters, regions, chronicle |
| `#/timeline` | Every realm on one 6,500-year axis, plus the full dated chronicle filterable by era |
| `#/empires` | All 134 realms, searchable and sortable by date, name, extent or ruler count |
| `#/empires/:id` | A realm's rulers table, achievements, contemporaries and turning points |
| `#/rulers` | All 337 rulers, filterable by era and region |
| `#/rulers/:id` | A ruler's reign, works, legacy, contemporaries and the events of their reign |
| `#/topics` | 51 thematic chapters, filterable by era |
| `#/topics/:id` | A long-form chapter with key dates, key figures and connected realms |
| `#/atlas` | Interactive world map — every realm plotted at its capital, Natural Earth projection |
| `#/eras/:id` | An era's realms, rulers, chapters and chronicle |
| `#/regions/:id` | A region's full sequence of states and rulers |
| `#/search` | Full-page search across the whole archive |

Press <kbd>⌘K</kbd> or <kbd>/</kbd> anywhere for the command palette.

## Project layout

```
index.html                 app shell
css/main.css               the whole design system
js/app.js                  hash router + nav/footer shell
js/ui.js                   shared render helpers, deep-time chart, command palette
js/data/                   the archive
  eras.js                  10 eras
  regions.js               11 regions
  empires/*.js             134 realms
  rulers/*.js              337 rulers
  topics.js                51 chapters
  events.js                163 dated events
  index.js                 merges everything, builds cross-references and aggregates
js/pages/*.js              one renderer per route
assets/
  world.svg                pre-rendered world map (Natural Earth 1, 177 countries)
  world-silhouette.svg     land-only silhouette used as a decorative ground
  world-projection.json    projection constants for plot-to-map alignment
scripts/
  build-map.mjs            regenerates the two SVGs from Natural Earth 110m TopoJSON
  serve.mjs                zero-dependency static server
  geocheck.mjs             data QA — flags any realm plotted over open ocean
```

## Regenerating the map

```bash
npm i --no-save world-atlas@2 topojson-client@3 d3-geo@3
node scripts/build-map.mjs
```

## Data conventions

- Years are plain integers; negative values are BCE. So `-4500` is 4500 BCE and `2026` is 2026 CE.
- Every ruler carries `{id, name, title, empireId, start, end, dynasty, works[], bio, legacy}`.
- Every realm carries `{id, name, aka, region, era, start, end, capital, lat, lon, extent, tagline, description, achievements[], legacy}`.
- `js/data/index.js` derives all back-references (`rulers`, `events`, `topics` on realms; `empire`,
  `eraData`, `topics`, `events` on rulers) so nothing has to be maintained by hand.
- Dates are scholarly approximations. Ancient reigns in particular are contested; where sources
  disagree the archive follows the more commonly cited figure.

## Notes

- The map is drawn once at build time rather than rendered in the browser, so the atlas costs one
  231 KB request instead of a projection library.
- Fonts load asynchronously, so the page paints immediately with system fallbacks and upgrades if
  the network allows.
- All content is client-side; there is no backend, no tracking and no cookies.
