// app/page.tsx
import ClientPage from "./ClientPage";
import manifestJson from "../../public/drive-manifest.json" assert { type: "json" };

export const dynamic = "force-dynamic";

type DriveItem = { id: string; name: string };
const manifest = manifestJson as { files: DriveItem[] };

const MAX_PAGE_SIZE = 200;

type SP = Record<string, string | string[] | undefined>;

function filterList(q?: string) {
  const all = manifest.files ?? [];
  if (!q) return all;
  const needle = q.trim().toLowerCase();
  return all.filter((f) => f.name.toLowerCase().includes(needle));
}

// 🔀 Fisher–Yates shuffle (non-mutating)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const sp = (await searchParams) ?? {};
  const per = Math.min(
    Math.max(parseInt((sp.per as string) || "60", 10), 1),
    MAX_PAGE_SIZE
  );
  const page = Math.max(parseInt((sp.page as string) || "1", 10), 1);
  const q = (sp.q as string)?.trim() || undefined;

  // 1) filter -> 2) shuffle -> 3) paginate
  const filtered = filterList(q);
  const shuffled = shuffle(filtered);

  const total = shuffled.length;
  const totalPages = Math.max(Math.ceil(total / per), 1);
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * per;
  const end = Math.min(start + per, total);
  const slice = shuffled.slice(start, end);

  // pick first from shuffled for consistency within the request
  const headerPick = total ? shuffled[0].id : null;

  return (
    <ClientPage
      images={slice} // Array<{ id, name }>
      total={total}
      page={safePage}
      totalPages={totalPages}
      per={per}
      q={q}
      start={start}
      end={end}
      headerPick={headerPick} // Drive file ID or null
    />
  );
}
