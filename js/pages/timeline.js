// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE — deep time chart + chronicle
// ─────────────────────────────────────────────────────────────────────────────
import {
  ERAS, EMPIRES, EVENTS, STATS, ERA_BY_ID, eraForYear,
} from "../data/index.js";
import { esc, icon, deepTimeChart, mountDeepTime, yearRange } from "../ui.js";

export function renderTimeline(_m, params) {
  const focusEvent = params?.get("event") || null;

  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">Deep time</div>
        <h1 class="page-title" style="margin-top:16px">Six and a half thousand <em>years</em></h1>
        <p class="page-sub">Every realm in the archive on a single axis, followed by the full chronicle of dated events. Scroll the chart sideways; filter the chronicle by era.</p>
        <div class="page-meta">
          <span><b>${STATS.empires}</b> realms</span><span class="dot"></span>
          <span><b>${STATS.events}</b> dated events</span><span class="dot"></span>
          <span><b>${yearRange(-4500, 2026)}</b></span>
        </div>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap">
        ${deepTimeChart({ empires: EMPIRES, pxPerYear: 0.62, id: "dt-full" })}
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div class="section-head" style="margin-bottom:30px">
          <div>
            <div class="section-kicker">The chronicle <span>/ ${STATS.events} events</span></div>
            <h2 class="section-title" style="font-size:clamp(1.8rem,3.4vw,2.8rem)">What happened, <em>when</em></h2>
          </div>
          <div class="section-lede"><p>Every dated event in the archive, arranged by era. Filter to a single era, or follow the whole sequence from the first cities to the present.</p></div>
        </div>

        <div class="filterbar" style="position:static;background:none;backdrop-filter:none;padding:0 0 16px;border-bottom:1px solid var(--line)">
          <div class="filterbar-inner" id="era-filters">
            <button class="chip plain on" data-era="all" style="--c:var(--rust)">All eras</button>
            ${ERAS.map((e) => `<button class="chip plain" data-era="${e.id}" style="--c:${e.color}">${esc(e.short)}</button>`).join("")}
          </div>
        </div>

        <div id="chronicle-root" style="margin-top:34px">
          ${ERAS.map(eraSection).join("")}
        </div>
      </div>
    </section>
  </div>`;

  return {
    title: "Timeline",
    html,
    mount(root, p) {
      mountDeepTime(root);
      const focus = p?.get("event");
      if (focus) {
        requestAnimationFrame(() => {
          const el = root.querySelector(`[data-event="${CSS.escape(focus)}"]`);
          if (el) {
            el.scrollIntoView({ block: "center", behavior: "smooth" });
            el.style.background = "color-mix(in srgb, var(--gold) 14%, transparent)";
            setTimeout(() => (el.style.background = ""), 2400);
          }
        });
      }
      root.querySelectorAll("[data-era]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const era = btn.dataset.era;
          root.querySelectorAll("[data-era]").forEach((b) => b.classList.toggle("on", b === btn));
          root.querySelectorAll("[data-era-section]").forEach((sec) => {
            sec.hidden = era !== "all" && sec.dataset.eraSection !== era;
          });
          window.scrollTo({ top: root.querySelector("#chronicle-root").getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
        });
      });
    },
  };
}

function eraSection(era) {
  const events = EVENTS.filter((ev) => ev.year >= era.from && ev.year <= era.to);
  if (!events.length) return "";
  return `<div class="era-block" data-era-section="${era.id}" style="margin-bottom:54px">
    <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:6px">
      <div class="row" style="gap:12px">
        <span class="chip" style="--c:${era.color}">${esc(era.name)}</span>
        <span class="mono dim-2">${esc(era.fromLabel)} — ${esc(era.toLabel)}</span>
      </div>
      <span class="mono dim-2">${events.length} events</span>
    </div>
    <div class="grid-2" style="gap:0 clamp(28px,4vw,64px)">
      ${events
        .map(
          (ev) => `<div class="citem" data-event="${ev.id}" style="--c:${era.color};grid-template-columns:92px minmax(0,1fr)">
        <div class="citem-year" style="padding-right:18px">${esc(ev.yearLabel)}</div>
        <div class="citem-body" style="padding-left:22px">
          <span class="citem-dot"></span>
          <div class="citem-title">${esc(ev.title)}</div>
          <div class="citem-desc">${esc(ev.description)}${ev.empire ? ` <a href="#/empires/${ev.empire.id}" style="color:var(--rust);white-space:nowrap">→ ${esc(ev.empire.name)}</a>` : ""}</div>
        </div>
      </div>`
        )
        .join("")}
    </div>
  </div>`;
}
