// ─────────────────────────────────────────────────────────────────────────────
// RULER — detail
// ─────────────────────────────────────────────────────────────────────────────
import { RULER_BY_ID, RULERS_BY_DATE, EVENTS, RULERS } from "../data/index.js";
import {
  esc, icon, crumbs, eraChip, regionChip, yearRange, initials, durationLabel,
} from "../ui.js";

export function renderRuler(id) {
  const r = RULER_BY_ID[id];
  if (!r) {
    return {
      title: "Not found",
      html: `<div class="wrap page" style="padding-top:200px;padding-bottom:200px"><h1 class="page-title">Ruler not found.</h1><p class="page-sub">No ruler with that identifier exists in the archive.</p><a class="btn btn-rust" style="margin-top:24px" href="#/rulers">Back to rulers</a></div>`,
    };
  }

  const idx = RULERS_BY_DATE.findIndex((x) => x.id === id);
  const prev = RULERS_BY_DATE[idx - 1];
  const next = RULERS_BY_DATE[idx + 1];
  const contemp = RULERS.filter((x) => x.id !== id && x.start <= r.end && x.end >= r.start).slice(0, 6);
  const ini = initials(r.name);

  const html = `
  <div class="page">
    <header class="detail-hero" style="--c:${r.eraData.color}">
      <div class="wrap">
        ${crumbs([{ label: "Rulers", href: "#/rulers" }, { label: r.empire?.name || "", href: r.empire ? `#/empires/${r.empire.id}` : null }, { label: r.name }])}
        <div class="row" style="gap:22px;align-items:flex-end;margin-top:4px;flex-wrap:wrap">
          <div class="medallion" style="width:78px;height:78px;font-size:26px;margin:0">${esc(ini)}</div>
          <div>
            <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:8px">
              ${r.eraData ? eraChip(r.eraData) : ""}
              ${r.empire ? regionChip(r.empire.regionData) : ""}
            </div>
            <h1 class="detail-name" style="margin:0 0 6px;font-size:clamp(2.2rem,5vw,4.4rem)">${esc(r.name)}</h1>
          </div>
        </div>
        <div class="detail-title" style="margin-top:10px">${esc(r.title)}${r.empire ? ` · <a href="#/empires/${r.empire.id}" style="color:var(--rust)">${esc(r.empire.name)}</a>` : ""}</div>
        <div class="detail-dates">
          <span class="d">${esc(yearRange(r.start, r.end))}</span>
          <span class="sep"></span>
          <span class="d" style="color:var(--ink-4)">${esc(durationLabel(r.start, r.end))}</span>
          ${r.dynasty && r.dynasty !== "—" ? `<span class="sep"></span><span class="d" style="color:var(--ink-4)">${esc(r.dynasty)}</span>` : ""}
        </div>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        <div class="stat-strip">
          <div><div class="k">Reign</div><div class="v">${esc(yearRange(r.start, r.end))}<small>${esc(durationLabel(r.start, r.end))}</small></div></div>
          <div><div class="k">Realm</div><div class="v" style="font-size:1.05rem">${esc(r.empire?.name || "—")}<small>${esc(r.empire?.regionData?.name || "")}</small></div></div>
          <div><div class="k">Era</div><div class="v" style="font-size:1.05rem"><a href="#/eras/${r.eraData?.id}">${esc(r.eraData?.name || "—")}</a><small>${esc(r.eraData?.fromLabel || "")} — ${esc(r.eraData?.toLabel || "")}</small></div></div>
          <div><div class="k">Dynasty</div><div class="v" style="font-size:1.05rem">${esc(r.dynasty || "—")}<small>${esc(r.empire?.capital || "")}</small></div></div>
        </div>

        <div class="detail-grid">
          <div class="prose">
            <p>${esc(r.bio)}</p>
            <h3>Works & achievements</h3>
            <div class="works">
              ${r.works.map((w) => `<div class="work"><p>${esc(w)}</p></div>`).join("")}
            </div>
            ${r.legacy ? `<blockquote class="quote"><p>${esc(r.legacy)}</p><cite>Legacy</cite></blockquote>` : ""}
          </div>

          <aside>
            <div class="aside-block">
              <div class="aside-title">Vital record</div>
              <div class="kv"><span class="k">Reign</span><span class="v">${esc(yearRange(r.start, r.end))}</span></div>
              <div class="kv"><span class="k">Born</span><span class="v">${r.born ? esc(yearRange(r.born, r.born)) : "—"}</span></div>
              <div class="kv"><span class="k">Died</span><span class="v">${r.died ? esc(yearRange(r.died, r.died)) : "—"}</span></div>
              <div class="kv"><span class="k">Dynasty</span><span class="v">${esc(r.dynasty || "—")}</span></div>
              <div class="kv"><span class="k">Title</span><span class="v">${esc(r.title)}</span></div>
              <div class="kv"><span class="k">Realm</span><span class="v"><a href="#/empires/${r.empire?.id}">${esc(r.empire?.name || "—")}</a></span></div>
              <div class="kv"><span class="k">Era</span><span class="v">${esc(r.eraData?.name || "—")}</span></div>
              <div class="kv"><span class="k">Region</span><span class="v">${esc(r.empire?.regionData?.name || "—")}</span></div>
            </div>
            ${contemp.length ? `<div class="aside-block">
              <div class="aside-title">Contemporaries</div>
              ${contemp
                .map(
                  (c) => `<a class="kv" href="#/rulers/${c.id}" style="border:0;padding:5px 0">
                  <span class="k" style="font-family:var(--serif);font-size:13.5px;text-transform:none;letter-spacing:0;color:var(--ink-2)">${esc(c.name)}</span>
                  <span class="v mono" style="font-size:8.5px">${esc(c.empire?.short || c.empire?.name || "")}</span>
                </a>`
                )
                .join("")}
            </div>` : ""}
            ${r.topics.length ? `<div class="aside-block">
              <div class="aside-title">Chapters</div>
              ${r.topics.map((t) => `<a class="kv" href="#/topics/${t.id}" style="border:0;padding:5px 0"><span class="k" style="font-family:var(--serif);font-size:13.5px;text-transform:none;letter-spacing:0;color:var(--ink-2)">${esc(t.title)}</span></a>`).join("")}
            </div>` : ""}
          </aside>
        </div>

        ${r.events.length ? `<div style="margin-top:clamp(44px,6vw,80px)">
          <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:20px">
            <h2 class="section-title" style="font-size:clamp(1.5rem,2.6vw,2.2rem)">During this reign</h2>
            <span class="mono dim-2">${r.events.length} events</span>
          </div>
          <div class="chronicle">
            ${r.events
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
          ${prev ? `<a href="#/rulers/${prev.id}"><span class="pk">← Previous ruler</span><span class="pv">${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a href="#/rulers/${next.id}"><span class="pk">Next ruler →</span><span class="pv">${esc(next.name)}</span></a>` : "<span></span>"}
        </div>
      </div>
    </section>
  </div>`;

  return {
    title: r.name,
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
