// src/app/api/drive/[id]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { getDrive } from "@/lib/drive";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // <-- await this
  if (!id) return new Response("Missing id", { status: 400 });

  const drive = await getDrive();

  const meta = await drive.files.get({
    fileId: id,
    fields: "mimeType,name,size",
    supportsAllDrives: true,
  });

  const media = await drive.files.get(
    { fileId: id, alt: "media", supportsAllDrives: true },
    { responseType: "stream" }
  );

  const mime = meta.data.mimeType || "application/octet-stream";
  const name = meta.data.name || "file";
  const size = meta.data.size ? Number(meta.data.size) : undefined;
  const wantsDownload = req.nextUrl.searchParams.get("download") === "1";

  const headers = new Headers();
  headers.set("Content-Type", mime);
  if (size) headers.set("Content-Length", String(size));
  headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
  );
  if (wantsDownload)
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(name)}"`
    );

  const stream = new ReadableStream({
    start(controller) {
      media.data.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      media.data.on("end", () => controller.close());
      media.data.on("error", (err: unknown) => controller.error(err));
    },
    cancel() {
      media.data.destroy();
    },
  });

  return new Response(stream, { headers });
}
