import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

async function ensureChatSchema() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS trip_group_members (group_id TEXT NOT NULL, profile_email TEXT NOT NULL, joined_at INTEGER NOT NULL, PRIMARY KEY (group_id, profile_email))"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS trip_group_messages (id TEXT PRIMARY KEY NOT NULL, group_id TEXT NOT NULL, profile_email TEXT NOT NULL, author_name TEXT NOT NULL, message TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS trip_group_messages_group_idx ON trip_group_messages(group_id, created_at)"),
  ]);
}

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre com ChatGPT para acessar o grupo." }, { status: 401 });
  await ensureChatSchema();
  const groupId = new URL(request.url).searchParams.get("groupId")?.trim();
  if (!groupId) return Response.json({ error: "Grupo inválido." }, { status: 400 });
  const membership = await env.DB.prepare("SELECT 1 FROM trip_group_members WHERE group_id = ? AND profile_email = ?").bind(groupId, user.email).first();
  if (!membership) return Response.json({ joined: false, messages: [] });
  const messages = await env.DB.prepare("SELECT id, author_name AS authorName, message, created_at AS createdAt, profile_email = ? AS own FROM trip_group_messages WHERE group_id = ? ORDER BY created_at ASC LIMIT 100").bind(user.email, groupId).all();
  return Response.json({ joined: true, messages: messages.results ?? [] });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre com ChatGPT para participar." }, { status: 401 });
  await ensureChatSchema();
  const body = await request.json<{ action?: string; groupId?: string; message?: string }>();
  const groupId = body.groupId?.trim();
  if (!groupId || groupId.length > 80) return Response.json({ error: "Grupo inválido." }, { status: 400 });
  if (body.action === "join") {
    await env.DB.prepare("INSERT OR IGNORE INTO trip_group_members (group_id, profile_email, joined_at) VALUES (?, ?, ?)").bind(groupId, user.email, Date.now()).run();
    return Response.json({ ok: true });
  }
  const message = body.message?.trim();
  if (!message || message.length > 500) return Response.json({ error: "A mensagem deve ter até 500 caracteres." }, { status: 400 });
  const membership = await env.DB.prepare("SELECT 1 FROM trip_group_members WHERE group_id = ? AND profile_email = ?").bind(groupId, user.email).first();
  if (!membership) return Response.json({ error: "Entre no grupo antes de conversar." }, { status: 403 });
  const authorName = user.name?.trim() || user.email.split("@")[0];
  await env.DB.prepare("INSERT INTO trip_group_messages (id, group_id, profile_email, author_name, message, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), groupId, user.email, authorName, message, Date.now()).run();
  return Response.json({ ok: true });
}
