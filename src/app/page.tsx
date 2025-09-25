// app/page.tsx
import ClientPage from "./ClientPage";
import { randomInt } from "crypto";

// IMPORTANT: JSON lives in /public, import is resolved at build time
// If your tsconfig has "resolveJsonModule": true, this just works.
// Otherwise, use:  import manifest from "../../public/images-manifest.json" assert { type: "json" };
import manifest from "../../public/images-manifest.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_PAGE_SIZE = 60;
const MAX_PAGE_SIZE = 200;

const ACCEPT = /\.(png|jpe?g|webp|gif|avif)$/i;

type SP = Record<string, string | string[] | undefined>;

function listFromManifest(q?: string) {
  const all = (manifest?.files ?? []).filter((f: string) => ACCEPT.test(f));
  if (!q) return all;
  const needle = q.trim().toLowerCase();
  return all.filter((f: string) => f.toLowerCase().includes(needle));
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const sp = (await searchParams) ?? {};

  const perRaw = parseInt((sp.per as string) || "", 10);
  const per = Number.isFinite(perRaw)
    ? Math.min(Math.max(perRaw, 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  const q = (sp.q as string)?.trim() || undefined;

  const all = listFromManifest(q);
  const total = all.length;

  const pageRaw = parseInt((sp.page as string) || "", 10);
  const rawPage = Number.isFinite(pageRaw) ? Math.max(pageRaw, 1) : 1;

  const totalPages = Math.max(Math.ceil(total / per), 1);
  const page = Math.min(rawPage, totalPages);

  const start = (page - 1) * per;
  const end = Math.min(start + per, total);
  const slice = all.slice(start, end);

  const headerPick = total ? all[randomInt(total)] : null;

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
