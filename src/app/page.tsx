// app/page.tsx
import ClientPage from "./ClientPage";
import { promises as fs } from "fs";
import path from "path";
import { randomInt } from "crypto";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 60;
const MAX_PAGE_SIZE = 200;

// ✅ look inside public/images (served at /images/* on Vercel)
const IMAGE_DIR = ["public", "images"];
const ACCEPT = /\.(png|jpe?g|webp|gif|avif)$/i;

function imageRoot() {
  return path.join(process.cwd(), ...IMAGE_DIR);
}

async function listImages(q?: string) {
  const dir = imageRoot();
  let items: string[] = [];
  try {
    items = await fs.readdir(dir);
  } catch {
    // folder missing or unreadable
    return [];
  }
  const filtered = items.filter((f) => ACCEPT.test(f));
  if (!q) return filtered.sort((a, b) => a.localeCompare(b));
  const needle = q.trim().toLowerCase();
  return filtered
    .filter((f) => f.toLowerCase().includes(needle))
    .sort((a, b) => a.localeCompare(b));
}

// types for async searchParams (Next 15+)
type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>;

export default async function Page(props: { searchParams?: SearchParams }) {
  // ⬇️ await when it's a Promise (server component API is async now)
  const sp =
    typeof (props.searchParams as any)?.then === "function"
      ? await (props.searchParams as Promise<
          Record<string, string | string[] | undefined>
        >)
      : ((props.searchParams ?? {}) as Record<
          string,
          string | string[] | undefined
        >);

  const perRaw = parseInt((sp.per as string) || "", 10);
  const per = Number.isFinite(perRaw)
    ? Math.min(Math.max(perRaw, 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  const q = (sp.q as string)?.trim() || undefined;

  const all = await listImages(q);
  const total = all.length;

  const pageRaw = parseInt((sp.page as string) || "", 10);
  const rawPage = Number.isFinite(pageRaw) ? Math.max(pageRaw, 1) : 1;

  const totalPages = Math.max(Math.ceil(total / per), 1);
  const page = Math.min(rawPage, totalPages);

  const start = (page - 1) * per;
  const end = Math.min(start + per, total);
  const slice = all.slice(start, end);

  const headerPick = all.length ? all[randomInt(all.length)] : null;

  return (
    <ClientPage
      images={slice} // filenames ONLY; render with /images/${encodeURIComponent(name)}
      total={total}
      page={page}
      totalPages={totalPages}
      per={per}
      q={q}
      start={start}
      end={end}
      headerPick={headerPick}
    />
  );
}
