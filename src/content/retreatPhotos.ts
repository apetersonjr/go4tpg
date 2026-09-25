/**
 * Photography for /retreats-coaching (Alan, 25 Sep 2026).
 *
 * Optimized copies of the originals in Drive `Assets-Media/CyroliaRetreats`,
 * built by `scripts/build-retreat-photos.mjs`: metadata including GPS
 * stripped, WebP with a JPEG fallback, two widths each.
 */
export type RetreatPhoto = {
  /** File stem in `public/assets/retreats/`, e.g. "cyrolia-at-anchor". */
  name: string;
  /** Both widths the build script writes. */
  widths: [number, number];
  /** Intrinsic ratio of the output, so the browser reserves space before load. */
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export const atAnchor: RetreatPhoto = {
  name: "cyrolia-at-anchor",
  widths: [800, 1600],
  width: 1600,
  height: 1200,
  alt: "Cyrolia, a white sailing yacht, at anchor in a turquoise lagoon beneath jagged green peaks.",
  caption: "Cyrolia, at anchor in the Society Islands.",
};

export const aerialDinghy: RetreatPhoto = {
  name: "cyrolia-aerial-dinghy",
  widths: [800, 1600],
  width: 1600,
  height: 900,
  alt: "Aerial view of Cyrolia at anchor in clear turquoise water, her dinghy alongside, with green mountains behind.",
  caption: "Your office for seven nights.",
};

export const sharkSnorkel: RetreatPhoto = {
  name: "blacktip-reef-shark-snorkel",
  widths: [800, 1600],
  width: 1600,
  height: 1067,
  alt: "Snorkelers swimming above a blacktip reef shark over white sand in shallow clear water.",
  caption: "Afternoons on the water.",
};

export const greenPeak: RetreatPhoto = {
  name: "green-peak-across-lagoon",
  widths: [800, 1600],
  width: 1600,
  height: 1200,
  alt: "A steep, forested green peak rising above the lagoon, seen across the water.",
};

export const lagoonPanorama: RetreatPhoto = {
  name: "huahine-lagoon-panorama",
  widths: [1200, 2400],
  width: 2400,
  height: 651,
  alt: "A wide panorama of a clear, shallow lagoon in Huahine, with green hills and anchored sailboats along the far shore.",
};

export const alanSummit: RetreatPhoto = {
  name: "alan-maupiti-summit",
  widths: [800, 1600],
  width: 1600,
  height: 1143,
  alt: "Alan Peterson, arms raised, on a rocky summit high above Maupiti's lagoon and reef.",
  caption: "Your facilitator. Maupiti, French Polynesia.",
};
