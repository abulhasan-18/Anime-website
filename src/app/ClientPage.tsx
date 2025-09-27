"use client";

import React, { useMemo, useState } from "react";
import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

type DriveItem = { id: string; name: string };

interface ClientPageProps {
  images: DriveItem[];
  total: number;
  page: number;
  totalPages: number;
  per: number;
  q?: string;
  start: number;
  end: number;
  headerPick: string | null;
}

const proxyViewURL = (id: string) => `/api/drive/${id}`;
const proxyDownloadURL = (id: string) => `/api/drive/${id}?download=1`;

function FireBG() {
  return (
    <>
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/45 via-orange-400/25 to-transparent blur-3xl sm:block" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/35 via-amber-400/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-72 w-72 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/35 via-orange-300/20 to-transparent blur-3xl" />
    </>
  );
}

function Mark() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-600/10 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
      <Flame className="h-3.5 w-3.5" aria-hidden="true" />
      ANIME
    </span>
  );
}

function pageURL(base: string, page: number, per: number, q?: string) {
  const u = new URL(base, "http://x");
  u.searchParams.set("page", String(page));
  u.searchParams.set("per", String(per));
  if (q) u.searchParams.set("q", q);
  return u.search;
}

const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition active:translate-y-[1px] disabled:opacity-60 disabled:pointer-events-none";

/* ---- Single gallery card that hides itself on error ---- */
function GalleryCard({ id, name }: DriveItem) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;

  const viewURL = proxyViewURL(id);
  const dlURL = proxyDownloadURL(id);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-white/90 to-white/70 shadow-lg ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800/80 dark:from-zinc-900/90 dark:to-zinc-900/70">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-red-500/15 transition duration-300 group-hover:ring-red-500/45" />

      {/* Image (9:16) */}
      <div className="relative w-full aspect-[9/16]">
        <img
          src={viewURL}
          alt={name}
          loading="lazy"
          decoding="async"
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-[1.07]"
          onError={() => setBroken(true)} // ⬅️ vanish this tile on error
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-zinc-200/80 px-3 py-2 text-xs dark:border-zinc-800/80">
        <div className="max-w-[70%] truncate" title={name}>
          {name}
        </div>
        <a
          href={dlURL}
          download
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-gradient-to-br from-red-600 to-rose-600 px-3 py-1.5 font-medium text-white shadow-md ring-1 ring-black/10 transition hover:brightness-110 active:translate-y-[1px] dark:ring-white/10"
          title={`Download ${name}`}
          aria-label={`Download ${name}`}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>
    </article>
  );
}

