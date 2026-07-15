import { env } from "cloudflare:workers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await env.DB.prepare("SELECT object_key, content_type FROM profile_photos WHERE id = ?").bind(id).first<{ object_key: string; content_type: string }>();
  if (!row) return new Response("Foto não encontrada", { status: 404 });
  const object = await env.UPLOADS.get(row.object_key);
  if (!object) return new Response("Foto não encontrada", { status: 404 });
  return new Response(object.body, { headers: { "Content-Type": row.content_type, "Cache-Control": "public, max-age=3600" } });
}
