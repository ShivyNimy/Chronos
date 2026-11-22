// ─────────────────────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────────────────────
import {
  ERAS, REGIONS, STATS, EMPIRES, RULERS, TOPICS, EVENTS,
  RULER_BY_ID, EMPIRE_BY_ID, yearLabel,
} from "../data/index.js";
import {
  esc, icon, eraChip, sectionHead, moreLink, empireCard, rulerCard,
  deepTimeChart, mountDeepTime, statBlock, yearRange, fmtNum,
} from "../ui.js";

const FEATURED_REALMS = [
  "sumer", "ancient-egypt", "persia-achaemenid", "rome",
  "han", "abbasid", "mongolia", "mughal", "ottoman",
  "mali", "inca", "britain",
];

const FEATURED_RULERS = [
  "genghis-khan", "cleopatra-7", "ashoka", "akbar", "augustus",
  "qin-shi-huang", "elizabeth-1", "mansa-musa", "napoleon-bonaparte",
  "wu-zetian", "saladin", "mehmed-2", "sejong", "abraham-lincoln",
];

const CHRONICLE = [
  "-3400", "-3100", "-2334", "-1754", "-1274", "-480", "-331",
  "-221", "-44", "476", "622", "1066", "1206", "1453", "1492",
  "1789", "1868", "1914", "1945", "1969", "1989", "2022",
];

