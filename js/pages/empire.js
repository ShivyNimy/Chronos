// ─────────────────────────────────────────────────────────────────────────────
// EMPIRE — detail
// ─────────────────────────────────────────────────────────────────────────────
import {
  EMPIRE_BY_ID, EMPIRES_BY_DATE, EVENTS, RULERS, eraForYear,
} from "../data/index.js";
import {
  esc, icon, crumbs, eraChip, regionChip, yearRange, fmtExtent, durationLabel,
  fmtNum, empireCard, rulerCard,
} from "../ui.js";

export function renderEmpire(id) {
  const e = EMPIRE_BY_ID[id];
  if (!e) return { title: "Not found", html: `<div class="wrap page" style="padding-top:200px;padding-bottom:200px"><h1 class="page-title">Realm not found.</h1><p class="page-sub">No realm with that identifier exists in the archive.</p><a class="btn btn-rust" style="margin-top:24px" href="#/empires">Back to realms</a></div>` };

  const idx = EMPIRES_BY_DATE.findIndex((x) => x.id === id);
  const prev = EMPIRES_BY_DATE[idx - 1];
  const next = EMPIRES_BY_DATE[idx + 1];

  const contemporaries = EMPIRES_BY_DATE.filter(
    (x) => x.id !== id && x.start <= e.end && x.end >= e.start
  ).slice(0, 6);

  const maxReign = Math.max(...e.rulers.map((r) => r.end - r.start), 1);

  const html = `
  <div class="page">
    <header class="detail-hero" style="--c:${e.eraData.color}">
      <div class="wrap">
        ${crumbs([{ label: "Realms", href: "#/empires" }, { label: e.name }])}
        <div class="row" style="gap:10px;flex-wrap:wrap">
          ${eraChip(e.eraData)}
          ${regionChip(e.regionData)}
        </div>
        <h1 class="detail-name">${esc(e.name)}</h1>
        ${e.aka ? `<div class="detail-title">${esc(e.aka)}</div>` : ""}
        <div class="detail-dates">
          <span class="d">${esc(yearRange(e.start, e.end))}</span>
          <span class="sep"></span>
          <span class="d dim" style="color:var(--ink-4)">${esc(durationLabel(e.start, e.end))}</span>
        </div>
        <p class="page-sub" style="font-family:var(--serif);font-style:italic;font-size:clamp(1.05rem,1.7vw,1.4rem);color:var(--ink-2);max-width:44ch">${esc(e.tagline)}</p>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        <div class="stat-strip">
          <div><div class="k">Duration</div><div class="v">${esc(durationLabel(e.start, e.end))}<small>${esc(yearRange(e.start, e.end))}</small></div></div>
          <div><div class="k">Peak extent</div><div class="v">${esc(fmtExtent(e.extent))}<small>${esc(e.peak || "")}</small></div></div>
          <div><div class="k">Rulers</div><div class="v">${e.rulers.length}<small>in the archive</small></div></div>
          <div><div class="k">Capital</div><div class="v" style="font-size:1.05rem">${esc(e.capital)}<small>${esc(e.regionData?.name || "")}</small></div></div>
        </div>

        <div class="detail-grid">
          <div class="prose">
            <p>${esc(e.description)}</p>
            ${e.legacy ? `<h3>Legacy</h3><p>${esc(e.legacy)}</p>` : ""}
            <h3>Achievements</h3>
            <ul>${e.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          </div>
          <aside>
            <div class="aside-block">
              <div class="aside-title">At a glance</div>
              <div class="kv"><span class="k">Era</span><span class="v"><a href="#/eras/${e.era}">${esc(e.eraData.name)}</a></span></div>
              <div class="kv"><span class="k">Region</span><span class="v"><a href="#/regions/${e.region}">${esc(e.regionData?.name || "")}</a></span></div>
              <div class="kv"><span class="k">Capital</span><span class="v">${esc(e.capital)}</span></div>
              <div class="kv"><span class="k">Founded</span><span class="v">${esc(e.startLabel)}</span></div>
              <div class="kv"><span class="k">Ended</span><span class="v">${esc(e.endLabel)}</span></div>
              <div class="kv"><span class="k">Peak</span><span class="v">${esc(e.peak || "—")}</span></div>
              <div class="kv"><span class="k">Extent</span><span class="v">${esc(fmtExtent(e.extent))}</span></div>
              <div class="kv"><span class="k">Rulers</span><span class="v">${e.rulers.length}</span></div>
            </div>
            ${e.topics.length ? `<div class="aside-block">
              <div class="aside-title">Chapters</div>
              ${e.topics.map((t) => `<div style="padding:6px 0"><a class="trow-title" href="#/topics/${t.id}" style="font-size:14.5px">${esc(t.title)}</a></div>`).join("")}
            </div>` : ""}
            ${contemporaries.length ? `<div class="aside-block">
              <div class="aside-title">Contemporaries</div>
              <div style="display:flex;flex-direction:column;gap:2px">
                ${contemporaries.map((c) => `<a class="kv" href="#/empires/${c.id}" style="border:0;padding:5px 0"><span class="k" style="color:var(--ink-2);font-family:var(--serif);font-size:13.5px;text-transform:none;letter-spacing:0">${esc(c.name)}</span><span class="v mono">${esc(c.startLabel)}–${esc(c.endLabel)}</span></a>`).join("")}
              </div>
            </div>` : ""}
          </aside>
        </div>

        ${e.rulers.length ? `<div style="margin-top:clamp(44px,6vw,80px)">
          <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:4px">
            <h2 class="section-title" style="font-size:clamp(1.5rem,2.6vw,2.2rem)">The rulers</h2>
            <span class="mono dim-2">${e.rulers.length} recorded</span>
          </div>
          <table class="tbl">
            <thead><tr><th style="width:26%">Ruler</th><th style="width:24%">Title</th><th style="width:18%">Reign</th><th style="width:26%">Duration</th><th style="width:6%"></th></tr></thead>
            <tbody>
              ${e.rulers
                .map(
                  (r) => `<tr data-href="#/rulers/${r.id}" style="--c:${r.eraData.color}">
                  <td><div class="tn">${esc(r.name)}</div></td>
                  <td><div class="tt">${esc(r.title)}</div></td>
                  <td><div class="tm">${esc(yearRange(r.start, r.end))}</div></td>
                  <td><div class="reign-bar"><i style="width:${Math.max(3, ((r.end - r.start) / maxReign) * 100)}%;--c:${r.eraData.color}"></i></div></td>
                  <td class="ta"><a href="#/rulers/${r.id}" aria-label="${esc(r.name)}">${icon("arrowUpRight")}</a></td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>` : `<div class="notice" style="margin-top:44px"><b>No named rulers survive.</b> This civilisation left no written record of individual kings — a reminder that most of humanity's political history has been lost.</div>`}

        ${e.events.length ? `<div style="margin-top:clamp(44px,6vw,80px)">
          <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:20px">
            <h2 class="section-title" style="font-size:clamp(1.5rem,2.6vw,2.2rem)">Turning points</h2>
            <span class="mono dim-2">${e.events.length} events</span>
          </div>
          <div class="chronicle">
            ${e.events
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
          </div>
        </div>` : ""}

        <div class="pager">
          ${prev ? `<a href="#/empires/${prev.id}"><span class="pk">← Previous realm</span><span class="pv">${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a href="#/empires/${next.id}"><span class="pk">Next realm →</span><span class="pv">${esc(next.name)}</span></a>` : "<span></span>"}
        </div>
      </div>
    </section>
  </div>`;

  return {
    title: e.name,
    html,
    mount(root) {
      root.querySelectorAll("tr[data-href]").forEach((tr) => {
        tr.addEventListener("click", (ev) => {
          if (ev.target.closest("a")) return;
          location.hash = tr.dataset.href.replace(/^#/, "");
        });
      });
    },
  };
}
