#!/usr/bin/env node
// Data QA: flags any realm whose capital coordinates fall over open ocean.
// A handful of coastal and island capitals are expected to trip this —
// 110m land resolution is coarse.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { geoContains } from "d3-geo";
import * as topojson from "topojson-client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topo = JSON.parse(fs.readFileSync(path.join(ROOT, "node_modules/world-atlas/land-110m.json"), "utf8"));
const land = topojson.feature(topo, topo.objects.land);

const { EMPIRES } = await import(path.join(ROOT, "js/data/index.js"));

let off = 0;
for (const e of EMPIRES) {
  if (typeof e.lat !== "number" || typeof e.lon !== "number") {
    console.log("NO COORDS ", e.id);
    off++;
    continue;
  }
  if (!geoContains(land, [e.lon, e.lat])) {
    console.log("OFF LAND  ", e.id.padEnd(20), e.name.padEnd(28), `${e.lon}, ${e.lat}`, "→", e.regionData?.short);
    off++;
  }
}
console.log(`\nchecked ${EMPIRES.length} realms · ${off} over water`);
