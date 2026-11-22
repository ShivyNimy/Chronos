// ─────────────────────────────────────────────────────────────────────────────
// CHRONOS — application shell & router
// ─────────────────────────────────────────────────────────────────────────────
import { ERAS, STATS, EMPIRES, RULERS, TOPICS, EVENTS } from "./data/index.js";
import { esc, icon, initPalette, mountReveal } from "./ui.js";
import { renderHome } from "./pages/home.js";
import { renderTimeline } from "./pages/timeline.js";
import { renderEmpires } from "./pages/empires.js";
import { renderEmpire } from "./pages/empire.js";
import { renderRulers } from "./pages/rulers.js";
import { renderRuler } from "./pages/ruler.js";
import { renderTopics } from "./pages/topics.js";
import { renderTopic } from "./pages/topic.js";
import { renderAtlas } from "./pages/atlas.js";
import { renderEra } from "./pages/era.js";
import { renderEras } from "./pages/eras.js";
import { renderRegion } from "./pages/region.js";
import { renderSearch } from "./pages/search.js";

const app = document.getElementById("app");

const NAV = [
  { href: "#/timeline", label: "Timeline" },
  { href: "#/empires", label: "Realms" },
  { href: "#/rulers", label: "Rulers" },
  { href: "#/topics", label: "Chapters" },
  { href: "#/atlas", label: "Atlas" },
];

const ROUTES = [
  { re: /^\/$/, page: renderHome, nav: "", dark: true },
  { re: /^\/timeline\/?$/, page: renderTimeline, nav: "timeline" },
  { re: /^\/empires\/?$/, page: renderEmpires, nav: "empires" },
  { re: /^\/empires\/([\w-]+)\/?$/, page: (m) => renderEmpire(m[1]), nav: "empires" },
  { re: /^\/rulers\/?$/, page: renderRulers, nav: "rulers" },
  { re: /^\/rulers\/([\w-]+)\/?$/, page: (m) => renderRuler(m[1]), nav: "rulers" },
  { re: /^\/topics\/?$/, page: renderTopics, nav: "topics" },
  { re: /^\/topics\/([\w-]+)\/?$/, page: (m) => renderTopic(m[1]), nav: "topics" },
  { re: /^\/atlas\/?$/, page: renderAtlas, nav: "atlas" },
  { re: /^\/search\/?$/, page: renderSearch, nav: "" },
  { re: /^\/eras\/?$/, page: renderEras, nav: "timeline" },
  { re: /^\/eras\/([\w-]+)\/?$/, page: (m) => renderEra(m[1]), nav: "" },
  { re: /^\/regions\/([\w-]+)\/?$/, page: (m) => renderRegion(m[1]), nav: "atlas" },
];

function navHTML(dark) {
  return `<header class="nav ${dark ? "on-dark" : ""}" id="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="#/" aria-label="Chronos — home">
        <svg class="brand-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="21" stroke-width="2.5"/>
          <path d="M11 32h42" stroke-width="1.1" opacity=".3" stroke="#857866"/>
          <path d="M16 24c6 5 26 5 32 0M16 40c6-5 26-5 32 0" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="32" cy="32" r="2.8" fill="currentColor" stroke="none"/>
        </svg>
        <span>
          <span class="brand-word">Chronos</span>
          <span class="brand-sub">Atlas of World History</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        ${NAV.map(
          (n) => `<a class="nav-link" data-nav="${n.label.toLowerCase()}" href="${n.href}">${n.label}</a>`
        ).join("")}
      </nav>
      <div class="nav-actions">
        <button class="nav-search" data-open-search aria-label="Search the atlas">
          ${icon("search")}<span>Search</span><kbd>⌘K</kbd>
        </button>
        <button class="nav-burger" data-menu aria-label="Open menu">${icon("menu")}</button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" hidden>
    ${NAV.map((n) => `<a href="${n.href}">${n.label}<span>0${NAV.indexOf(n) + 1}</span></a>`).join("")}
    <a href="#/eras">Eras<span>06</span></a>
  </div>`;
}

function footerHTML() {
  return `<footer class="footer">
    <img class="footer-map" src="assets/world-silhouette.svg" alt="" aria-hidden="true" />
    <div class="wrap footer-inner">
      <div class="footer-top">
        <div>
          <div class="footer-word">Chronos</div>
          <p class="footer-tag">A complete atlas of the human past — every realm, every ruler, every turning point, from the first cities to the present.</p>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#/timeline">Deep time</a>
          <a href="#/empires">All realms</a>
          <a href="#/rulers">All rulers</a>
          <a href="#/atlas">World atlas</a>
          <a href="#/eras">The ten eras</a>
          <a href="#/random">Surprise me</a>
          <a href="#/search">Search</a>
        </div>
        <div class="footer-col">
          <h4>Eras</h4>
          <a href="#/eras">All ten eras</a>
          ${ERAS.map((e) => `<a href="#/eras/${e.id}">${esc(e.short)}</a>`).join("")}
        </div>
        <div class="footer-col">
          <h4>Chapters</h4>
          ${TOPICS.slice(0, 5).map((t) => `<a href="#/topics/${t.id}">${esc(t.title)}</a>`).join("")}
        </div>
      </div>
      <div class="footer-bottom">
        <span>Chronos · ${STATS.empires} realms · ${STATS.rulers} rulers · ${STATS.topics} chapters · ${STATS.events} events</span>
        <span>Compiled as a public reference. Dates are scholarly approximations.</span>
      </div>
    </div>
  </footer>`;
}

