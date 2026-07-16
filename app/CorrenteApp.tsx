"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Viewer = { name: string; email: string } | null;
type Draft = { name: string; birthDate: string; city: string; level: string; bio: string; surftripDestination: string; surftripDate: string };

const surfers = [
  { name: "Marina", age: 29, spot: "Maresias, SP", distance: "8 km", level: "Intermediária", wave: "Direitas longas", bio: "Arquiteta, longboarder e caçadora de pôr do sol. Procuro alguém para dividir estrada, café e maré boa.", trip: "Ericeira · 18 set", photo: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=88", tags: ["Longboard", "Yoga", "Road trips"] },
  { name: "Luiza", age: 31, spot: "Praia do Rosa, SC", distance: "24 km", level: "Avançada", wave: "Tubos e água fria", bio: "Fotógrafa do oceano. Minha manhã ideal começa antes do vento e termina com brunch.", trip: "El Salvador · 04 out", photo: "https://images.unsplash.com/photo-1530053969600-caed2596d2427?auto=format&fit=crop&w=1200&q=88", tags: ["Shortboard", "Fotografia", "Trilhas"] },
  { name: "Clara", age: 27, spot: "Itamambuca, SP", distance: "41 km", level: "Intermediária", wave: "Beach breaks", bio: "Bióloga marinha, aprendiz de shaper e otimista incurável.", trip: "Fernando de Noronha · 12 nov", photo: "https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=1200&q=88", tags: ["Fish", "Natureza", "Música"] },
];

const tripGroups = [
  { place: "Ericeira, Portugal", date: "18–25 set", members: 12, wave: "Point breaks · intermediário+" },
  { place: "El Salvador", date: "04–12 out", members: 8, wave: "Direitas longas · avançado" },
  { place: "Fernando de Noronha", date: "12–19 nov", members: 15, wave: "Ondulação de norte · todos os níveis" },
];

export default function CorrenteApp({ user }: { user: Viewer }) {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("descobrir");
  const [notice, setNotice] = useState("");
  const [signup, setSignup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>({ name: user?.name ?? "", birthDate: "", city: "", level: "Intermediário", bio: "", surftripDestination: "", surftripDate: "" });
  const profile = surfers[index % surfers.length];

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  function react(kind: "pass" | "like" | "super") {
    setNotice(kind === "pass" ? "Próxima onda…" : kind === "super" ? "Prioridade enviada ✦" : `Você curtiu ${profile.name}!`);
    setTimeout(() => { setIndex((i) => i + 1); setNotice(""); }, 450);
  }

  function pickPhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []).filter(file => file.type.startsWith("image/")).slice(0, 3);
    previews.forEach(URL.revokeObjectURL);
    setPhotos(selected);
    setPreviews(selected.map(file => URL.createObjectURL(file)));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData();
    Object.entries(draft).forEach(([key, value]) => form.append(key, value));
    photos.forEach(photo => form.append("photos", photo));
    const response = await fetch("/api/profile", { method: "POST", body: form });
    setSaving(false);
    if (response.ok) { setSaved(true); setTimeout(() => setSignup(false), 900); }
    else setNotice((await response.json()).error ?? "Não foi possível salvar o perfil.");
  }

  return (
    <main>
      <header className="topbar">
        <button className="avatar" aria-label="Abrir perfil" onClick={() => setSignup(true)}>{draft.name ? draft.name.slice(0,2).toUpperCase() : "+"}</button>
        <button className="brand" onClick={() => setTab("descobrir")}><span>∿</span> corrente</button>
        <button className="filter" aria-label="Abrir filtros">☷</button>
      </header>

      <section className="content">
        {!saved && <button className="joinbar" onClick={() => setSignup(true)}><span>Complete seu perfil</span><b>Cadastre-se e adicione fotos →</b></button>}
        {tab === "descobrir" && <>
          <div className="statusline"><span><i /> 23 pessoas na sua maré</span><button>Refinar</button></div>
          <div className={`card ${notice ? "leaving" : ""}`}>
            <img src={profile.photo} alt={`${profile.name} surfando`} /><div className="shade" /><div className="verified">✓ perfil verificado</div>
            <div className="info"><div className="name"><h1>{profile.name}, {profile.age}</h1><span>●</span></div><p className="place">⌖ {profile.spot} · {profile.distance}</p><div className="surfline"><b>{profile.level}</b><span>•</span>{profile.wave}</div><div className="trip">✈ Próxima surftrip: <b>{profile.trip}</b></div><p className="bio">{profile.bio}</p><div className="tags">{profile.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            {notice && <div className="notice">{notice}</div>}
          </div>
          <div className="actions"><button className="small rewind" aria-label="Voltar" onClick={() => setIndex(i => Math.max(0, i - 1))}>↶</button><button className="large pass" aria-label="Passar" onClick={() => react("pass")}>×</button><button className="large like" aria-label="Curtir" onClick={() => react("like")}>♥</button><button className="small super" aria-label="Enviar prioridade" onClick={() => react("super")}>✦</button></div>
          <p className="rule"><b>Ela inicia a conversa.</b> Depois do match, são 24h para mandar a primeira mensagem.</p>
        </>}
        {tab === "maré" && <section className="panel"><span className="bigicon">◉</span><h1>Sua maré</h1><p>Quando houver uma conexão mútua, ela aparece aqui. Perfis verificados têm prioridade.</p><div className="matchdemo"><div className="bubble marina"/><div className="heart">♥</div><div className="bubble luiza"/></div><button onClick={() => setTab("descobrir")}>Continuar descobrindo</button></section>}
        {tab === "surftrips" && <section className="groupsPanel"><p className="eyebrow">VIAJE COM A SUA TRIBO</p><h1>Grupos de surftrip</h1><p>Entre no grupo do seu próximo destino e conheça quem estará no mesmo pico.</p><div className="groupList">{tripGroups.map(group => { const joined = joinedGroups.includes(group.place); return <article className="groupCard" key={group.place}><div className="groupIcon">⌖</div><div><h2>{group.place}</h2><p>{group.date} · {group.members + (joined ? 1 : 0)} surfistas</p><small>{group.wave}</small></div><button className={joined ? "joined" : ""} onClick={() => setJoinedGroups(current => joined ? current.filter(place => place !== group.place) : [...current, group.place])}>{joined ? "No grupo ✓" : "Entrar"}</button></article>})}</div><p className="groupHint">O local preenchido no seu perfil ajuda a sugerir o grupo certo.</p></section>}
        {tab === "mensagens" && <section className="panel"><span className="bigicon">≈</span><h1>Conversas</h1><p>Sem papo raso: use o spot favorito de vocês para quebrar o gelo.</p><div className="chat"><b>Equipe Corrente</b><span>Bem-vindo à comunidade. Respeito sempre, aloha em dobro.</span></div></section>}
      </section>

      <nav className="bottomnav" aria-label="Navegação principal"><button className={tab === "descobrir" ? "active" : ""} onClick={() => setTab("descobrir")}><span>⌁</span>Descobrir</button><button className={tab === "maré" ? "active" : ""} onClick={() => setTab("maré")}><span>♥</span>Sua maré<i>2</i></button><button className={tab === "surftrips" ? "active" : ""} onClick={() => setTab("surftrips")}><span>✈</span>Surftrips</button><button className={tab === "mensagens" ? "active" : ""} onClick={() => setTab("mensagens")}><span>▱</span>Mensagens<i>1</i></button></nav>

      {signup && <div className="modalback" role="presentation">
        <section className="signup" role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <button className="close" onClick={() => setSignup(false)} aria-label="Fechar">×</button>
          <p className="eyebrow">ENTRE PARA A CORRENTE</p><h2 id="signup-title">Crie seu perfil</h2><p className="intro">Mostre quem você é dentro e fora d’água.</p>
          {!user && <a className="signin" href="/signin-with-chatgpt?return_to=%2F">Entrar com ChatGPT</a>}
          {user && <form onSubmit={submit}>
            <label>Nome<input required value={draft.name} onChange={e => setDraft({...draft,name:e.target.value})}/></label>
            <div className="twocol"><label>Nascimento<input required type="date" value={draft.birthDate} onChange={e => setDraft({...draft,birthDate:e.target.value})}/></label><label>Nível<select value={draft.level} onChange={e => setDraft({...draft,level:e.target.value})}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option><option>Profissional</option></select></label></div>
            <label>Cidade / praia base<input required placeholder="Ex.: Ubatuba, SP" value={draft.city} onChange={e => setDraft({...draft,city:e.target.value})}/></label>
            <fieldset className="tripFields"><legend>Próxima surftrip</legend><div className="twocol"><label>Local<input required placeholder="Ex.: Ericeira, Portugal" value={draft.surftripDestination} onChange={e => setDraft({...draft,surftripDestination:e.target.value})}/></label><label>Data<input required type="date" value={draft.surftripDate} onChange={e => setDraft({...draft,surftripDate:e.target.value})}/></label></div></fieldset>
            <label>Sobre você<textarea required maxLength={280} placeholder="Seu estilo de vida, onda favorita e o que procura…" value={draft.bio} onChange={e => setDraft({...draft,bio:e.target.value})}/></label>
            <div className="photolabel"><b>Suas fotos</b><span>{photos.length}/3</span></div><div className="photoGrid">{[0,1,2].map(i => <div className="photoSlot" key={i}>{previews[i] ? <img src={previews[i]} alt={`Foto ${i+1} selecionada`}/> : <span>{i === 0 ? "+" : "○"}</span>}</div>)}</div>
            <label className="upload">Escolher até 3 fotos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pickPhotos}/></label><small>JPG, PNG ou WebP. Máximo de 5 MB por foto.</small><button className="save" disabled={saving || photos.length === 0}>{saving ? "Salvando…" : saved ? "Perfil criado ✓" : "Criar meu perfil"}</button>
          </form>}
        </section>
      </div>}
    </main>
  );
}
