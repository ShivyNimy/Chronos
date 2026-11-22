// ─────────────────────────────────────────────────────────────────────────────
// UI — shared helpers, icons, search palette
// ─────────────────────────────────────────────────────────────────────────────
import {
  ERAS, REGIONS, ERA_BY_ID, REGION_BY_ID,
  EMPIRES, RULERS, TOPICS, EVENTS,
  EMPIRE_BY_ID, RULER_BY_ID, TOPIC_BY_ID,
  eraForYear, yearLabel,
} from "./data/index.js";

/* ── escaping ───────────────────────────────────────────────────────────── */
export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ── icons ──────────────────────────────────────────────────────────────── */
const ICONS = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4L21 21"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  arrowUpRight: '<path d="M6 18L18 6M8 6h10v10"/>',
  chevronRight: '<path d="M9 5l7 7-7 7"/>',
  chevronDown: '<path d="M5 9l7 7 7-7"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.5 3.2 3.5 14.8 0 18M12 3c-3.5 3.2-3.5 14.8 0 18"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 016.5 2H20v17H6.5A2.5 2.5 0 004 21.5V4.5z"/><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>',
  crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/><path d="M16 5.2a3.2 3.2 0 010 6.1M18 14.4c2.2.7 3.5 2.6 3.5 5.6"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12.5l9 5 9-5M3 17l9 5 9-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  quote: '<path d="M9 7H4v6h5v3a3 3 0 01-3 3M19 7h-5v6h5v3a3 3 0 01-3 3"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/>',
};

export function icon(name, cls = "") {
  const d = ICONS[name] || "";
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

/* ── formatting ─────────────────────────────────────────────────────────── */
export function yearRange(from, to) {
  if (from === to) return yearLabel(from);
  const a = Math.round(from), b = Math.round(to);
  // Collapse a shared era suffix: "1206 — 1227 CE" rather than "1206 CE — 1227 CE".
  if (a < 0 && b < 0) return `${Math.abs(a)} — ${Math.abs(b)} BCE`;
  if (a >= 0 && b >= 0) return `${a} — ${b} CE`;
  return `${yearLabel(a)} — ${yearLabel(b)}`;
}

export function fmtExtent(n) {
  if (!n) return "—";
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 ? 1 : 0)}M km²`;
  return `${Math.round(n / 1000)}k km²`;
}

export function fmtNum(n) {
  return Number(n).toLocaleString("en-US");
}

export function durationYears(from, to) {
  return Math.max(0, to - from);
}

export function durationLabel(from, to) {
  const d = durationYears(from, to);
  if (d < 100) return `${d} years`;
  if (d < 1000) return `${Math.round(d / 100) * 100} years`;
  return `${(d / 1000).toFixed(1)}k years`;
}

/* ── small components ───────────────────────────────────────────────────── */
export function eraChip(era, { link = true } = {}) {
  if (!era) return "";
  const label = `<span class="chip" style="--c:${era.color}">${esc(era.short || era.name)}</span>`;
  return link ? `<a href="#/eras/${era.id}" title="${esc(era.name)}">${label}</a>` : label;
}

export function regionChip(region) {
  if (!region) return "";
  return `<a href="#/regions/${region.id}" class="chip plain">${esc(region.short)}</a>`;
}

export function statBlock(n, label, sup = "") {
  return `<div class="stat"><div class="stat-n">${esc(n)}${sup ? `<sup>${esc(sup)}</sup>` : ""}</div><div class="stat-l">${esc(label)}</div></div>`;
}

export function reignBar(ruler, totalYears = 100) {
  const start = ruler.start;
  const end = ruler.end || start + 1;
  const dur = Math.max(1, end - start);
  const w = Math.min(100, (dur / totalYears) * 100);
  return `<div class="reign-bar" title="${esc(yearRange(start, end))}"><i style="width:${Math.max(4, w)}%;--c:${esc(ruler.eraData?.color || "#9c3a1e")}"></i></div>`;
}