export function renderHome() {
  const featured = FEATURED_REALMS.map((id) => EMPIRE_BY_ID[id]).filter(Boolean);
  const rulers = FEATURED_RULERS.map((id) => RULER_BY_ID[id]).filter(Boolean);
  const topics = TOPICS.slice(0, 10);
  const greatRealms = EMPIRES.filter((e) => (e.extent || 0) >= 1000000);
  const chronicle = EVENTS.filter((e) => CHRONICLE.includes(String(e.year)));

  const tickerItems = RULERS.slice(0, 40)
    .map(
      (r) => `<span class="ticker-item"><b>${esc(r.name)}</b><i>${esc(r.empire?.name || "")}</i><span class="dim-2">${esc(yearRange(r.start, r.end))}</span></span>`
    )
    .join("");

  const html = `
  <section class="hero">
    <img class="hero-map" src="assets/world-silhouette.svg" alt="" aria-hidden="true" />
    <div class="hero-glow"></div>
    <div class="wrap hero-inner">
      <div>
        <p class="eyebrow">A complete atlas of the human past</p>
        <h1 class="display">Every realm.<br><em>Every ruler.</em><br>Every turning point.</h1>
        <p class="hero-lede">From the first cities of Mesopotamia to the present day — the rulers, realms and ideas that made the world. Six thousand five hundred years, in one place.</p>
        <div class="hero-search" data-open-search role="search" tabindex="0">
          ${icon("search")}
          <input type="text" placeholder="Search the archive — a ruler, a realm, a century…" readonly aria-label="Search the archive" />
          <kbd>⌘K</kbd>
        </div>
        <div class="hero-cta">
          <a class="btn btn-solid" href="#/timeline">Explore the timeline ${icon("arrowRight")}</a>
          <a class="btn btn-ghost" href="#/atlas">Open the atlas</a>
        </div>
      </div>
      <div class="era-column">
        <div class="era-col-head">Ten eras · one species</div>
        ${ERAS.map(
          (e) => `<a class="era-col-item" href="#/eras/${e.id}" style="--c:${e.color}">
            <span class="era-dot"></span>
            <span class="era-col-name">${esc(e.name)}</span>
            <span class="era-col-dates">${esc(e.fromLabel)}–${esc(e.toLabel)}</span>
          </a>`
        ).join("")}
      </div>
    </div>
    <div class="hero-stats">
      <div class="wrap hero-stats-inner">
        ${statBlock(fmtNum(STATS.empires), "Realms & empires")}
        ${statBlock(fmtNum(STATS.rulers), "Named rulers")}
        ${statBlock(fmtNum(STATS.topics), "Thematic chapters")}
        ${statBlock(fmtNum(STATS.events), "Turning points")}
        ${statBlock("6.5k", "Years of record", "+")}
      </div>
    </div>
  </section>

  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">${tickerItems}${tickerItems}</div>
  </div>

  <section class="section">
    <div class="wrap">
      ${sectionHead({
        kicker: "Deep time",
        index: "01",
        title: `The whole of history, <em>one chart</em>`,
        lede: `<p>Every realm in the archive, placed on a single axis of six and a half thousand years. Each bar is a civilisation's lifespan; the colour is its era. Scroll sideways, hover to identify, click to enter.</p>`,
        more: moreLink("#/timeline", "Full timeline"),
      })}
      ${deepTimeChart({ empires: greatRealms, pxPerYear: 0.52, id: "dt-home" })}
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      ${sectionHead({
        kicker: "Realms",
        index: "02",
        title: `Twelve of the <em>great realms</em>`,
        lede: `<p>Empires, kingdoms and civilisations from every continent — each with its rulers, its achievements and its own account of the world.</p>`,
        more: moreLink("#/empires", `All ${STATS.empires} realms`),
      })}
      <div class="grid-3">
        ${featured.map(empireCard).join("")}
      </div>
    </div>
  </section>

  <section class="section dark">
    <div class="wrap">
      <div class="grid-2" style="align-items:center">
        <div>
          <div class="section-kicker">The premise <span>/ why an atlas</span></div>
          <h2 class="section-title" style="font-size:clamp(1.9rem,3.6vw,3rem)">History is not a list.<br>It is a <em>system</em>.</h2>
        </div>
        <div class="section-lede" style="max-width:none">
          <p>Every ruler in this archive reigned inside a web of trade, climate, belief and accident that no single person controlled. The point of gathering them in one place is to see the pattern — the same institutions invented again and again, the same errors repeated.</p>
          <p style="margin-top:14px"><a class="section-more" href="#/topics">Read the chapters ${icon("arrowRight")}</a></p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      ${sectionHead({
        kicker: "Rulers",
        index: "03",
        title: `The people who <em>held the wheel</em>`,
        lede: `<p>Conquerors and lawgivers, reformers and monsters. Fourteen of the three hundred and thirty-seven rulers in the archive.</p>`,
        more: moreLink("#/rulers", "All rulers"),
      })}
    </div>
    <div class="wrap">
      <div class="hscroll">${rulers.map(rulerCard).join("")}</div>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      ${sectionHead({
        kicker: "Chapters",
        index: "04",
        title: `The <em>themes</em> beneath the chronology`,
        lede: `<p>Fifty-one long-form chapters on the ideas, technologies and catastrophes that cut across every empire — from the invention of writing to the climate crisis.</p>`,
        more: moreLink("#/topics", `All ${STATS.topics} chapters`),
      })}
      <div class="topic-list">
        ${topics
          .map(
            (t, i) => `<a class="trow" href="#/topics/${t.id}" style="--c:${t.eraData?.color}">
              <span class="trow-num">${String(i + 1).padStart(2, "0")}</span>
              <span class="trow-title">${esc(t.title)}<small>${esc(t.subtitle)}</small></span>
              <span class="trow-era">${esc(t.eraData?.short || "")}</span>
            </a>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      ${sectionHead({
        kicker: "Geography",
        index: "05",
        title: `History has an <em>address</em>`,
        lede: `<p>Eleven regions, each with its own sequence of states and its own rhythm of rise and decline. Follow a region across the whole span of the record.</p>`,
        more: moreLink("#/atlas", "Open the atlas"),
      })}
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

  <section class="section alt">
    <div class="wrap">
      ${sectionHead({
        kicker: "Chronicle",
        index: "06",
        title: `Twenty-two <em>turning points</em>`,
        lede: `<p>A selection from the ${STATS.events} dated events in the archive — the moments after which nothing was quite the same.</p>`,
        more: moreLink("#/timeline", "The full chronicle"),
      })}
      <div class="grid-2" style="gap:clamp(28px,4vw,64px)">
        <div class="chronicle">
          ${chronicle.slice(0, 11).map(chronicleItem).join("")}
        </div>
        <div class="chronicle">
          ${chronicle.slice(11, 22).map(chronicleItem).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--deep);color:var(--cream)">
    <div class="wrap" style="text-align:center;max-width:860px">
      <p class="eyebrow no-rule" style="justify-content:center;color:rgba(246,241,230,.45)">The record</p>
      <h2 class="section-title" style="margin:22px 0 18px;color:var(--cream);font-size:clamp(2rem,4.6vw,4rem)">Start anywhere.<br><em>It all connects.</em></h2>
      <p style="color:rgba(246,241,230,.55);font-weight:300;max-width:52ch;margin:0 auto 30px;line-height:1.7">
        ${fmtNum(STATS.rulers)} rulers. ${fmtNum(STATS.empires)} realms. ${fmtNum(STATS.topics)} chapters. One species, six thousand five hundred years.
      </p>
      <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">
        <a class="btn btn-rust" href="#/rulers">Browse the rulers ${icon("arrowRight")}</a>
        <a class="btn btn-ghost" href="#/empires">Browse the realms</a>
        <button class="btn btn-ghost" data-open-search>Search everything</button>
      </div>
    </div>
  </section>
  `;

  return {
    title: "",
    html,
    mount(root) {
      mountDeepTime(root);
    },
  };
}

function chronicleItem(ev) {
  return `<a class="citem" href="#/timeline?event=${ev.id}" style="--c:${ev.eraData?.color}">
    <div class="citem-year">${esc(ev.yearLabel)}</div>
    <div class="citem-body">
      <span class="citem-dot"></span>
      <div class="citem-title">${esc(ev.title)}</div>
      <div class="citem-desc">${esc(ev.description)}</div>
    </div>
  </a>`;
}
