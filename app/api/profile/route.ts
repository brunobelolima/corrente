import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function ensureSchema() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, birth_date TEXT NOT NULL, gender TEXT NOT NULL DEFAULT '', height_cm INTEGER NOT NULL DEFAULT 0, relationship_intent TEXT NOT NULL DEFAULT '', alcohol_use TEXT NOT NULL DEFAULT '', smoking_use TEXT NOT NULL DEFAULT '', political_view TEXT NOT NULL DEFAULT '', music_taste TEXT NOT NULL DEFAULT '', instagram_username TEXT NOT NULL DEFAULT '', spotify_url TEXT NOT NULL DEFAULT '', city TEXT NOT NULL, level TEXT NOT NULL, board_type TEXT NOT NULL DEFAULT '', bio TEXT NOT NULL, surftrip_destination TEXT NOT NULL DEFAULT '', surftrip_date TEXT NOT NULL DEFAULT '', surftrip_arrival_date TEXT NOT NULL DEFAULT '', surftrip_departure_date TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS profile_photos (id TEXT PRIMARY KEY NOT NULL, profile_email TEXT NOT NULL REFERENCES profiles(email) ON DELETE CASCADE, object_key TEXT NOT NULL, position INTEGER NOT NULL, content_type TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS profile_photos_email_idx ON profile_photos(profile_email)"),
  ]);
  const columns = await env.DB.prepare("PRAGMA table_info(profiles)").all<{ name: string }>();
  const names = new Set((columns.results ?? []).map(column => column.name));
  if (!names.has("surftrip_destination")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN surftrip_destination TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("surftrip_date")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN surftrip_date TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("surftrip_arrival_date")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN surftrip_arrival_date TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("surftrip_departure_date")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN surftrip_departure_date TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("gender")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN gender TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("height_cm")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN height_cm INTEGER NOT NULL DEFAULT 0").run();
  if (!names.has("relationship_intent")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN relationship_intent TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("alcohol_use")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN alcohol_use TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("smoking_use")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN smoking_use TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("political_view")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN political_view TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("music_taste")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN music_taste TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("instagram_username")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN instagram_username TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("spotify_url")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN spotify_url TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("board_type")) await env.DB.prepare("ALTER TABLE profiles ADD COLUMN board_type TEXT NOT NULL DEFAULT ''").run();
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Entre com ChatGPT para criar seu perfil." }, { status: 401 });
  await ensureSchema();
  const form = await request.formData();
  const photos = form.getAll("photos").filter((item): item is File => item instanceof File);
  if (photos.length < 1 || photos.length > 3) return Response.json({ error: "Escolha de 1 a 3 fotos." }, { status: 400 });
  if (photos.some(photo => !allowedTypes.has(photo.type) || photo.size > 5_000_000)) return Response.json({ error: "Use fotos JPG, PNG ou WebP de até 5 MB." }, { status: 400 });

  const fields = Object.fromEntries(["name", "birthDate", "gender", "height", "relationshipIntent", "alcoholUse", "smokingUse", "politicalView", "musicTaste", "instagramUsername", "spotifyUrl", "city", "level", "boardType", "bio", "surftripDestination", "surftripArrivalDate", "surftripDepartureDate"].map(key => [key, String(form.get(key) ?? "").trim()]));
  const heightCm = Number(fields.height);
  if (!Number.isInteger(heightCm) || heightCm < 120 || heightCm > 230) return Response.json({ error: "Informe uma altura válida entre 120 e 230 cm" }, { status: 400 });
  const requiredFields = ["name", "birthDate", "gender", "height", "relationshipIntent", "alcoholUse", "smokingUse", "politicalView", "musicTaste", "city", "level", "boardType", "bio", "surftripDestination", "surftripArrivalDate", "surftripDepartureDate"];
  if (requiredFields.some(key => !fields[key])) return Response.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
  if (fields.surftripDepartureDate < fields.surftripArrivalDate) return Response.json({ error: "A data de saída deve ser igual ou posterior à chegada." }, { status: 400 });
  if (fields.instagramUsername && !/^@?[A-Za-z0-9._]{1,30}$/.test(fields.instagramUsername)) return Response.json({ error: "Informe um usuário válido do Instagram." }, { status: 400 });
  if (fields.spotifyUrl && !/^https:\/\/open\.spotify\.com\/(user|artist|playlist)\//i.test(fields.spotifyUrl)) return Response.json({ error: "Informe um link público válido do Spotify." }, { status: 400 });
  const now = Date.now();
  await env.DB.prepare("INSERT INTO profiles (email,name,birth_date,gender,height_cm,relationship_intent,alcohol_use,smoking_use,political_view,music_taste,instagram_username,spotify_url,city,level,board_type,bio,surftrip_destination,surftrip_date,surftrip_arrival_date,surftrip_departure_date,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,birth_date=excluded.birth_date,gender=excluded.gender,height_cm=excluded.height_cm,relationship_intent=excluded.relationship_intent,alcohol_use=excluded.alcohol_use,smoking_use=excluded.smoking_use,political_view=excluded.political_view,music_taste=excluded.music_taste,instagram_username=excluded.instagram_username,spotify_url=excluded.spotify_url,city=excluded.city,level=excluded.level,board_type=excluded.board_type,bio=excluded.bio,surftrip_destination=excluded.surftrip_destination,surftrip_date=excluded.surftrip_date,surftrip_arrival_date=excluded.surftrip_arrival_date,surftrip_departure_date=excluded.surftrip_departure_date,updated_at=excluded.updated_at")
    .bind(user.email, fields.name, fields.birthDate, fields.gender, heightCm, fields.relationshipIntent, fields.alcoholUse, fields.smokingUse, fields.politicalView, fields.musicTaste, fields.instagramUsername.replace(/^@/, ""), fields.spotifyUrl, fields.city, fields.level, fields.boardType, fields.bio, fields.surftripDestination, fields.surftripArrivalDate, fields.surftripArrivalDate, fields.surftripDepartureDate, now, now).run();

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
