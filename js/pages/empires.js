// ─────────────────────────────────────────────────────────────────────────────
// EMPIRES — index
// ─────────────────────────────────────────────────────────────────────────────
import { EMPIRES, ERAS, REGIONS, STATS, ERA_BY_ID } from "../data/index.js";
import { esc, icon, empireCard, yearRange } from "../ui.js";

const state = { q: "", era: "all", region: "all", sort: "date" };

export function renderEmpires() {
  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">The realms</div>
        <h1 class="page-title" style="margin-top:16px">Every empire, kingdom <em>and civilisation</em></h1>
        <p class="page-sub">From the first city-states of Mesopotamia to the modern nation-state — ${STATS.empires} realms, each with its rulers, its achievements and its account of the world.</p>
        <div class="page-meta">
          <span><b>${STATS.empires}</b> realms</span><span class="dot"></span>
          <span><b>${REGIONS.length}</b> regions</span><span class="dot"></span>
          <span><b>${ERAS.length}</b> eras</span>
        </div>
      </div>
    </header>

    <div class="filterbar">
      <div class="wrap filterbar-inner">
        <label class="search-inline">${icon("search")}<input type="text" id="eq" placeholder="Search realms…" /></label>
        <select class="select" id="e-era">
          <option value="all">All eras</option>
          ${ERAS.map((e) => `<option value="${e.id}">${esc(e.short)}</option>`).join("")}
        </select>
        <select class="select" id="e-region">
          <option value="all">All regions</option>
          ${REGIONS.map((r) => `<option value="${r.id}">${esc(r.short)}</option>`).join("")}
        </select>
        <span class="filterbar-spacer"></span>
        <select class="select" id="e-sort">
          <option value="date">Oldest first</option>
          <option value="recent">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="size">Largest extent</option>
          <option value="rulers">Most rulers</option>
        </select>
      </div>
    </div>

    <section class="section tight">
      <div class="wrap">
        <div class="row-between" style="margin-bottom:26px">
          <span class="mono dim-2" id="e-count"></span>
          <span class="mono dim-2">Sorted by date</span>
        </div>
        <div class="grid-3" id="empire-grid"></div>
      </div>
    </section>
  </div>`;

  return {
    title: "Realms",
    html,
    mount(root) {
      const q = root.querySelector("#eq");
      const era = root.querySelector("#e-era");
      const region = root.querySelector("#e-region");
      const sort = root.querySelector("#e-sort");
      const grid = root.querySelector("#empire-grid");
      const count = root.querySelector("#e-count");
      const sortLabel = root.querySelector(".mono.dim-2:last-child");

      function apply() {
        let list = EMPIRES.filter((e) => {
          if (state.q) {
            const hay = `${e.name} ${e.aka || ""} ${e.tagline || ""} ${e.capital || ""}`.toLowerCase();
            if (!hay.includes(state.q)) return false;
          }
          if (state.era !== "all" && e.era !== state.era) return false;
          if (state.region !== "all" && e.region !== state.region) return false;
          return true;
        });
        if (state.sort === "date") list.sort((a, b) => a.start - b.start);
        if (state.sort === "recent") list.sort((a, b) => b.start - a.start);
        if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
        if (state.sort === "size") list.sort((a, b) => (b.extent || 0) - (a.extent || 0));
        if (state.sort === "rulers") list.sort((a, b) => b.rulers.length - a.rulers.length);

        count.textContent = `${list.length} of ${EMPIRES.length} realms`;
        grid.innerHTML = list.length
          ? list.map((e) => empireCard(e)).join("")
          : `<div class="empty" style="grid-column:1/-1"><div class="et">Nothing matches.</div><p>Try a broader search or a different era.</p></div>`;
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
        const labels = { date: "Sorted by date", recent: "Newest first", name: "Sorted A–Z", size: "Largest extent", rulers: "Most rulers" };
        sortLabel.textContent = labels[state.sort];
        apply();
      });
      apply();
    },
  };
}
