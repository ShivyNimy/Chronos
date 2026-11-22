// ─────────────────────────────────────────────────────────────────────────────
// REGION — detail
// ─────────────────────────────────────────────────────────────────────────────
import { REGIONS, REGION_BY_ID, EMPIRES, RULERS, TOPICS, EVENTS, ERAS } from "../data/index.js";
import { esc, icon, crumbs, yearRange, empireCard, rulerCard } from "../ui.js";

export function renderRegion(id) {
  const region = REGION_BY_ID[id];
  if (!region) {
    return {
      title: "Not found",
      html: `<div class="wrap page" style="padding-top:200px;padding-bottom:200px"><h1 class="page-title">Region not found.</h1><a class="btn btn-rust" style="margin-top:24px" href="#/atlas">Back to the atlas</a></div>`,
    };
  }
  const idx = REGIONS.indexOf(region);
  const prev = REGIONS[idx - 1];
  const next = REGIONS[idx + 1];

  const empires = region.empires.slice().sort((a, b) => a.start - b.start);
  const rulers = region.rulers.slice().sort((a, b) => a.start - b.start);
  const events = EVENTS.filter((ev) => ev.region === region.id).slice(0, 16);

  const html = `
  <div class="page">
    <header class="detail-hero">
      <div class="wrap">
        ${crumbs([{ label: "Atlas", href: "#/atlas" }, { label: region.name }])}
        <div class="mono dim-2" style="margin-bottom:4px">Region ${String(idx + 1).padStart(2, "0")} of ${REGIONS.length}</div>
        <h1 class="detail-name" style="margin:0 0 10px">${esc(region.name)}</h1>
        <div class="detail-title" style="font-size:clamp(1.15rem,2vw,1.6rem)">${esc(region.tagline)}</div>
        <p class="page-sub" style="font-family:var(--serif);max-width:58ch;font-size:clamp(1rem,1.4vw,1.15rem)">${esc(region.blurb)}</p>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        <div class="stat-strip">
          <div><div class="k">Realms</div><div class="v">${empires.length}<small>in this region</small></div></div>
          <div><div class="k">Rulers</div><div class="v">${rulers.length}<small>recorded</small></div></div>
          <div><div class="k">First realm</div><div class="v" style="font-size:1.05rem">${esc(empires[0]?.startLabel || "—")}<small>${esc(empires[0]?.name || "")}</small></div></div>
          <div><div class="k">Latest realm</div><div class="v" style="font-size:1.05rem">${esc(empires[empires.length - 1]?.endLabel || "—")}<small>${esc(empires[empires.length - 1]?.name || "")}</small></div></div>
        </div>

        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:26px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Realms of ${esc(region.short)}</h2>
          <span class="mono dim-2">${empires.length} realms</span>
        </div>
        <div class="grid-3">${empires.map((e) => empireCard(e)).join("")}</div>

        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin:56px 0 26px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Rulers of ${esc(region.short)}</h2>
          <span class="mono dim-2">${rulers.length} rulers</span>
        </div>
        <div class="index-list">
          ${rulers
            .map(
              (r) => `<a class="irow" href="#/rulers/${r.id}" style="--c:${r.eraData.color}">
              <span><span class="irow-name">${esc(r.name)}</span><span class="irow-title">${esc(r.title)}</span></span>
              <span class="irow-empire">${esc(r.empire?.name || "")}</span>
              <span class="irow-dates">${esc(yearRange(r.start, r.end))}</span>
            </a>`
            )
            .join("")}
        </div>

        ${events.length ? `<div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin:56px 0 22px">
          <h2 class="section-title" style="font-size:clamp(1.6rem,2.8vw,2.4rem)">Chronicle</h2>
          <span class="mono dim-2">${events.length} events</span>
        </div>
        <div class="chronicle">
          ${events
            .map(
              (ev) => `<div class="citem" style="--c:${ev.eraData?.color};grid-template-columns:96px minmax(0,1fr)">
              <div class="citem-year" style="padding-right:18px">${esc(ev.yearLabel)}</div>
              <div class="citem-body" style="padding-left:22px"><span class="citem-dot"></span>
                <div class="citem-title">${esc(ev.title)}</div>
                <div class="citem-desc">${esc(ev.description)}</div>
              </div>
            </div>`
            )
            .join("")}
        </div>` : ""}

        <div class="pager">
          ${prev ? `<a href="#/regions/${prev.id}"><span class="pk">← Previous region</span><span class="pv">${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a href="#/regions/${next.id}"><span class="pk">Next region →</span><span class="pv">${esc(next.name)}</span></a>` : "<span></span>"}
        </div>
      </div>
    </section>
  </div>`;

  return { title: region.name, html };
}
