// ─────────────────────────────────────────────────────────────────────────────
// RULERS — index
// ─────────────────────────────────────────────────────────────────────────────
import { RULERS, ERAS, REGIONS, STATS } from "../data/index.js";
import { esc, icon, yearRange, initials } from "../ui.js";

const state = { q: "", era: "all", region: "all", sort: "date" };

export function renderRulers() {
  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">The rulers</div>
        <h1 class="page-title" style="margin-top:16px">Every ruler has a <em>name</em>, a reign and a record</h1>
        <p class="page-sub">${STATS.rulers} named rulers — pharaohs, emperors, sultans, presidents — each with the dates of their power, the works they left behind, and what they did with it.</p>
        <div class="page-meta">
          <span><b>${STATS.rulers}</b> rulers</span><span class="dot"></span>
          <span><b>${ERAS.length}</b> eras</span><span class="dot"></span>
          <span><b>${REGIONS.length}</b> regions</span>
        </div>
      </div>
    </header>

    <div class="filterbar">
      <div class="wrap filterbar-inner">
        <label class="search-inline">${icon("search")}<input type="text" id="rq" placeholder="Search rulers, titles, realms…" /></label>
        <select class="select" id="r-era">
          <option value="all">All eras</option>
          ${ERAS.map((e) => `<option value="${e.id}">${esc(e.short)}</option>`).join("")}
        </select>
        <select class="select" id="r-region">
          <option value="all">All regions</option>
          ${REGIONS.map((r) => `<option value="${r.id}">${esc(r.short)}</option>`).join("")}
        </select>
        <span class="filterbar-spacer"></span>
        <select class="select" id="r-sort">
          <option value="date">Earliest first</option>
          <option value="recent">Latest first</option>
          <option value="name">Name A–Z</option>
          <option value="reign">Longest reign</option>
        </select>
      </div>
    </div>

    <section class="section tight">
      <div class="wrap">
        <div class="row-between" style="margin-bottom:22px">
          <span class="mono dim-2" id="r-count"></span>
          <span class="mono dim-2" id="r-sortlabel">Ordered by date</span>
        </div>
        <div class="index-list" id="ruler-list"></div>
      </div>
    </section>
  </div>`;

  return {
    title: "Rulers",
    html,
    mount(root) {
      const q = root.querySelector("#rq");
      const era = root.querySelector("#r-era");
      const region = root.querySelector("#r-region");
      const sort = root.querySelector("#r-sort");
      const list = root.querySelector("#ruler-list");
      const count = root.querySelector("#r-count");
      const sortLabel = root.querySelector("#r-sortlabel");

      function apply() {
        let out = RULERS.filter((r) => {
          if (state.q) {
            const hay = `${r.name} ${r.title} ${r.empire?.name || ""} ${r.dynasty || ""}`.toLowerCase();
            if (!hay.includes(state.q)) return false;
          }
          if (state.era !== "all" && r.eraData?.id !== state.era) return false;
          if (state.region !== "all" && r.empire?.region !== state.region) return false;
          return true;
        });
        if (state.sort === "date") out.sort((a, b) => a.start - b.start);
        if (state.sort === "recent") out.sort((a, b) => b.start - a.start);
        if (state.sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
        if (state.sort === "reign") out.sort((a, b) => b.end - b.start - (a.end - a.start));

        count.textContent = `${out.length} of ${RULERS.length} rulers`;
        list.innerHTML = out.length
          ? out
              .map(
                (r) => `<a class="irow" href="#/rulers/${r.id}" style="--c:${r.eraData.color}">
              <span><span class="irow-name">${esc(r.name)}</span><span class="irow-title">${esc(r.title)}</span></span>
              <span class="irow-empire">${esc(r.empire?.name || "")}</span>
              <span class="irow-dates">${esc(yearRange(r.start, r.end))}</span>
            </a>`
              )
              .join("")
          : `<div class="empty" style="grid-column:1/-1"><div class="et">Nothing matches.</div><p>Try another name, era or region.</p></div>`;
      }

      let t;
      q.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          state.q = q.value.trim().toLowerCase();
          apply();
        }, 120);
      });
      era.addEventListener("change", () => ((state.era = era.value), apply()));
      region.addEventListener("change", () => ((state.region = region.value), apply()));
      sort.addEventListener("change", () => {
        state.sort = sort.value;
        const labels = { date: "Ordered by date", recent: "Latest first", name: "Ordered A–Z", reign: "Longest reign" };
        sortLabel.textContent = labels[state.sort];
        apply();
      });
      apply();
    },
  };
}
