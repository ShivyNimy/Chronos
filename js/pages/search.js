// ─────────────────────────────────────────────────────────────────────────────
// SEARCH — full-page results
// ─────────────────────────────────────────────────────────────────────────────
import { STATS } from "../data/index.js";
import { esc, icon, searchAll } from "../ui.js";

export function renderSearch(_m, params) {
  const q = (params?.get("q") || "").trim();

  const html = `
  <div class="page">
    <header class="page-head">
      <div class="wrap">
        <div class="eyebrow">Search the archive</div>
        <h1 class="page-title" style="margin-top:16px">Search <em>everything</em></h1>
        <p class="page-sub">${STATS.rulers} rulers, ${STATS.empires} realms, ${STATS.topics} chapters and ${STATS.events} dated events — all indexed. Try a name, a place, a century or a theme.</p>
      </div>
    </header>

    <section class="section tight">
      <div class="wrap wrap-narrow" style="max-width:900px">
        <form class="search-big" id="search-form" role="search">
          ${icon("search")}
          <input type="text" id="search-q" value="${esc(q)}" placeholder="Try “Genghis”, “ silk road ”, “1789”, “Ottoman”…" autocomplete="off" autofocus />
        </form>
        <div class="mono dim-2" id="search-count" style="margin:18px 0 26px"></div>
        <div id="search-results"></div>
      </div>
    </section>
  </div>`;

  return {
    title: q ? `Search: ${q}` : "Search",
    html,
    mount(root, p) {
      const input = root.querySelector("#search-q");
      const out = root.querySelector("#search-results");
      const count = root.querySelector("#search-count");
      const form = root.querySelector("#search-form");

      function run() {
        const val = input.value.trim();
        const res = searchAll(val, 80);
        count.textContent = val ? `${res.length} result${res.length === 1 ? "" : "s"} for “${val}”` : "Type to search the whole archive.";
        if (!val) {
          out.innerHTML = `<div class="empty"><div class="et">Start typing.</div><p>Every ruler, realm, chapter and event in the archive is searchable.</p></div>`;
          return;
        }
        if (!res.length) {
          out.innerHTML = `<div class="empty"><div class="et">Nothing found.</div><p>Try a shorter spelling, or a different name — many rulers are recorded under the name their own language used.</p></div>`;
          return;
        }
        let html = "";
        let last = "";
        for (const r of res) {
          if (r.type !== last) {
            html += `<div class="pal-group" style="padding:18px 0 8px">${esc(r.type)}s</div>`;
            last = r.type;
          }
          html += `<a class="srow" href="${r.href}" style="--c:${r.c || "#857866"}">
            <span class="si">${esc(r.type === "Ruler" ? initialsOf(r.title) : r.type === "Realm" ? "Realm" : r.type === "Chapter" ? "Chapter" : r.type === "Era" ? "Era" : r.type === "Region" ? "Region" : "Event")}</span>
            <span class="sb"><b>${esc(r.title)}</b><span>${esc(r.sub || "")}</span></span>
            <span class="sx">${esc(r.extra || r.era || "")}</span>
          </a>`;
        }
        out.innerHTML = html;
      }

      function initialsOf(name) {
        return name
          .replace(/[^\p{L}\s.'-]/gu, "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = input.value.trim();
        // replaceState keeps the URL shareable without re-rendering the page
        history.replaceState(null, "", "#/search" + (val ? "?q=" + encodeURIComponent(val) : ""));
        run();
      });
      input.addEventListener("input", run);
      input.focus();
      run();
    },
  };
}
