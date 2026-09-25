/**
 * One-off optimizer for the /retreats-coaching photography.
 *
 * Reads the originals from the Drive folder (never modified), applies EXIF
 * orientation, strips all metadata including GPS (sharp drops it unless
 * `withMetadata()` is called), and writes WebP plus a JPEG fallback at web
 * widths into public/assets/retreats/.
 *
 *   node scripts/build-retreat-photos.mjs "<path to Assets-Media/CyroliaRetreats>"
 */
import sharp from "sharp";
import path from "node:path";

const src = process.argv[2];
const out = path.resolve("public/assets/retreats");

const photos = [
  { file: "IMG_2426.jpeg", name: "cyrolia-at-anchor", widths: [800, 1600] },
  { file: "IMG_5905.jpeg", name: "cyrolia-aerial-dinghy", widths: [800, 1600] },
  { file: "Shark_DSC03235-Modifier.jpg", name: "blacktip-reef-shark-snorkel", widths: [800, 1600] },
  { file: "IMG_2055.jpeg", name: "green-peak-across-lagoon", widths: [800, 1600] },
  { file: "MaupitiMountainTopIMG_9762.jpeg", name: "alan-maupiti-summit", widths: [800, 1600] },
  {
    file: "HuahineFare.PanoPregnantWomanSilouette040226_IMG_4097.jpeg",
    name: "huahine-lagoon-panorama",
    widths: [1200, 2400],
    // Crop to the sweep: drop the upper sky so the band holds ridge and water.
    crop: (w, h) => ({ left: 0, top: Math.round(h * 0.2), width: w, height: Math.round(h * 0.68) }),
    quality: { webp: 62, jpeg: 64 },
  },
];

for (const p of photos) {
  const input = sharp(path.join(src, p.file)).rotate();
  const meta = await input.metadata();
  const base = p.crop ? input.clone().extract(p.crop(meta.width, meta.height)) : input.clone();
  for (const w of p.widths) {
    const resized = base.clone().resize({ width: w, withoutEnlargement: true });
    const q = p.quality ?? { webp: 72, jpeg: 74 };
    const a = await resized
      .clone()
      .webp({ quality: q.webp, effort: 6 })
      .toFile(`${out}/${p.name}-${w}.webp`);
    const b = await resized
      .clone()
      .jpeg({ quality: q.jpeg, mozjpeg: true, progressive: true })
      .toFile(`${out}/${p.name}-${w}.jpg`);
    console.log(
      `${p.name}-${w}: ${a.width}x${a.height}  webp ${(a.size / 1024).toFixed(0)}KB  jpg ${(b.size / 1024).toFixed(0)}KB`,
    );
  }
}
