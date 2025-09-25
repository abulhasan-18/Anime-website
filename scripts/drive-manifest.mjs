// load env for DRIVE_FOLDER_ID, etc.
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { google } from "googleapis";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sa from "../secrets/service-account.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

const { DRIVE_FOLDER_ID } = process.env;
if (!DRIVE_FOLDER_ID) {
  console.error("❌ Missing DRIVE_FOLDER_ID");
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: sa.client_email,
  key: sa.private_key, // comes perfectly formatted from JSON
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });

const ACCEPT = /^image\//;

async function listAll() {
  const files = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false`,
      fields: "nextPageToken, files(id,name,mimeType,size,modifiedTime)",
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    for (const f of res.data.files ?? []) {
      if (ACCEPT.test(f.mimeType ?? "")) files.push(f);
    }
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);
  return files.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

const files = await listAll();
const outPath = path.join(root, "public", "drive-manifest.json");
await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(
  outPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: files.length,
      files: files.map(({ id, name, size, modifiedTime }) => ({
        id,
        name,
        size: Number(size || 0),
        modifiedTime,
      })),
    },
    null,
    2
  )
);
console.log(`✅ wrote ${files.length} entries -> public/drive-manifest.json`);
