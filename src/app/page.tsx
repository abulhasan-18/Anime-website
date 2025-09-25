import ClientPage from "./ClientPage";
import { promises as fs } from "fs";
import path from "path";
import { randomInt } from "crypto";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 60;
const MAX_PAGE_SIZE = 200;
const IMAGE_DIR = ["public", "images"];
const ACCEPT = /\.(png|jpe?g|webp|gif|avif)$/i;

async function listImages(q?: string) {
  const dir = path.join(process.cwd(), ...IMAGE_DIR);
  let items: string[] = [];
  try {
    items = await fs.readdir(dir);
  } catch {
    return [];
  }
  const filtered = items.filter((f) => ACCEPT.test(f));
  if (!q) return filtered.sort();
  const needle = q.trim().toLowerCase();
  return filtered.filter((f) => f.toLowerCase().includes(needle)).sort();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page(props: any) {
  const sp = (props.searchParams ?? {}) as Record<
    string,
    string | string[] | undefined
  >;

  const rawPer = Math.min(
    Math.max(parseInt((sp.per as string) || ""), 1) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );
  const per = Number.isFinite(rawPer) ? rawPer : DEFAULT_PAGE_SIZE;

  const q = (sp.q as string)?.trim() || undefined;
  const all = await listImages(q);
  const total = all.length;

  const rawPage = Math.max(parseInt((sp.page as string) || ""), 1) || 1;
  const totalPages = Math.max(Math.ceil(total / per), 1);
  const page = Math.min(rawPage, totalPages);

  const start = (page - 1) * per;
  const end = Math.min(start + per, total);
  const slice = all.slice(start, end);

  const headerPick = all.length ? all[randomInt(all.length)] : null;

  return (
    <ClientPage
      images={slice}
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