export default function ClientPage({
  images,
  total,
  page,
  totalPages,
  per,
  q,
  start,
  end,
  headerPick,
}: ClientPageProps) {
  /* ---- Header fallback logic ---- */
  const headerCandidates = useMemo(() => {
    const ids = images.map((i) => i.id);
    return headerPick
      ? [headerPick, ...ids.filter((x) => x !== headerPick)]
      : ids;
  }, [headerPick, images]);

  const [headerIdx, setHeaderIdx] = useState(0);
  const currentHeaderId = headerCandidates[headerIdx];
  const headerSrc = currentHeaderId ? proxyViewURL(currentHeaderId) : null;
  const headerDL = currentHeaderId ? proxyDownloadURL(currentHeaderId) : null;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-red-300 selection:text-black">
      <FireBG />

      {/* NAV */}
      <nav className="sticky top-0 z-30 border-b border-red-500/30 bg-white/70 backdrop-blur-md dark:border-red-500/20 dark:bg-zinc-950/60">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-sm ring-1 ring-white/15">
              <span className="text-sm font-black">🔥</span>
            </div>
            <span className="font-extrabold tracking-tight">Anime Gallery</span>
          </div>
          <div className="hidden items-center gap-2 text-xs sm:flex">
            <Mark />
            <span className="text-zinc-600 dark:text-zinc-400">
              {total.toLocaleString()} file{total === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative mx-auto w-full max-w-7xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12 md:pt-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1
              className="text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl [text-wrap:balance]"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent drop-shadow">
                Sleek Anime Gallery
              </span>
              <br />
              <span className="text-zinc-800 dark:text-zinc-200">
                blazing red • modern • download-ready
              </span>
            </h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
              Built for <strong>mobile wallpaper</strong> lovers, this gallery
              is tuned to the crisp 9:16 frame so every image lands
              pixel-perfect on your lock screen. Scroll a responsive grid with
              buttery hover effects and one clean CTA —{" "}
              <strong>Download</strong>. Search is instant, pagination stays
              smooth, and lazy-loaded images keep things fast even with massive
              libraries. Dark/Light themes adapt to your vibe. Tap a card to
              view, or grab it straight to your device.
            </p>
          </div>

          {/* Featured image (9:16) with fallback */}
          <div className="relative">
            <div className="group mx-auto max-w-md overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl ring-1 ring-black/5 dark:border-zinc-800/80 dark:bg-zinc-900">
              <div className="relative w-full aspect-[9/16]">
                {headerSrc ? (
                  <img
                    src={headerSrc}
                    alt="Featured"
                    loading="eager"
                    decoding="async"
                    sizes="(min-width:1024px) 28rem, 90vw"
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    onError={() =>
                      setHeaderIdx((i) =>
                        i + 1 < headerCandidates.length ? i + 1 : i
                      )
                    }
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-red-600/20 via-rose-600/15 to-orange-500/20">
                    <span className="text-7xl">🦊</span>
                  </div>
                )}

                {headerDL && (
                  <a
                    href={headerDL}
                    download
                    className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-zinc-900 shadow-md ring-1 ring-black/10 backdrop-blur hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-white/10"
                    title="Download featured"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-xl border border-zinc-200/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <form
            method="get"
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch"
          >
            {/* search */}
            <label className="flex min-w-0 items-center gap-2 rounded-lg border border-zinc-200/70 bg-white px-3 py-2 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Search
                className="h-4 w-4 shrink-0 text-zinc-500"
                aria-hidden="true"
              />
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search images…"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-zinc-400"
                aria-label="Search"
              />
            </label>

            {/* per-page */}
            <label className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-zinc-200/70 bg-white px-3 py-2 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="truncate text-zinc-500">Per page</span>
              <input
                name="per"
                defaultValue={String(per)}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-24 bg-transparent text-right outline-none"
                aria-label="Items per page"
              />
            </label>

            {/* actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <a
                href={pageURL("?", 1, per, q)}
                className={`${btn} w-full border border-zinc-300 bg-white hover:border-red-500/60 dark:border-zinc-700 dark:bg-zinc-900 sm:w-auto`}
              >
                Reset
              </a>
              <button
                type="submit"
                className={`${btn} w-full border-2 border-red-600 bg-gradient-to-br from-red-600 to-rose-600 font-semibold text-white shadow-[0_4px_0_0_rgba(185,28,28,0.6)] sm:w-auto`}
              >
                Apply
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
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
      <section
        id="gallery"
        className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        {images.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-300">
              No images found. Add files to your Drive folder and re-run the
              manifest.{q ? <> Or clear your search.</> : null}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {images.map((item) => (
              <GalleryCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>

      {/* PAGER */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-center text-sm text-zinc-600 sm:text-left dark:text-zinc-400">
            Page <b>{page}</b> / <b>{totalPages}</b>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <a
              aria-disabled={page <= 1}
              href={page > 1 ? pageURL("?", page - 1, per, q) : "#"}
              className={`${btn} border ${
                page > 1
                  ? "border-zinc-300 bg-white hover:border-red-500/60 dark:border-zinc-700 dark:bg-zinc-900"
                  : "pointer-events-none border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
              }`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Prev
            </a>
            <a
              aria-disabled={page >= totalPages}
              href={page < totalPages ? pageURL("?", page + 1, per, q) : "#"}
              className={`${btn} border ${
                page < totalPages
                  ? "border-zinc-300 bg-white hover:border-red-500/60 dark:border-zinc-700 dark:bg-zinc-900"
                  : "pointer-events-none border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white/60 py-6 text-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Anime Gallery</span>
          <span className="text-zinc-500">
            Fire theme • Dark/Light • Mobile 9:16 ready
          </span>
        </div>
      </footer>
    </main>
  );
}
