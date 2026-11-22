// ─────────────────────────────────────────────────────────────────────────────
// ATLAS — interactive world map
// ─────────────────────────────────────────────────────────────────────────────
import { EMPIRES, ERAS, REGIONS, ERA_BY_ID, REGION_BY_ID } from "../data/index.js";
import { esc, icon, yearRange, eraChip } from "../ui.js";

const W = 1200, H = 624, K = 219.34757288420167;

// Natural Earth I projection (matches assets/world.svg)
function project(lat, lon) {
  const lambda = (lon * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const phi2 = phi * phi;
  const phi4 = phi2 * phi2;
  const x =
    lambda *
    (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4)));
  const y =
    phi *
    (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)));
  return { x: (W / 2 + K * x) / W, y: (H / 2 - K * y) / H };
}

const state = { era: "all", region: "all" };

export function renderAtlas() {
  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">The atlas</div>
        <h1 class="page-title" style="margin-top:16px">Where history <em>actually happened</em></h1>
        <p class="page-sub">Every realm in the archive, plotted at its capital. Filter by era or region, then select a marker to read its record. The map uses the Natural Earth projection, drawn from modern boundary data.</p>
        <div class="page-meta"><span><b>${EMPIRES.length}</b> marked realms</span><span class="dot"></span><span><b>${REGIONS.length}</b> regions</span><span class="dot"></span><span><b>Natural Earth I</b> projection</span></div>
      </div>
    </header>

    <div class="filterbar">
      <div class="wrap filterbar-inner">
        <button class="chip plain on" data-ae="all" style="--c:var(--rust)">All eras</button>
        ${ERAS.map((e) => `<button class="chip plain" data-ae="${e.id}" style="--c:${e.color}">${esc(e.short)}</button>`).join("")}
        <span class="filterbar-spacer"></span>
        <select class="select" id="a-region">
          <option value="all">All regions</option>
          ${REGIONS.map((r) => `<option value="${r.id}">${esc(r.short)}</option>`).join("")}
        </select>
      </div>
    </div>

    <section class="section tight">
      <div class="wrap">
        <div class="atlas">
          <div class="map-frame" id="map-frame">
            <div id="map-svg"></div>
            <div class="map-markers" id="map-markers"></div>
            <div class="map-hint">Natural Earth I · every realm plotted at its capital</div>
          </div>
          <div class="atlas-side">
            <div class="atlas-side-head">
              <span class="mono dim-2" id="a-count">—</span>
              <span class="mono dim-2">${icon("globe")}</span>
            </div>
            <div class="atlas-list" id="a-list"></div>
          </div>
        </div>
        <div class="atlas-legend">
          <span class="mono dim-2">Era</span>
          ${ERAS.map((e) => `<span class="atlas-key" style="--c:${e.color}"><i></i>${esc(e.short)}</span>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div class="section-head" style="margin-bottom:36px">
          <div>
            <div class="section-kicker">Regions <span>/ ${REGIONS.length}</span></div>
            <h2 class="section-title" style="font-size:clamp(1.8rem,3.4vw,2.9rem)">The world in <em>eleven parts</em></h2>
          </div>
          <div class="section-lede"><p>Each region is a separate sequence of states. Open one to read its realms and rulers across the whole span of the record.</p></div>
        </div>
        <div class="region-grid">
          ${REGIONS.map(
            (r) => `<a class="region-block" href="#/regions/${r.id}">
              <div class="rk">${String(REGIONS.indexOf(r) + 1).padStart(2, "0")}</div>
              <div class="rn">${esc(r.short)}</div>
              <div class="rc"><span><b>${r.empires.length}</b> realms</span><span><b>${r.rulers.length}</b> rulers</span></div>
            </a>`
          ).join("")}
        </div>
      </div>
    </section>
  </div>`;

  return {
    title: "Atlas",
    html,
    async mount(root) {
      const frame = root.querySelector("#map-frame");
      const svgHost = root.querySelector("#map-svg");
      if (!svgHost) return;
      const markers = root.querySelector("#map-markers");
      const list = root.querySelector("#a-list");
      const count = root.querySelector("#a-count");

      try {
        const res = await fetch("assets/world.svg");
        const text = await res.text();
        svgHost.innerHTML = text;
      } catch {
        svgHost.innerHTML = `<div class="empty">The map could not be loaded.</div>`;
      }

      function draw() {
        const out = EMPIRES.filter((e) => {
          if (state.era !== "all" && e.era !== state.era) return false;
          if (state.region !== "all" && e.region !== state.region) return false;
          return typeof e.lat === "number" && typeof e.lon === "number";
        });
        count.textContent = `${out.length} realms`;
        markers.innerHTML = out
          .map((e) => {
            const p = project(e.lat, e.lon);
            return `<a class="marker" href="#/empires/${e.id}" style="left:${(p.x * 100).toFixed(3)}%;top:${(p.y * 100).toFixed(3)}%;--c:${e.eraData.color}" data-mid="${e.id}" title="${esc(e.name)} — ${esc(yearRange(e.start, e.end))}">
              <span class="marker-ring"></span><span class="marker-dot"></span>
            </a>`;
          })
          .join("");

        list.innerHTML = out.length
          ? out
              .map(
                (e) => `<a class="atlas-item" href="#/empires/${e.id}" data-lid="${e.id}" style="--c:${e.eraData.color}">
              <i></i>
              <span><span class="an">${esc(e.name)}</span><span class="ad">${esc(yearRange(e.start, e.end))} · ${esc(e.regionData?.short || "")}</span></span>
            </a>`
              )
              .join("")
          : `<div class="empty" style="padding:30px 16px">No realms in this selection.</div>`;
      }

      root.querySelectorAll("[data-ae]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.era = btn.dataset.ae;
          root.querySelectorAll("[data-ae]").forEach((b) => b.classList.toggle("on", b === btn));
          draw();
        });
      });
      root.querySelector("#a-region").addEventListener("change", (ev) => {
        state.region = ev.target.value;
        draw();
      });

      // hover sync between markers and list
      root.addEventListener("mouseover", (ev) => {
        const m = ev.target.closest("[data-mid],[data-lid]");
        if (!m) return;
        const id = m.dataset.mid || m.dataset.lid;
        root.querySelectorAll(`[data-mid="${id}"],[data-lid="${id}"]`).forEach((el) => el.classList.add("active"));
      });
      root.addEventListener("mouseout", (ev) => {
        const m = ev.target.closest("[data-mid],[data-lid]");
        if (!m) return;
        const id = m.dataset.mid || m.dataset.lid;
        root.querySelectorAll(`[data-mid="${id}"],[data-lid="${id}"]`).forEach((el) => el.classList.remove("active"));
      });

      draw();
    },
  };
}
