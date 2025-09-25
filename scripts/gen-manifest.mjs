// scripts/gen-manifest.mjs
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "public", "images");

const ACCEPT = /\.(png|jpe?g|webp|gif|avif)$/i;

async function main() {
  let files = [];
  try {
    files = await fs.readdir(imagesDir);
  } catch (e) {
    console.warn("[manifest] public/images not found; writing empty manifest");
  }

  const list = (files || [])
    .filter((f) => ACCEPT.test(f))
    .sort((a, b) => a.localeCompare(b));

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: list.length,
    files: list,
  };

  const out = path.join(root, "public", "images-manifest.json");
  await fs.writeFile(out, JSON.stringify(manifest, null, 2));
  console.log(`[manifest] wrote ${manifest.count} files -> ${out}`);
}

main().catch((e) => {
  console.error("[manifest] failed:", e);
  process.exit(1);
});
