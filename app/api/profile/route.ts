import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function ensureSchema() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, birth_date TEXT NOT NULL, city TEXT NOT NULL, level TEXT NOT NULL, bio TEXT NOT NULL, surftrip_destination TEXT NOT NULL DEFAULT '', surftrip_date TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS profile_photos (id TEXT PRIMARY KEY NOT NULL, profile_email TEXT NOT NULL REFERENCES profiles(email) ON DELETE CASCADE, object_key TEXT NOT NULL, position INTEGER NOT NULL, content_type TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS profile_photos_email_idx ON profile_photos(profile_email)"),
  ]);
  const columns = await env.DB.prepare("PRAGMA table_info(profiles)").all<{ name: string }>();
  const names = new Set((columns.results ?? []).map(column => column.name));
  if (!names.has("surftrip_destination")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN surftrip_destination TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("surftrip_date")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN surftrip_date TEXT NOT NULL DEFAULT ''").run();
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre com ChatGPT para criar seu perfil." }, { status: 401 });
  await ensureSchema();
  const form = await request.formData();
  const photos = form.getAll("photos").filter((item): item is File => item instanceof File);
  if (photos.length < 1 || photos.length > 3) return Response.json({ error: "Escolha de 1 a 3 fotos." }, { status: 400 });
  if (photos.some(photo => !allowedTypes.has(photo.type) || photo.size > 5_000_000)) return Response.json({ error: "Use fotos JPG, PNG ou WebP de até 5 MB." }, { status: 400 });

  const fields = Object.fromEntries(["name", "birthDate", "city", "level", "bio", "surftripDestination", "surftripDate"].map(key => [key, String(form.get(key) ?? "").trim()]));
  if (Object.values(fields).some(value => !value)) return Response.json({ error: "Preencha todos os campos." }, { status: 400 });
  const now = Date.now();
  await env.DB.prepare("INSERT INTO profiles (email,name,birth_date,city,level,bio,surftrip_destination,surftrip_date,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,birth_date=excluded.birth_date,city=excluded.city,level=excluded.level,bio=excluded.bio,surftrip_destination=excluded.surftrip_destination,surftrip_date=excluded.surftrip_date,updated_at=excluded.updated_at")
    .bind(user.email, fields.name, fields.birthDate, fields.city, fields.level, fields.bio, fields.surftripDestination, fields.surftripDate, now, now).run();

  const previous = await env.DB.prepare("SELECT object_key FROM profile_photos WHERE profile_email = ?").bind(user.email).all<{ object_key: string }>();
  await Promise.all((previous.results ?? []).map(row => env.UPLOADS.delete(row.object_key)));
  await env.DB.prepare("DELETE FROM profile_photos WHERE profile_email = ?").bind(user.email).run();
  for (let position = 0; position < photos.length; position++) {
    const photo = photos[position];
    const id = crypto.randomUUID();
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const key = `profiles/${encodeURIComponent(user.email)}/${id}.${ext}`;
    await env.UPLOADS.put(key, photo.stream(), { httpMetadata: { contentType: photo.type } });
    await env.DB.prepare("INSERT INTO profile_photos (id,profile_email,object_key,position,content_type,created_at) VALUES (?,?,?,?,?,?)").bind(id, user.email, key, position, photo.type, now).run();
  }
  return Response.json({ ok: true });
}
