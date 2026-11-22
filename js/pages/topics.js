// ─────────────────────────────────────────────────────────────────────────────
// TOPICS — index
// ─────────────────────────────────────────────────────────────────────────────
import { TOPICS, ERAS, STATS } from "../data/index.js";
import { esc, icon } from "../ui.js";

const state = { era: "all" };

export function renderTopics() {
  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">The chapters</div>
        <h1 class="page-title" style="margin-top:16px">The themes that <em>cut across everything</em></h1>
        <p class="page-sub">Fifty-one long-form chapters on the ideas, technologies and catastrophes that shaped every civilisation at once — from the invention of writing to the climate crisis. Read them in any order; each one connects to rulers and realms elsewhere in the archive.</p>
        <div class="page-meta"><span><b>${STATS.topics}</b> chapters</span><span class="dot"></span><span><b>${ERAS.length}</b> eras covered</span><span class="dot"></span><span><b>300,000 BCE</b> earliest</span></div>
      </div>
    </header>

    <div class="filterbar">
      <div class="wrap filterbar-inner" id="t-filters">
        <button class="chip plain on" data-te="all" style="--c:var(--rust)">All chapters</button>
        ${ERAS.map((e) => `<button class="chip plain" data-te="${e.id}" style="--c:${e.color}">${esc(e.short)}</button>`).join("")}
      </div>
    </div>

    <section class="section tight">
      <div class="wrap">
        <div class="row-between" style="margin-bottom:26px">
          <span class="mono dim-2" id="t-count"></span>
          <span class="mono dim-2">Ordered by period</span>
        </div>
        <div class="topic-list" id="topic-list"></div>
      </div>
    </section>
  </div>`;

  return {
    title: "Chapters",
    html,
    mount(root) {
      const list = root.querySelector("#topic-list");
      const count = root.querySelector("#t-count");

      function apply() {
        const out = TOPICS.filter((t) => state.era === "all" || t.era === state.era);
        count.textContent = `${out.length} of ${TOPICS.length} chapters`;
        list.innerHTML = out
          .map(
            (t, i) => `<a class="trow" href="#/topics/${t.id}" style="--c:${t.eraData?.color}">
            <span class="trow-num">${String(TOPICS.indexOf(t) + 1).padStart(2, "0")}</span>
            <span class="trow-title">${esc(t.title)}<small>${esc(t.subtitle)}</small></span>
            <span class="trow-era">${esc(t.eraData?.short || "")}</span>
          </a>`
          )
          .join("");
      }

      root.querySelectorAll("[data-te]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.era = btn.dataset.te;
          root.querySelectorAll("[data-te]").forEach((b) => b.classList.toggle("on", b === btn));
          apply();
        });
      });
      apply();
    },
  };
}
