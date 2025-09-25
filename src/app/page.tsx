/* eslint-disable @next/next/no-img-element */
import { promises as fs } from "fs";
import path from "path";
import { randomInt } from "crypto";

// ✅ We want fresh reads as you add images without rebuilding
export const dynamic = "force-dynamic";

type SP = {
  page?: string;
  per?: string;
  q?: string; // optional: filter by filename
};

// --------- CONFIG ---------
const DEFAULT_PAGE_SIZE = 60; // tweak as you like (keeps each page light)
const MAX_PAGE_SIZE = 200; // safety guard for perf
const IMAGE_DIR = ["public", "images"]; // relative to project root
const ACCEPT = /\.(png|jpe?g|webp|gif|avif)$/i;

// --------- FS: list images with optional search ----------
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

// --------- flame background blobs -----------
function FireBG() {
  return (
    <>
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/50 via-orange-400/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/40 via-amber-400/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-80px] left-10 h-72 w-72 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/40 via-orange-300/25 to-transparent blur-3xl" />
    </>
  );
}

// --------- tiny accent -----------
function Mark() {
  return (
    <span className="inline-block rounded-md bg-red-600/10 px-2 py-0.5 text-red-700 dark:text-red-300 border border-red-500/20 text-xs font-semibold">
      ANIME
    </span>
  );
}

// --------- pagination helper ----------
function pageURL(base: string, page: number, per: number, q?: string) {
  const u = new URL(base, "http://x"); // base URL gets ignored; we only need query building
  u.searchParams.set("page", String(page));
  u.searchParams.set("per", String(per));
  if (q) u.searchParams.set("q", q);
  return u.search; // just return the ?query part
}

// --------- PAGE ----------
export default async function Page({
  searchParams,
}: {
  // Next 15 passes it as Promise sometimes — support both
  searchParams: SP | Promise<SP>;
}) {
  const sp = (await Promise.resolve(searchParams)) ?? {};
  const rawPer = Math.min(
    Math.max(parseInt(sp.per || ""), 1) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );
  const per = Number.isFinite(rawPer) ? rawPer : DEFAULT_PAGE_SIZE;

  const q = sp.q?.trim() || undefined;
  const all = await listImages(q);
  const total = all.length;

  const rawPage = Math.max(parseInt(sp.page || ""), 1) || 1;
  const totalPages = Math.max(Math.ceil(total / per), 1);
  const page = Math.min(rawPage, totalPages);

  const start = (page - 1) * per;
  const end = Math.min(start + per, total);
  const slice = all.slice(start, end);

  // --- random header image (every reload) ---
  const headerPick = all.length ? all[randomInt(all.length)] : null;
  const headerSrc = headerPick ? `/images/${headerPick}` : null;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-red-300 selection:text-black">
      <FireBG />

      {/* NAV */}
      <nav className="sticky top-0 z-30 border-b border-red-500/40 bg-white/75 backdrop-blur dark:bg-zinc-950/70">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-sm">
              <span className="text-sm font-black">🔥</span>
            </div>
            <span className="font-extrabold tracking-tight">Anime Gallery</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <Mark />
            <span className="text-zinc-600 dark:text-zinc-400">
              {total.toLocaleString()} file{total === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </nav>

      {/* HERO + CONTROLS */}
      <header className="relative mx-auto max-w-7xl px-4 pt-10 pb-6 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight [text-wrap:balance]">
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent drop-shadow">
                Sleek Anime Gallery
              </span>
              <br />
              <span className="text-zinc-800 dark:text-zinc-200">
                blazing red • modern • download-ready
              </span>
            </h1>
            <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              Images auto-load from{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-900">
                /public/images
              </code>
              . Pagination keeps it smooth even with 20k files. Hover a card to
              instantly <strong>view</strong> or <strong>download</strong>.
            </p>
          </div>

          {/* Random header image */}
          <div className="relative">
            <div className="mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-zinc-200 shadow-xl dark:border-zinc-800">
              {headerSrc ? (
                <img
                  src={headerSrc}
                  alt={headerPick ?? "Header image"}
                  loading="eager"
                  decoding="async"
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="grid h-72 place-items-center bg-gradient-to-br from-red-600/20 via-rose-600/15 to-orange-500/20">
                  <span className="text-7xl">🦊</span>
                </div>
              )}
            </div>
            {/* subtle corner flames */}
            <div className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 rotate-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 blur-[2px]" />
            <div className="pointer-events-none absolute -right-3 -bottom-3 h-10 w-10 -rotate-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 blur-[2px]" />
            {headerPick && (
              <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
                {headerPick}
              </span>
            )}
          </div>
        </div>

        {/* Controls & status */}
        <div className="mt-6 rounded-xl border border-zinc-200/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <form method="get" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 rounded-lg border border-zinc-200/70 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-zinc-500">Search</span>
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="filename..."
                className="w-full bg-transparent outline-none placeholder:text-zinc-400"
              />
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-zinc-200/70 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-zinc-500">Per page</span>
              <input
                name="per"
                defaultValue={String(per)}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-20 bg-transparent outline-none text-right"
              />
            </label>
            <div className="flex items-center justify-end gap-2">
              <a
                href={pageURL("?", 1, per, q)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:border-red-500/60 dark:border-zinc-700 dark:bg-zinc-900"
              >
                Reset
              </a>
              <button
                type="submit"
                className="rounded-lg border-2 border-red-600 bg-gradient-to-br from-red-600 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_0_0_rgba(185,28,28,0.6)]"
              >
                Apply
              </button>
            </div>
          </form>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <span>
              Showing <b>{start + 1}</b>–<b>{end}</b> of <b>{total}</b>
            </span>
            <span>
              Page <b>{page}</b> / <b>{totalPages}</b>
            </span>
          </div>
        </div>
      </header>

      {/* GALLERY */}
      <section id="gallery" className="relative mx-auto max-w-7xl px-4 pb-16">
        {slice.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-300">
              No images found. Drop files into{" "}
              <code className="font-mono">/public/images</code>
              {q ? <> or clear your search query.</> : null}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {slice.map((name) => {
              const src = `/images/${name}`;
              return (
                <article
                  key={name}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* red inner frame + conic glow on hover */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-red-500/20 group-hover:ring-red-500/60" />
                  <div className="pointer-events-none absolute -inset-8 opacity-0 blur-2xl transition-opacity group-hover:opacity-40">
                    <div className="h-full w-full bg-[conic-gradient(from_120deg_at_50%_50%,_rgba(244,63,94,0.35),_rgba(234,88,12,0.35),_transparent_60%)]" />
                  </div>

                  <img
                    src={src}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full object-cover transition-[filter,transform] duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
                  />

                  {/* bottom bar */}
                  <div className="flex items-center justify-between gap-2 border-t border-zinc-200 px-3 py-2 text-xs dark:border-zinc-800">
                    <div className="truncate">{name}</div>
                    <Mark />
                  </div>

                  {/* hover overlay actions */}
                  <div className="pointer-events-none absolute inset-0 grid place-items-center bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="pointer-events-auto flex gap-3">
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border-2 border-white/80 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                      >
                        View
                      </a>
                      <a
                        href={src}
                        download
                        className="rounded-lg border-2 border-red-500 bg-red-600/90 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_3px_0_0_rgba(185,28,28,0.7)] hover:bg-red-600"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* PAGER */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Page <b>{page}</b> / <b>{totalPages}</b>
          </div>
          <div className="flex items-center gap-2">
            <a
              aria-disabled={page <= 1}
              href={page > 1 ? pageURL("?", page - 1, per, q) : "#"}
   