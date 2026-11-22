// ─────────────────────────────────────────────────────────────────────────────
// TOPIC — detail
// ─────────────────────────────────────────────────────────────────────────────
import { TOPIC_BY_ID, TOPICS, RULERS, EMPIRES, yearLabel } from "../data/index.js";
import {
  esc, icon, crumbs, eraChip, yearRange, rulerCard, empireCard,
} from "../ui.js";

export function renderTopic(id) {
  const t = TOPIC_BY_ID[id];
  if (!t) {
    return {
      title: "Not found",
      html: `<div class="wrap page" style="padding-top:200px;padding-bottom:200px"><h1 class="page-title">Chapter not found.</h1><p class="page-sub">No chapter with that identifier exists in the archive.</p><a class="btn btn-rust" style="margin-top:24px" href="#/topics">Back to chapters</a></div>`,
    };
  }
  const idx = TOPICS.indexOf(t);
  const prev = TOPICS[idx - 1];
  const next = TOPICS[idx + 1];
  const num = String(idx + 1).padStart(2, "0");

  const html = `
  <div class="page">
    <header class="detail-hero" style="--c:${t.eraData.color}">
      <div class="wrap">
        ${crumbs([{ label: "Chapters", href: "#/topics" }, { label: t.title }])}
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:6px">
          ${eraChip(t.eraData)}
          <span class="chip plain">${esc(yearRange(t.from, t.to))}</span>
        </div>
        <div class="mono" style="color:var(--ink-4);margin-bottom:6px">Chapter ${num} of ${TOPICS.length}</div>
        <h1 class="detail-name" style="margin:0 0 12px">${esc(t.title)}</h1>
        <div class="detail-title" style="font-size:clamp(1.15rem,2vw,1.6rem)">${esc(t.subtitle)}</div>
        <p class="page-sub" style="font-family:var(--serif);font-style:italic;max-width:52ch">${esc(t.summary)}</p>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        <div class="detail-grid">
          <div class="prose">
            ${t.body.map((p) => `<p>${esc(p)}</p>`).join("")}
            <h3>Key dates</h3>
            <div class="works">
              ${t.keyDates
                .map(
                  (d) => `<div class="work"><div style="display:flex;gap:14px;align-items:baseline"><span class="mono" style="color:var(--rust);min-width:86px;font-size:9.5px;letter-spacing:.06em">${esc(yearLabel(d.year))}</span><p style="flex:1">${esc(d.label)}</p></div></div>`
                )
                .join("")}
            </div>
          </div>
          <aside>
            <div class="aside-block">
              <div class="aside-title">In this chapter</div>
              <div class="kv"><span class="k">Period</span><span class="v">${esc(yearRange(t.from, t.to))}</span></div>
              <div class="kv"><span class="k">Era</span><span class="v"><a href="#/eras/${t.era}">${esc(t.eraData.name)}</a></span></div>
              <div class="kv"><span class="k">Region</span><span class="v">${esc(t.region || "—")}</span></div>
              <div class="kv"><span class="k">Key figures</span><span class="v">${t.figureData.length}</span></div>
              <div class="kv"><span class="k">Realms</span><span class="v">${t.empireData.length}</span></div>
            </div>
            ${t.tags?.length ? `<div class="aside-block">
              <div class="aside-title">Themes</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">${t.tags.map((tg) => `<span class="chip plain">${esc(tg)}</span>`).join("")}</div>
            </div>` : ""}
          </aside>
        </div>

        ${t.figureData.length ? `<div style="margin-top:clamp(44px,6vw,80px)">
          <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:26px">
            <h2 class="section-title" style="font-size:clamp(1.5rem,2.6vw,2.2rem)">Key figures</h2>
            <span class="mono dim-2">${t.figureData.length} rulers</span>
          </div>
          <div class="grid-3">${t.figureData.map(rulerCard).join("")}</div>
        </div>` : ""}

        ${t.empireData.length ? `<div style="margin-top:clamp(44px,6vw,80px)">
          <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:26px">
            <h2 class="section-title" style="font-size:clamp(1.5rem,2.6vw,2.2rem)">Connected realms</h2>
            <span class="mono dim-2">${t.empireData.length} realms</span>
          </div>
          <div class="grid-3">${t.empireData.map((e) => empireCard(e, { showDesc: false })).join("")}</div>
        </div>` : ""}

        <div class="pager">
          ${prev ? `<a href="#/topics/${prev.id}"><span class="pk">← Previous chapter</span><span class="pv">${esc(prev.title)}</span></a>` : "<span></span>"}
          ${next ? `<a href="#/topics/${next.id}"><span class="pk">Next chapter →</span><span class="pv">${esc(next.title)}</span></a>` : "<span></span>"}
        </div>
      </div>
    </section>
  </div>`;

  return { title: t.title, html };
}
