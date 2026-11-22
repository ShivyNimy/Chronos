// ─────────────────────────────────────────────────────────────────────────────
// ERAS — the master spine of the atlas
// Dates are signed years: negative = BCE, positive = CE
// ─────────────────────────────────────────────────────────────────────────────
export const ERAS = [
  {
    id: "prehistory",
    name: "Prehistory",
    short: "Prehistory",
    from: -2500000,
    to: -3200,
    fromLabel: "2.5 Mya",
    toLabel: "3200 BCE",
    color: "#9C8A6E",
    tagline: "Before writing",
    blurb:
      "Two and a half million years of human becoming. Fire, language, migration out of Africa, cave painting, agriculture and the first permanent villages — all of it before a single word was written down.",
  },
  {
    id: "bronze",
    name: "Bronze Age",
    short: "Bronze Age",
    from: -3200,
    to: -1200,
    fromLabel: "3200 BCE",
    toLabel: "1200 BCE",
    color: "#C08445",
    tagline: "The first cities",
    blurb:
      "Writing, the wheel, the plough and bronze metallurgy transform villages into states. Sumer, Egypt, the Indus Valley and Shang China invent urban civilisation independently, and the first empires rise between the Tigris and Euphrates.",
  },
  {
    id: "iron",
    name: "Iron Age",
    short: "Iron Age",
    from: -1200,
    to: -550,
    fromLabel: "1200 BCE",
    toLabel: "550 BCE",
    color: "#7A8B6F",
    tagline: "After the collapse",
    blurb:
      "The Late Bronze Age collapse breaks the old order. Iron replaces bronze, alphabets replace hieroglyphs, and new peoples — Assyrians, Israelites, Phoenicians, Persians, Celts — build the world that classical antiquity will inherit.",
  },
  {
    id: "classical",
    name: "Classical Antiquity",
    short: "Classical",
    from: -800,
    to: 500,
    fromLabel: "800 BCE",
    toLabel: "500 CE",
    color: "#A64B32",
    tagline: "Greece, Rome and the Buddha",
    blurb:
      "Athens invents democracy, Rome builds an empire, Confucius and the Buddha articulate ethics, and Alexander carries Greek culture to the Indus. Half the world's great classical texts are written in this window.",
  },
  {
    id: "late-antiquity",
    name: "Late Antiquity",
    short: "Late Antiquity",
    from: 200,
    to: 800,
    fromLabel: "200 CE",
    toLabel: "800 CE",
    color: "#7B5E8C",
    tagline: "The transformation of the ancient world",
    blurb:
      "Rome fragments, Christianity becomes a state religion, Islam erupts out of Arabia and China is reunified. The ancient world does not fall so much as mutate into the medieval one.",
  },
  {
    id: "medieval",
    name: "Medieval Era",
    short: "Medieval",
    from: 500,
    to: 1500,
    fromLabel: "500 CE",
    toLabel: "1500 CE",
    color: "#3E6355",
    tagline: "Faith, feudalism and the Silk Road",
    blurb:
      "A thousand years of cathedrals, crusades, caliphates and caravans. The Islamic world carries the torch of scholarship, Tang China is the world's richest state, and the Mongols stitch Eurasia together by violence.",
  },
  {
    id: "early-modern",
    name: "Early Modern",
    short: "Early Modern",
    from: 1500,
    to: 1800,
    fromLabel: "1500 CE",
    toLabel: "1800 CE",
    color: "#2E5C7A",
    tagline: "The world joins up",
    blurb:
      "Columbus, da Gama and Magellan stitch the oceans together. Empires become global, silver flows from Potosí to China, the Reformation shatters Christendom and the Ottoman, Mughal, Safavid and Ming courts reach their peak.",
  },
  {
    id: "long-19th",
    name: "The Long 19th Century",
    short: "1800–1914",
    from: 1800,
    to: 1914,
    fromLabel: "1800 CE",
    toLabel: "1914 CE",
    color: "#96701F",
    tagline: "Industry and empire",
    blurb:
      "Steam, steel and electricity remake human life within a single lifespan. Europe colonises four-fifths of the planet, nationalism invents modern politics, and Japan becomes the first Asian industrial power.",
  },
  {
    id: "modern",
    name: "Modern Era",
    short: "Modern",
    from: 1914,
    to: 1991,
    fromLabel: "1914 CE",
    toLabel: "1991 CE",
    color: "#A32E42",
    tagline: "The age of catastrophe",
    blurb:
      "Two world wars, the Holocaust, the atom bomb, decolonisation and a Cold War that never went hot. In under eighty years the world's population triples and the map is redrawn almost everywhere.",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    short: "Contemporary",
    from: 1991,
    to: 2026,
    fromLabel: "1991 CE",
    toLabel: "present",
    color: "#2B2B33",
    tagline: "The networked world",
    blurb:
      "The Cold War ends, the internet arrives, China rises and the climate becomes the defining question. History does not stop; it accelerates beyond the ability of any single archive to keep up.",
  },
];

export const ERA_BY_ID = Object.fromEntries(ERAS.map((e) => [e.id, e]));

/** Map any signed year to its primary era. */
export function eraForYear(year) {
  if (year <= -3200) return ERA_BY_ID.prehistory;
  if (year <= -1200) return ERA_BY_ID.bronze;
  if (year <= -550) return ERA_BY_ID.iron;
  if (year <= 500) return ERA_BY_ID.classical;
  if (year <= 800) return ERA_BY_ID["late-antiquity"];
  if (year <= 1500) return ERA_BY_ID.medieval;
  if (year <= 1800) return ERA_BY_ID["early-modern"];
  if (year <= 1914) return ERA_BY_ID["long-19th"];
  if (year <= 1991) return ERA_BY_ID.modern;
  return ERA_BY_ID.contemporary;
}

/** Which eras does a span [from, to] touch? */
export function erasForSpan(from, to) {
  return ERAS.filter((e) => from <= e.to && to >= e.from);
}
