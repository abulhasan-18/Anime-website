"use client";

import Image from "next/image";
import React from "react";

interface ClientPageProps {
  images: string[];
  total: number;
  page: number;
  totalPages: number;
  per: number;
  q?: string;
  start: number;
  end: number;
  headerPick: string | null;
}

function fileURL(name: string) {
  return `/images/${encodeURIComponent(name)}`;
}

function FireBG() {
  return (
    <>
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/50 via-orange-400/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/40 via-amber-400/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-80px] left-10 h-72 w-72 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/40 via-orange-300/25 to-transparent blur-3xl" />
    </>
  );
}

function Mark() {
  return (
    <span className="inline-block rounded-md border border-red-500/20 bg-red-600/10 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
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
  const headerSrc = headerPick ? fileURL(headerPick) : null;

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

      {/* HERO */}
      <header className="relative mx-auto max-w-7xl px-4 pt-10 pb-6 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold leading-tight [text-wrap:balance]"
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
            <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              Seamless gallery experience with smart pagination—built to stay
              fast even with very large libraries. Hover any card to{" "}
              <strong>preview</strong> or <strong>download</strong>.
            </p>
          </div>

          {/* Random header image */}
          <div className="relative">
            <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-zinc-200 shadow-xl dark:border-zinc-800">
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
          </div>
        </div>

        {/* Controls */}
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
                className="w-20 bg-transparent text-right outline-none"
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
        {images.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-300">
              No images found. Drop files into{" "}
              <code className="font-mono">/images</code>
              {q ? <> or clear your search query.</> : null}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {images.map((name) => {
              const url = fileURL(name);
              return (
                <article
                  key={name}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-red-500/20 group-hover:ring-red-500/60" />
                  <img
                    src={url}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
                  />
                  <div className="flex items-center justify-between gap-2 border-t border-zinc-200 px-3 py-2 text-xs dark:border-zinc-800">
                    <div className="truncate max-w-[75%]" title={name}>
                      {name}
                    </div>
                    <Mark />
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
              className={`rounded-lg border px-3 py-2 text-sm ${
                page > 1
                  ? "border-zinc-300 bg-white hover:border-red-500/60 dark:border-zinc-700 dark:bg-zinc-900"
                  : "pointer-events-none border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
              }`}
            >
              ← Prev
            </a>
            <a
              aria-disabled={page >= totalPages}
              href={page < totalPages ? pageURL("?", page + 1, per, q) : "#"}
              className={`rounded-lg border px-3 py-2 text-sm ${
                page < totalPages
                  ? "border-zinc-300 bg-white hover:border-red-500/60 dark:border-zinc-700 dark:bg-zinc-900"
                  : "pointer-events-none border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
              }`}
            >
              Next →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white/60 py-6 text-sm dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <span>© {new Date().getFullYear()} Anime Gallery</span>
          <span className="text-zinc-500">
            Fire theme • Dark/Light • Pagination-ready
          </span>
        </div>
      </footer>
    </main>
  );
}
