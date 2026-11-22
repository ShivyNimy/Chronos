// ─────────────────────────────────────────────────────────────────────────────
// ERA — detail
// ─────────────────────────────────────────────────────────────────────────────
import { ERA_BY_ID, ERAS, EMPIRES, RULERS, TOPICS, EVENTS, eraForYear } from "../data/index.js";
import {
  esc, icon, crumbs, yearRange, empireCard, rulerCard,
} from "../ui.js";

export function renderEra(id) {
  const era = ERA_BY_ID[id];
  if (!era) {
    return {
      title: "Not found",
      html: `<div class="wrap page" style="padding-top:200px;padding-bottom:200px"><h1 class="page-title">Era not found.</h1><a class="btn btn-rust" style="margin-top:24px" href="#/timeline">Back to the timeline</a></div>`,
    };
  }
  const idx = ERAS.indexOf(era);
  const prev = ERAS[idx - 1];
  const next = ERAS[idx + 1];

  const empires = EMPIRES.filter((e) => e.start <= era.to && e.end >= era.from);
  const rulers = RULERS.filter((r) => r.start >= era.from && r.start <= era.to);
  const topics = TOPICS.filter((t) => t.era === era.id);
  const events = EVENTS.filter((e) => e.year >= era.from && e.year <= era.to);

  const html = `
  <div class="page">
    <header class="detail-hero" style="--c:${era.color};background:linear-gradient(180deg, color-mix(in srgb, ${era.color} 9%, var(--paper)) 0%, var(--paper) 78%)">
      <div class="wrap">
        ${crumbs([{ label: "Timeline", href: "#/timeline" }, { label: era.name }])}
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:6px">
          <span class="chip" style="--c:${era.color}">${esc(era.name)}</span>
          <span class="chip plain">${esc(era.fromLabel)} — ${esc(era.toLabel)}</span>
        </div>
        <div class="mono dim-2" style="margin-bottom:4px">Era ${String(idx + 1).padStart(2, "0")} of ${ERAS.length}</div>
        <h1 class="detail-name" style="margin:0 0 10px">${esc(era.name)}</h1>
        <div class="detail-title" style="font-size:clamp(1.15rem,2vw,1.6rem)">${esc(era.tagline)}</div>
        <p class="page-sub" style="font-family:var(--serif);max-width:58ch;font-size:clamp(1rem,1.4vw,1.15rem)">${esc(era.blurb)}</p>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        <div class="stat-strip">
          <div><div class="k">Span</div><div class="v">${esc(era.fromLabel)} — ${esc(era.toLabel)}<small>${esc(yearRange(era.from, era.to))}</small></div></div>
          <div><div class="k">Realms</div><div class="v">${empires.length}<small>active in this era</small></div></div>
          <div><div class="k">Rulers</div><div class="v">${rulers.length}<small>reigning in this era</small></div></div>
          <div><div class="k">Chapters</div><div class="v">${topics.length}<small>thematic</small></div></div>
        </div>

        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:26px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Realms of the ${esc(era.short)}</h2>
          <span class="mono dim-2">${empires.length} realms</span>
        </div>
        <div class="grid-3">${empires.slice(0, 12).map(empireCard).join("")}</div>
        ${empires.length > 12 ? `<div style="margin-top:26px"><a class="section-more" href="#/empires?era=${era.id}">See all ${empires.length} realms of this era ${icon("arrowRight")}</a></div>` : ""}

        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin:56px 0 26px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Rulers of the ${esc(era.short)}</h2>
          <span class="mono dim-2">${rulers.length} rulers</span>
        </div>
        <div class="hscroll" style="margin-left:0;margin-right:0;padding-left:0;padding-right:0">
          ${rulers.slice(0, 14).map(rulerCard).join("")}
        </div>

        ${topics.length ? `<div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin:56px 0 24px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Chapters of the ${esc(era.short)}</h2>
          <span class="mono dim-2">${topics.length} chapters</span>
        </div>
        <div class="topic-list">
          ${topics.map((t) => `<a class="trow" href="#/topics/${t.id}" style="--c:${era.color}">
            <span class="trow-num">${String(TOPICS.indexOf(t) + 1).padStart(2, "0")}</span>
            <span class="trow-title">${esc(t.title)}<small>${esc(t.subtitle)}</small></span>
            <span class="trow-era">${esc(era.short)}</span>
          </a>`).join("")}
        </div>` : ""}

        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin:56px 0 22px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Chronicle</h2>
          <span class="mono dim-2">${events.length} events</span>
        </div>
        <div class="grid-2" style="gap:0 clamp(28px,4vw,64px)">
          <div class="chronicle">${events.slice(0, Math.ceil(events.length / 2)).map(chronicleItem).join("")}</div>
          <div class="chronicle">${events.slice(Math.ceil(events.length / 2)).map(chronicleItem).join("")}</div>
        </div>

        <div class="pager">
          ${prev ? `<a href="#/eras/${prev.id}"><span class="pk">← Previous era</span><span class="pv">${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a href="#/eras/${next.id}"><span class="pk">Next era →</span><span class="pv">${esc(next.name)}</span></a>` : "<span></span>"}
        </div>
      </div>
    </section>
  </div>`;

  return { title: era.name, html };
}

function chronicleItem(ev) {
  return `<a class="citem" href="#/timeline?event=${ev.id}" style="--c:${ev.eraData?.color};grid-template-columns:96px minmax(0,1fr)">
    <div class="citem-year" style="padding-right:18px">${esc(ev.yearLabel)}</div>
    <div class="citem-body" style="padding-left:22px"><span class="citem-dot"></span>
      <div class="citem-title">${esc(ev.title)}</div>
      <div class="citem-desc">${esc(ev.description)}</div>
    </div>
  </a>`;
}