export function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((it, i) => {
      const last = i === items.length - 1;
      const txt = esc(it.label);
      const node = it.href ? `<a href="${it.href}">${txt}</a>` : `<span>${txt}</span>`;
      return `${i ? icon("chevronRight") : ""}${node}`;
    })
    .join("")}</nav>`;
}

export function sectionHead({ kicker, index, title, lede = "", more = "", dark = false }) {
  return `<div class="section-head">
    <div>
      <div class="section-kicker">${esc(kicker)}${index ? `<span>/ ${esc(index)}</span>` : ""}</div>
      <h2 class="section-title">${title}</h2>
    </div>
    <div class="row-between" style="align-items:end">
      ${lede ? `<div class="section-lede">${lede}</div>` : "<div></div>"}
      ${more}
    </div>
  </div>`;
}

export function moreLink(href, label = "View all") {
  return `<a class="section-more" href="${href}">${esc(label)} ${icon("arrowRight")}</a>`;
}

/* ── empire / ruler cards ───────────────────────────────────────────────── */
export function empireCard(e, opts = {}) {
  const { showDesc = true } = opts;
  const era = e.eraData;
  const region = e.regionData;
  return `<a class="card" href="#/empires/${e.id}" style="--c:${era.color}">
    <div class="card-top">
      ${eraChip(era)}
      <span class="card-dates">${esc(yearRange(e.start, e.end))}</span>
    </div>
    <h3 class="card-name">${esc(e.name)}</h3>
    ${e.aka ? `<div class="card-aka">${esc(e.aka)}</div>` : ""}
    ${showDesc ? `<p class="card-tag">${esc(e.tagline)}</p>` : ""}
    <div class="card-meta">
      <span>${esc(region?.short || "")}</span>
      <span><b>${e.rulers.length}</b> rulers</span>
      <span>${esc(durationLabel(e.start, e.end))}</span>
    </div>
  </a>`;
}

export function rulerCard(r) {
  const era = r.eraData;
  const ini = initials(r.name);
  return `<a class="rcard" href="#/rulers/${r.id}" style="--c:${era.color}">
    <div class="medallion">${esc(ini)}</div>
    <div class="rcard-name">${esc(r.name)}</div>
    <div class="rcard-title">${esc(r.title)}</div>
    <div class="rcard-foot">
      <b>${esc(r.empire?.name || "")}</b>
      <span>${esc(yearRange(r.start, r.end))}</span>
    </div>
  </a>`;
}

export function initials(name) {
  const parts = String(name)
    .replace(/[^\p{L}\p{N}\s'-]/gu, "")
    .split(/\s+/)
    .filter((w) => w.length && /^[A-ZÀ-Ž]/.test(w));
  if (!parts.length) return "?";
  return parts.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/* ── deep time chart ────────────────────────────────────────────────────── */
/** Luminance-aware text colour for a bar background. */
export function textOn(hex) {
  const h = String(hex).replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.58 ? "#16120e" : "#fffdf6";
}

export function deepTimeChart(opts = {}) {
  const {
    empires = EMPIRES,
    from = -4500,
    to = 2026,
    pxPerYear = 0.62,
    groupByRegion = true,
    id = "dt",
  } = opts;

  const range = to - from;
  const width = Math.round(range * pxPerYear);
  const pct = (y) => ((y - from) / range) * 100;

  const eraBands = ERAS.filter((e) => e.to > from && e.from < to)
    .map((e) => {
      const l = Math.max(0, pct(Math.max(from, e.from)));
      const r = Math.min(100, pct(Math.min(to, e.to)));
      return `<div class="dt-era-band" style="--c:${e.color};left:${l}%;width:${Math.max(0, r - l)}%"></div>`;
    })
    .join("");

  const ticks = [];
  const step = range > 3000 ? 500 : range > 1000 ? 250 : 100;
  for (let y = Math.ceil(from / step) * step; y <= to; y += step) {
    const major = y % 1000 === 0;
    ticks.push(
      `<div class="dt-tick ${major ? "major" : ""}" style="left:${pct(y)}%">${yearShortLabel(y)}</div>`
    );
  }

  const groups = [];
  if (groupByRegion) {
    const byRegion = new Map();
    for (const e of empires) byRegion.set(e.region, [...(byRegion.get(e.region) || []), e]);
    for (const r of REGIONS) {
      const list = byRegion.get(r.id);
      if (!list || !list.length) continue;
      groups.push({ name: r.short, full: r.name, id: r.id, items: list });
      byRegion.delete(r.id);
    }
    for (const [rid, list] of byRegion) {
      groups.push({
        name: REGION_BY_ID[rid]?.short || rid,
        full: REGION_BY_ID[rid]?.name || rid,
        id: rid,
        items: list,
      });
    }
  } else {
    groups.push({ name: "All", full: "All realms", id: "all", items: empires });
  }

  const LANE_H = 26;

  function pack(items) {
    const sorted = [...items].sort((a, b) => a.start - b.start || b.end - a.end);
    const lanes = [];
    const place = {};
    for (const e of sorted) {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        if (lanes[i] < e.start) {
          lanes[i] = e.end;
          place[e.id] = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        lanes.push(e.end);
        place[e.id] = lanes.length - 1;
      }
    }
    return { count: lanes.length, place };
  }

  const packed = groups.map((g) => ({ ...g, ...pack(g.items) }));

  let sideRows = "";
  let laneRows = "";
  for (const g of packed) {
    sideRows += `<div class="dt-side-row" style="height:${g.count * LANE_H}px" title="${esc(g.full)}">
      <span class="dt-region-name">${esc(g.name)}</span>
      <span class="dt-region-count">${g.items.length} realm${g.items.length === 1 ? "" : "s"}</span>
    </div>`;

    const rows = Array.from({ length: g.count }, () => []);
    for (const e of g.items) rows[g.place[e.id]].push(e);

    laneRows += `<div class="dt-region" data-region="${esc(g.id)}">`;
    for (const row of rows) {
      laneRows += `<div class="dt-lane" style="height:${LANE_H}px">`;
      for (const e of row) {
        const left = pct(Math.max(e.start, from));
        const right = pct(Math.min(e.end, to));
        const w = Math.max(0.3, right - left);
        const dur = e.end - e.start;
        const showLabel = dur > range * 0.032;
        const fg = textOn(e.eraData.color);
        laneRows += `<a class="dt-bar" href="#/empires/${e.id}" style="--c:${e.eraData.color};--fg:${fg};left:${left}%;width:${w}%" data-tip="${esc(e.name)}|${esc(yearRange(e.start, e.end))}" title="${esc(e.name)} — ${esc(yearRange(e.start, e.end))}"><span class="dt-bar-label" style="color:${fg}">${showLabel ? esc(e.name) : ""}</span></a>`;
      }
      laneRows += `</div>`;
    }
    laneRows += `</div>`;
  }

  const totalH = packed.reduce((a, g) => a + g.count * LANE_H, 0);

  return `<div class="dt-shell" id="${id}">
    <div class="dt-toolbar">
      <span class="mono">${icon("clock")} Deep time · ${fmtNum(Math.round(range))} years</span>
      <span class="mono dim-2">Scroll horizontally</span>
    </div>
    <div class="dt-main">
      <div class="dt-side">
        <div class="dt-side-head"><span class="mono dim-2">Region</span></div>
        <div class="dt-side-rows">${sideRows}</div>
      </div>
      <div class="dt-scroll">
        <div class="dt-stage" style="width:${width}px">
          <div class="dt-axis">${ticks.join("")}</div>
          <div class="dt-body" style="height:${totalH}px">
            ${eraBands}
            ${laneRows}
          </div>
        </div>
      </div>
    </div>
    <div class="dt-legend">
      ${ERAS.map((e) => `<span class="dt-legend-item" style="--c:${e.color}"><i></i>${esc(e.short)}</span>`).join("")}
    </div>
  </div>`;
}

export function yearShortLabel(y) {
  const abs = Math.abs(y);
  if (y < 0) return `${abs >= 1000 ? abs / 1000 + "k" : abs} BCE`;
  return `${abs}`;
}

export function mountDeepTime(root, { onBar } = {}) {
  const shell = root.querySelector(".dt-shell");
  if (!shell) return;
  let tip = document.querySelector(".dt-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "dt-tooltip";
    document.body.appendChild(tip);
  }

  shell.querySelectorAll(".dt-bar").forEach((bar) => {
    bar.addEventListener("mouseenter", (ev) => {
      const [name, dates] = bar.dataset.tip.split("|");
      tip.innerHTML = `<b>${esc(name)}</b><span>${esc(dates)}</span>`;
      tip.classList.add("on");
      position(ev);
    });
    bar.addEventListener("mousemove", position);
    bar.addEventListener("mouseleave", () => tip.classList.remove("on"));
    bar.addEventListener("click", () => onBar && onBar(bar));
  });

  function position(ev) {
    const pad = 14;
    let x = ev.clientX + pad;
    let y = ev.clientY + pad;
    const r = tip.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 12) x = ev.clientX - r.width - pad;
    if (y + r.height > window.innerHeight - 12) y = ev.clientY - r.height - pad;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }

  // cleanup helper
  return () => tip.remove();
}

/* ── reveal on scroll ───────────────────────────────────────────────────── */
let revealObserver = null;
export function mountReveal(root = document) {
  const els = [...root.querySelectorAll(".reveal")];
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          revealObserver.unobserve(en.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  els.forEach((el) => revealObserver.observe(el));
}

/* ── search index ───────────────────────────────────────────────────────── */
let INDEX = null;
function buildIndex() {
  INDEX = [
    ...RULERS.map((r) => ({
      type: "Ruler",
      id: r.id,
      title: r.name,
      sub: r.title,
      extra: r.empire?.name || "",
      href: `#/rulers/${r.id}`,
      c: r.eraData?.color,
      era: r.eraData?.short,
      _hay: `${r.name} ${r.title} ${r.empire?.name || ""} ${r.empire?.aka || ""}`.toLowerCase(),
    })),
    ...EMPIRES.map((e) => ({
      type: "Realm",
      id: e.id,
      title: e.name,
      sub: e.aka || e.tagline,
      extra: yearRange(e.start, e.end),
      href: `#/empires/${e.id}`,
      c: e.eraData?.color,
      era: e.eraData?.short,
      _hay: `${e.name} ${e.aka || ""} ${e.tagline || ""} ${e.capital || ""} ${e.regionData?.name || ""}`.toLowerCase(),
    })),
    ...TOPICS.map((t) => ({
      type: "Chapter",
      id: t.id,
      title: t.title,
      sub: t.subtitle,
      extra: t.eraData?.short,
      href: `#/topics/${t.id}`,
      c: t.eraData?.color,
      era: t.eraData?.short,
      _hay: `${t.title} ${t.subtitle} ${t.tags?.join(" ") || ""}`.toLowerCase(),
    })),
    ...EVENTS.map((ev) => ({
      type: "Event",
      id: ev.id,
      title: ev.title,
      sub: ev.description,
      extra: ev.yearLabel,
      href: `#/timeline?event=${ev.id}`,
      c: ev.eraData?.color,
      era: ev.eraData?.short,
      _hay: `${ev.title} ${ev.description} ${ev.yearLabel}`.toLowerCase(),
    })),
    ...ERAS.map((e) => ({
      type: "Era",
      id: e.id,
      title: e.name,
      sub: e.tagline,
      extra: `${yearLabel(e.from)} — ${yearLabel(e.to)}`,
      href: `#/eras/${e.id}`,
      c: e.color,
      era: e.short,
      _hay: `${e.name} ${e.tagline} ${e.blurb}`.toLowerCase(),
    })),
    ...REGIONS.map((r) => ({
      type: "Region",
      id: r.id,
      title: r.name,
      sub: r.tagline,
      extra: `${r.empires.length} realms`,
      href: `#/regions/${r.id}`,
      c: "#857866",
      era: "",
      _hay: `${r.name} ${r.tagline} ${r.blurb}`.toLowerCase(),
    })),
  ];
}