/* ── router ─────────────────────────────────────────────────────────────── */
let current = null;
let renderGen = 0;

function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query] = raw.split("?");
  return { path: path || "/", params: new URLSearchParams(query || "") };
}

function render() {
  const gen = ++renderGen;
  const { path, params } = parseHash();

  // /random → bounce to a surprise entry. Replaces the hash rather than
  // pushing, so Back returns to wherever the reader came from.
  if (path === "/random" || path === "/random/") {
    const pool = [
      ...RULERS.map((r) => `#/rulers/${r.id}`),
      ...EMPIRES.map((e) => `#/empires/${e.id}`),
      ...TOPICS.map((t) => `#/topics/${t.id}`),
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    location.replace(pick);
    return;
  }

  let matched = null;
  let args = null;
  for (const r of ROUTES) {
    const m = path.match(r.re);
    if (m) {
      matched = r;
      args = m;
      break;
    }
  }

  const page = matched ? matched.page(args, params) : notFound();
  const dark = matched ? !!matched.dark : false;

  current?.unmount?.();
  document.getElementById("mobile-menu")?.setAttribute("hidden", "");

  app.innerHTML = navHTML(dark) + `<main id="main">${page.html}</main>` + footerHTML();

  // nav active state
  const navKey = matched?.nav;
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === navKey);
  });

  document.title = page.title
    ? `${page.title} — Chronos`
    : "Chronos — A Complete Atlas of World History";

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  requestAnimationFrame(() => {
    // A second navigation may have replaced the DOM before this frame ran.
    if (gen !== renderGen) return;
    mountReveal(app);
    page.mount?.(app, params);
  });

  current = page;
  bindShell(dark);
}

function notFound() {
  return {
    title: "Not found",
    html: `<div class="wrap page" style="padding-top:calc(var(--nav-h) + 80px);padding-bottom:120px">
      <div class="eyebrow">404</div>
      <h1 class="page-title" style="margin-top:16px">This page is lost to history.</h1>
      <p class="page-sub">The record you are looking for does not exist, or has been lost to time. Try the search, or return to the beginning.</p>
      <div class="row" style="margin-top:32px;gap:12px">
        <a class="btn btn-rust" href="#/">Return home ${icon("arrowRight")}</a>
        <button class="btn btn-line" data-open-search>Search the archive</button>
      </div>
    </div>`,
  };
}

/* ── shell interactions ─────────────────────────────────────────────────── */
let palette = null;
let navScroll = null;
let skipBound = false;

function bindShell(dark) {
  // "Skip to content" must not be swallowed by the hash router.
  // The link lives outside #app, so bind it only once.
  if (!skipBound) {
    document.querySelector("[data-skip]")?.addEventListener("click", (e) => {
      e.preventDefault();
      const main = document.getElementById("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
      main?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    skipBound = true;
  }

  document.querySelectorAll("[data-open-search]").forEach((b) => {
    b.addEventListener("click", () => palette.open());
    if (b.getAttribute("role") === "search") {
      b.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          palette.open();
        }
      });
    }
  });
  const burger = document.querySelector("[data-menu]");
  const menu = document.getElementById("mobile-menu");
  burger?.addEventListener("click", () => {
    const isOpen = !menu.hasAttribute("hidden");
    if (isOpen) menu.setAttribute("hidden", "");
    else menu.removeAttribute("hidden");
  });
  menu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => menu.setAttribute("hidden", ""));
  });

  // On the home route the bar starts over the dark hero; once the hero is
  // scrolled away, switch back to the light bar so it reads over cream.
  if (navScroll) {
    window.removeEventListener("scroll", navScroll);
    navScroll = null;
  }
  if (dark) {
    const nav = document.getElementById("nav");
    const hero = document.querySelector(".hero");
    if (nav && hero) {
      navScroll = () => {
        const past = window.scrollY > hero.offsetHeight - 60;
        nav.classList.toggle("on-dark", !past);
      };
      window.addEventListener("scroll", navScroll, { passive: true });
      navScroll();
    }
  }
}

/* ── boot ───────────────────────────────────────────────────────────────── */
palette = initPalette();
window.addEventListener("hashchange", render);

// Module scripts are deferred, so the DOM is parsed by now — but guard anyway.
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", render, { once: true });
} else {
  render();
}

// expose for debugging in console
window.__chronos = { STATS, EMPIRES, RULERS, TOPICS, EVENTS };
