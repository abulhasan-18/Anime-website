import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";

let cached: ReturnType<typeof google.drive> | null = null;

function normalizeKey(raw: string) {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .replace(/^"+|"+$/g, "")
    .trim();
}

function must(val: string | undefined, name: string): string {
  if (!val) throw new Error(`Missing ${name}`);
  return val;
}

export async function getDrive() {
  if (cached) return cached;

  let client_email: string | undefined;
  let private_key: string | undefined;

  if (process.env.NODE_ENV !== "production") {
    // Prefer local file in dev (most reliable on Windows / Node 20)
    const p = path.join(process.cwd(), "secrets", "service-account.json");
    const raw = await fs.readFile(p, "utf8"); // <-- throws if missing
    const sa = JSON.parse(raw) as {
      client_email?: string;
      private_key?: string;
    };
    client_email = sa.client_email;
    private_key = sa.private_key;
  } else {
    // Vercel / prod: use env
    client_email = process.env.GOOGLE_CLIENT_EMAIL;
    private_key = process.env.GOOGLE_PRIVATE_KEY;
  }

  const email = must(client_email, "client_email");
  const key = must(private_key, "private_key");

  const auth = new google.auth.JWT({
    email,
    key: normalizeKey(key),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  cached = google.drive({ version: "v3", auth });
  return cached;
}