const SUGGESTIONS = [
  "Ruler:genghis-khan", "Ruler:cleopatra-7", "Ruler:akbar", "Ruler:augustus",
  "Realm:rome", "Realm:ottoman", "Realm:mali", "Realm:han",
  "Chapter:roman-empire", "Chapter:silk-road", "Chapter:industrial-revolution", "Chapter:cold-war",
  "Era:medieval", "Region:europe",
];

export function searchAll(q, limit = 40) {
  if (!INDEX) buildIndex();
  const query = q.trim().toLowerCase();
  if (!query) {
    const picks = [];
    for (const key of SUGGESTIONS) {
      const [type, id] = key.split(":");
      const hit = INDEX.find((i) => i.type === type && i.id === id);
      if (hit) picks.push(hit);
    }
    return picks.slice(0, limit);
  }
  const tokens = query.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const item of INDEX) {
    let score = 0;
    const hay = item._hay;
    const title = item.title.toLowerCase();
    for (const t of tokens) {
      if (!t) continue;
      if (title.startsWith(t)) score += 26;
      else if (title.includes(t)) score += 16;
      else if (hay.includes(t)) score += 6;
      else {
        score = -1;
        break;
      }
    }
    if (score > 0) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return scored.slice(0, limit).map((s) => s.item);
}

