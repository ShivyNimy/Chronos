// ─────────────────────────────────────────────────────────────────────────────
// REGIONS — the geographical spine
// ─────────────────────────────────────────────────────────────────────────────
export const REGIONS = [
  {
    id: "mesopotamia",
    name: "Mesopotamia & the Middle East",
    short: "Middle East",
    tagline: "The cradle of the state",
    blurb:
      "Between the Tigris and Euphrates the first cities, the first writing and the first empires appeared. Sumer, Akkad, Babylon, Assyria and Persia each in turn ruled a world they thought eternal.",
    mapCenter: [44, 33],
  },
  {
    id: "north-africa",
    name: "Egypt & North Africa",
    short: "N. Africa",
    tagline: "The gift of the Nile",
    blurb:
      "Three thousand years of pharaonic continuity, then Carthage, Rome, the caliphates and the great trans-Saharan kingdoms that carried gold and salt across the desert.",
    mapCenter: [25, 26],
  },
  {
    id: "europe",
    name: "Europe",
    short: "Europe",
    tagline: "A peninsula of peninsulas",
    blurb:
      "A fragmented peninsula that spent most of history poor and peripheral — then, in four centuries, took over the world. Greece, Rome, the Middle Ages, and the states system that still governs us.",
    mapCenter: [15, 50],
  },
  {
    id: "mediterranean",
    name: "The Mediterranean",
    short: "Mediterranean",
    tagline: "One sea, many worlds",
    blurb:
      "The world's first great connector. Phoenicians, Greeks, Romans, Byzantines, Arabs and Venetians all made their fortunes on the same stretch of water.",
    mapCenter: [18, 38],
  },
  {
    id: "south-asia",
    name: "South Asia",
    short: "S. Asia",
    tagline: "A civilisation of synthesis",
    blurb:
      "The Indus Valley, the Mauryas and Guptas, the Delhi sultanate, the Mughals and the British Raj — a subcontinent that absorbed every invader and made them Indian.",
    mapCenter: [79, 22],
  },
  {
    id: "east-asia",
    name: "East Asia",
    short: "E. Asia",
    tagline: "The Middle Kingdom and its neighbours",
    blurb:
      "China's dynasties set the rhythm of a third of humanity. Japan, Korea and Vietnam wrote their own histories in the shadow of — and in dialogue with — the world's oldest continuous state.",
    mapCenter: [110, 35],
  },
  {
    id: "steppe",
    name: "Central Asia & the Steppe",
    short: "Steppe",
    tagline: "The sea of grass",
    blurb:
      "A corridor of grass from Mongolia to Hungary that produced the Xiongnu, the Türks, the Mongols and Tamerlane — and connected China to Europe for two thousand years.",
    mapCenter: [68, 45],
  },
  {
    id: "africa",
    name: "Sub-Saharan Africa",
    short: "Africa",
    tagline: "Kingdoms of gold and rain",
    blurb:
      "Aksum, Ghana, Mali, Songhai, Great Zimbabwe, Kongo, Benin and the Zulu — a continent of states and trading networks whose histories were written in gold, iron and oral epic.",
    mapCenter: [20, 2],
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    short: "SE Asia",
    tagline: "The monsoon crossroads",
    blurb:
      "Between India and China, the monsoon kingdoms of Funan, Angkor, Pagan, Srivijaya and Majapahit grew rich on the sea lanes that carried spice, silk and scripture.",
    mapCenter: [105, 12],
  },
  {
    id: "americas",
    name: "The Americas",
    short: "Americas",
    tagline: "Worlds apart",
    blurb:
      "Two continents isolated from the Old World for fifteen millennia, home to the Olmec, the Maya, Teotihuacan, the Aztec and the Inca — until 1492 joined them, catastrophically, to the rest.",
    mapCenter: [-90, 15],
  },
  {
    id: "oceania",
    name: "Oceania & the Pacific",
    short: "Oceania",
    tagline: "The greatest voyage",
    blurb:
      "The last great human migration: Austronesian navigators crossing thousands of kilometres of open ocean in outrigger canoes, settling from Madagascar to Easter Island.",
    mapCenter: [175, -15],
  },
];

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
