// ─────────────────────────────────────────────────────────────────────────────
// ERAS — index
// ─────────────────────────────────────────────────────────────────────────────
import { ERAS, STATS } from "../data/index.js";
import { esc, icon, yearRange } from "../ui.js";

export function renderEras() {
  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">The eras</div>
        <h1 class="page-title" style="margin-top:16px">Ten eras, <em>one species</em></h1>
        <p class="page-sub">History is usually cut into periods that only make sense in Europe. These ten are drawn globally — each one covers what was happening across every continent at once, so the Americas, China and Africa are never left waiting for their turn.</p>
        <div class="page-meta"><span><b>${ERAS.length}</b> eras</span><span class="dot"></span><span><b>${yearRange(-4500, 2026)}</b></span><span class="dot"></span><span><b>${STATS.empires}</b> realms placed</span></div>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        <div class="era-ladder">
          ${ERAS.map((e, i) => {
            const span = e.to - e.from;
            const share = Math.max(6, Math.min(100, (span / 6526) * 100));
            return `<a class="era-rung" href="#/eras/${e.id}" style="--c:${e.color}">
              <div class="er-num">${String(i + 1).padStart(2, "0")}</div>
              <div class="er-main">
                <div class="er-top">
                  <h2 class="er-name">${esc(e.name)}</h2>
                  <span class="er-dates">${esc(yearRange(e.from, e.to))}</span>
                </div>
                <p class="er-tag">${esc(e.tagline)}</p>
                <div class="er-bar"><i style="width:${share}%"></i></div>
              </div>
              <div class="er-meta">
                <span><b>${e.empires?.length ?? 0}</b> realms</span>
                <span><b>${e.rulers?.length ?? 0}</b> rulers</span>
                ${icon("arrowRight")}
              </div>
            </a>`;
          }).join("")}
        </div>
      </div>
    </section>
  </div>`;

  return { title: "Eras", html };
}
