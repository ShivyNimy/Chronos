// Pre-renders an accurate world map to a static SVG using Natural Earth data.
// Run: node scripts/build-map.mjs
import fs from "node:fs";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import * as topojson from "topojson-client";

const topo = JSON.parse(
  fs.readFileSync(new URL("../node_modules/world-atlas/countries-110m.json", import.meta.url), "utf8")
);

const W = 1200;
const projection = geoNaturalEarth1();
const raw = geoNaturalEarth1();
// naturalEarth1Raw at lambda=PI gives x = PI * 0.8707 = 2.7354
const k = (W / 2) / (Math.PI * 0.8707 - 0.0);
projection.scale(k).translate([W / 2, 0]).precision(0.1);

// Measure height
const rawFn = (lambda, phi) => {
  const phi2 = phi * phi, phi4 = phi2 * phi2;
  return [
    lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
    phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))),
  ];
};
const [, maxY] = rawFn(0, Math.PI / 2);
const H = Math.round(2 * k * maxY);

projection.translate([W / 2, H / 2]);

const path = geoPath(projection, null);
const countries = topojson.feature(topo, topo.objects.countries).features;
const land = topojson.feature(topo, topo.objects.land);

const fmt = (d) => {
  const s = d.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
};
const roundPath = (p) => p.replace(/-?\d+\.\d+/g, (m) => fmt(parseFloat(m)));

let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet">\n`;
out += `<defs><clipPath id="mapclip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>\n`;
out += `<g clip-path="url(#mapclip)">\n`;

// Graticule
const grat = geoGraticule10();
const gratPath = path(grat);
if (gratPath) out += `<path class="graticule" d="${roundPath(gratPath)}"/>\n`;

// Land silhouette
out += `<path class="land" d="${roundPath(path(land))}"/>\n`;

// Countries
out += `<g class="countries">\n`;
for (const f of countries) {
  const d = path(f);
  if (!d) continue;
  const id = f.id || "";
  const name = (f.properties?.name || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  out += `<path class="country" data-c="${id}" data-n="${name}" d="${roundPath(d)}"/>\n`;
}
out += `</g>\n</g>\n</svg>\n`;

fs.mkdirSync("assets", { recursive: true });
fs.writeFileSync("assets/world.svg", out);

// Projection helper constants for runtime marker placement
const projInfo = { W, H, k, cx: W / 2, cy: H / 2 };
fs.writeFileSync("assets/world-projection.json", JSON.stringify(projInfo, null, 2));

console.log(`Wrote assets/world.svg — ${(out.length / 1024).toFixed(1)} KB, ${countries.length} countries, viewBox ${W}x${H}`);
console.log("projection:", projInfo);

// ── decorative silhouette (land only, filled white) ─────────────────────────
const landOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path fill="#fff" d="${roundPath(path(land))}"/></svg>\n`;
fs.writeFileSync("assets/world-silhouette.svg", landOnly);
console.log(`Wrote assets/world-silhouette.svg — ${(landOnly.length / 1024).toFixed(1)} KB`);
