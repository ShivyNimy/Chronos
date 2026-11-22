// ─────────────────────────────────────────────────────────────────────────────
// DATA INDEX — aggregates every source and builds lookup tables
// ─────────────────────────────────────────────────────────────────────────────
import { ERAS, ERA_BY_ID, eraForYear, erasForSpan } from "./eras.js";
import { REGIONS, REGION_BY_ID } from "./regions.js";
import { EMPIRES_ME } from "./empires/me.js";
import { EMPIRES_AFRICA } from "./empires/africa.js";
import { EMPIRES_EUROPE } from "./empires/europe.js";
import { EMPIRES_ASIA_SOUTH_EAST } from "./empires/asia-south-east.js";
import { EMPIRES_REST } from "./empires/rest.js";
import { EMPIRES_MODERN } from "./empires/modern.js";
import { RULERS_ME } from "./rulers/me.js";
import { RULERS_AFRICA } from "./rulers/africa.js";
import { RULERS_EUROPE_ANCIENT } from "./rulers/europe-ancient.js";
import { RULERS_ASIA } from "./rulers/asia.js";
import { RULERS_REST } from "./rulers/rest.js";
import { RULERS_MODERN } from "./rulers/modern.js";
import { RULERS_FILL } from "./rulers/fill.js";
import { TOPICS } from "./topics.js";
import { EVENTS } from "./events.js";

// ── merge ───────────────────────────────────────────────────────────────────
export const EMPIRES = [
  ...EMPIRES_ME,
  ...EMPIRES_AFRICA,
  ...EMPIRES_EUROPE,
  ...EMPIRES_ASIA_SOUTH_EAST,
  ...EMPIRES_REST,
  ...EMPIRES_MODERN,
];

export const RULERS = [
  ...RULERS_ME,
  ...RULERS_AFRICA,
  ...RULERS_EUROPE_ANCIENT,
  ...RULERS_ASIA,
  ...RULERS_REST,
  ...RULERS_MODERN,
  ...RULERS_FILL,
];

// ── order ───────────────────────────────────────────────────────────────────
export const RULERS_BY_DATE = [...RULERS].sort((a, b) => a.start - b.start);
export const EMPIRES_BY_DATE = [...EMPIRES].sort((a, b) => a.start - b.start);
export const EVENTS_SORTED = [...EVENTS].sort((a, b) => a.year - b.year);

// ── lookups ─────────────────────────────────────────────────────────────────
export const EMPIRE_BY_ID = Object.fromEntries(EMPIRES.map((e) => [e.id, e]));
export const RULER_BY_ID = Object.fromEntries(RULERS.map((r) => [r.id, r]));
export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

// ── derived ─────────────────────────────────────────────────────────────────
for (const e of EMPIRES) {
  e.rulers = RULERS.filter((r) => r.empireId === e.id).sort((a, b) => a.start - b.start);
  e.events = EVENTS.filter((ev) => ev.empireId === e.id);
  e.topics = TOPICS.filter((t) => t.empires?.includes(e.id));
  e.eraData = ERA_BY_ID[e.era] || eraForYear(e.start);
  e.regionData = REGION_BY_ID[e.region];
}

for (const r of RULERS) {
  r.empire = EMPIRE_BY_ID[r.empireId] || null;
  r.eraData = ERA_BY_ID[r.empire?.era] || eraForYear(r.start);
  r.topics = TOPICS.filter((t) => t.keyFigures?.includes(r.id));
  r.events = EVENTS.filter((ev) => ev.rulerId === r.id || ev.empireId === r.empireId && ev.year >= r.start && ev.year <= r.end);
}

for (const t of TOPICS) {
  t.figureData = (t.keyFigures || []).map((id) => RULER_BY_ID[id]).filter(Boolean);
  t.empireData = (t.empires || []).map((id) => EMPIRE_BY_ID[id]).filter(Boolean);
  t.eraData = ERA_BY_ID[t.era];
}

for (const ev of EVENTS) {
  ev.eraData = eraForYear(ev.year);
  ev.empire = ev.empireId ? EMPIRE_BY_ID[ev.empireId] : null;
}

// ── era / region aggregation ────────────────────────────────────────────────
for (const era of ERAS) {
  era.empires = EMPIRES.filter((e) => erasForSpan(e.start, e.end).some((x) => x.id === era.id));
  era.rulers = RULERS.filter((r) => r.start >= era.from && r.start <= era.to);
  era.topics = TOPICS.filter((t) => t.era === era.id);
  era.events = EVENTS.filter((ev) => ev.year >= era.from && ev.year <= era.to);
}

for (const region of REGIONS) {
  region.empires = EMPIRES.filter((e) => e.region === region.id);
  region.rulers = RULERS.filter((r) => r.empire?.region === region.id);
}

// ── stats ───────────────────────────────────────────────────────────────────
export const STATS = {
  empires: EMPIRES.length,
  rulers: RULERS.length,
  topics: TOPICS.length,
  events: EVENTS.length,
  eras: ERAS.length,
  regions: REGIONS.length,
  earliest: Math.min(...EMPIRES.map((e) => e.start)),
  latest: Math.max(...EMPIRES.map((e) => e.end)),
};

export { ERAS, REGIONS, EVENTS, TOPICS, ERA_BY_ID, REGION_BY_ID, eraForYear, erasForSpan };

// ── helpers ─────────────────────────────────────────────────────────────────
/** Format a signed year as a human label. */
export function yearLabel(y) {
  if (y === null || y === undefined || Number.isNaN(y)) return "—";
  const abs = Math.abs(Math.round(y));
  if (y < 0) return abs >= 100000 ? `${Math.round(abs / 1000)}k BCE` : `${abs} BCE`;
  return `${abs} CE`;
}

/** Compact year label for axis marks. */
export function yearShort(y) {
  const abs = Math.abs(Math.round(y));
  if (y < 0) return `${abs >= 1000 ? abs / 1000 + "k" : abs} BCE`;
  return `${abs}`;
}

/** Year → 0..1 fraction across a range. */
export function frac(year, from, to) {
  return (year - from) / (to - from);
}

/** Rulers who reigned at the same time as the given ruler. */
export function contemporaries(ruler, limit = 6) {
  return RULERS_BY_DATE.filter(
    (r) => r.id !== ruler.id && r.start <= ruler.end && r.end >= ruler.start
  ).slice(0, limit);
}

/** Empires that overlapped in time. */
export function contemporaryEmpires(empire, limit = 6) {
  return EMPIRES_BY_DATE.filter(
    (e) => e.id !== empire.id && e.start <= empire.end && e.end >= empire.start
  ).slice(0, limit);
}

export function initials(name) {
  return name
    .replace(/[^\p{L}\p{N}\s'-]/gu, "")
    .split(/\s+/)
    .filter((w) => /^[A-ZÀ-Ž]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