/* ── command palette ────────────────────────────────────────────────────── */
export function initPalette() {
  const overlay = document.getElementById("overlay");
  let sel = 0;
  let results = [];
  let active = false;

  function render() {
    overlay.innerHTML = `<div class="palette" role="dialog" aria-modal="true" aria-label="Search the atlas">
      <div class="palette-top">
        ${icon("search")}
        <input type="text" id="pal-input" placeholder="Search rulers, empires, chapters, events…" autocomplete="off" spellcheck="false" />
        <kbd>esc</kbd>
      </div>
      <div class="palette-body" id="pal-body"></div>
      <div class="palette-foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>esc</kbd> close</span>
      </div>
    </div>`;
    const input = overlay.querySelector("#pal-input");
    const body = overlay.querySelector("#pal-body");
    input.focus();

    const paint = () => {
      if (!results.length) {
        body.innerHTML = `<div class="pal-empty">No matches. Try a ruler, realm, era or theme.</div>`;
        return;
      }
      let html = "";
      let lastType = "";
      results.forEach((r, i) => {
        if (r.type !== lastType) {
          html += `<div class="pal-group">${esc(r.type)}s</div>`;
          lastType = r.type;
        }
        const ini = r.type === "Ruler" ? initials(r.title) : r.type === "Realm" ? "R" : r.type === "Chapter" ? "T" : r.type === "Event" ? "E" : "·";
        html += `<div class="pal-item ${i === sel ? "sel" : ""}" data-i="${i}">
          <span class="pi" style="--c:${r.c || "#857866"}">${esc(ini)}</span>
          <span class="pt"><b>${esc(r.title)}</b> · ${esc(r.sub)}</span>
          <span class="ps">${esc(r.extra || r.era || "")}</span>
        </div>`;
      });
      body.innerHTML = html;
      body.querySelectorAll(".pal-item").forEach((el) => {
        el.addEventListener("click", () => go(el.dataset.i));
        el.addEventListener("mousemove", () => {
          sel = +el.dataset.i;
          body.querySelectorAll(".pal-item").forEach((x, j) => x.classList.toggle("sel", j === sel));
        });
      });
      const s = body.querySelector(".pal-item.sel");
      if (s) s.scrollIntoView({ block: "nearest" });
    };

    const go = (i) => {
      const r = results[+i];
      if (!r) return;
      close();
      location.hash = r.href.replace(/^#/, "");
    };

    const refresh = () => {
      results = searchAll(input.value);
      sel = 0;
      paint();
    };

    input.addEventListener("input", refresh);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        sel = Math.min(results.length - 1, sel + 1);
        paint();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        sel = Math.max(0, sel - 1);
        paint();
      } else if (e.key === "Enter") {
        e.preventDefault();
        go(sel);
      } else if (e.key === "Escape") {
        close();
      }
    });

    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
    document.addEventListener("keydown", escClose);

    refresh();
    active = true;
  }

  function escClose(e) {
    if (e.key === "Escape") close();
  }

  function close() {
    if (!active) return;
    active = false;
    overlay.hidden = true;
    overlay.innerHTML = "";
    document.removeEventListener("keydown", escClose);
  }

  function open() {
    overlay.hidden = false;
    render();
  }

  // global shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      active ? close() : open();
    }
    if (e.key === "/" && !active && !/input|textarea|select/i.test(document.activeElement?.tagName || "")) {
      e.preventDefault();
      open();
    }
  });

  return { open, close };
}
