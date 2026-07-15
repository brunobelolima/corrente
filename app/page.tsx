"use client";

import { useState } from "react";

const surfers = [
  { name: "Marina", age: 29, spot: "Maresias, SP", distance: "8 km", level: "Intermediária", wave: "Direitas longas", bio: "Arquiteta, longboarder e caçadora de pôr do sol. Procuro alguém para dividir estrada, café e maré boa.", photo: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=88", tags: ["Longboard", "Yoga", "Road trips"] },
  { name: "Luiza", age: 31, spot: "Praia do Rosa, SC", distance: "24 km", level: "Avançada", wave: "Tubos e água fria", bio: "Fotógrafa do oceano. Minha manhã ideal começa antes do vento e termina com brunch.", photo: "https://images.unsplash.com/photo-1530053969600-caed2596d2427?auto=format&fit=crop&w=1200&q=88", tags: ["Shortboard", "Fotografia", "Trilhas"] },
  { name: "Clara", age: 27, spot: "Itamambuca, SP", distance: "41 km", level: "Intermediária", wave: "Beach breaks", bio: "Bióloga marinha, aprendiz de shaper e otimista incurável.", photo: "https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=1200&q=88", tags: ["Fish", "Natureza", "Música"] },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("descobrir");
  const [notice, setNotice] = useState("");
  const profile = surfers[index % surfers.length];

  function react(kind: "pass" | "like" | "super") {
    setNotice(kind === "pass" ? "Próxima onda…" : kind === "super" ? "Prioridade enviada ✦" : `Você curtiu ${profile.name}!`);
    setTimeout(() => { setIndex((i) => i + 1); setNotice(""); }, 450);
  }

  return (
    <main>
      <header className="topbar">
        <button className="avatar" aria-label="Abrir perfil">BL</button>
        <button className="brand" onClick={() => setTab("descobrir")}><span>∿</span> corrente</button>
        <button className="filter" aria-label="Abrir filtros">☷</button>
      </header>

      <section className="content">
        {tab === "descobrir" && <>
          <div className="statusline"><span><i /> 23 pessoas na sua maré</span><button>Refinar</button></div>
          <div className={`card ${notice ? "leaving" : ""}`}>
            <img src={profile.photo} alt={`${profile.name} surfando`} />
            <div className="shade" />
            <div className="verified">✓ perfil verificado</div>
            <div className="info">
              <div className="name"><h1>{profile.name}, {profile.age}</h1><span>●</span></div>
              <p className="place">⌖ {profile.spot} · {profile.distance}</p>
              <div className="surfline"><b>{profile.level}</b><span>•</span>{profile.wave}</div>
              <p className="bio">{profile.bio}</p>
              <div className="tags">{profile.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
            {notice && <div className="notice">{notice}</div>}
          </div>
          <div className="actions">
            <button className="small rewind" aria-label="Voltar" onClick={() => setIndex(i => Math.max(0, i - 1))}>↶</button>
            <button className="large pass" aria-label="Passar" onClick={() => react("pass")}>×</button>
            <button className="large like" aria-label="Curtir" onClick={() => react("like")}>♥</button>
            <button className="small super" aria-label="Enviar prioridade" onClick={() => react("super")}>✦</button>
          </div>
          <p className="rule"><b>Ela inicia a conversa.</b> Depois do match, são 24h para mandar a primeira mensagem.</p>
        </>}

        {tab === "maré" && <section className="panel"><span className="bigicon">◉</span><h1>Sua maré</h1><p>Quando houver uma conexão mútua, ela aparece aqui. Perfis verificados têm prioridade.</p><div className="matchdemo"><div className="bubble marina"/><div className="heart">♥</div><div className="bubble luiza"/></div><button onClick={() => setTab("descobrir")}>Continuar descobrindo</button></section>}
        {tab === "mensagens" && <section className="panel"><span className="bigicon">≈</span><h1>Conversas</h1><p>Sem papo raso: use o spot favorito de vocês para quebrar o gelo.</p><div className="chat"><b>Equipe Corrente</b><span>Bem-vindo à comunidade. Respeito sempre, aloha em dobro.</span></div></section>}
      </section>

      <nav className="bottomnav" aria-label="Navegação principal">
        <button className={tab === "descobrir" ? "active" : ""} onClick={() => setTab("descobrir")}><span>⌁</span>Descobrir</button>
        <button className={tab === "maré" ? "active" : ""} onClick={() => setTab("maré")}><span>♥</span>Sua maré<i>2</i></button>
        <button className={tab === "mensagens" ? "active" : ""} onClick={() => setTab("mensagens")}><span>▱</span>Mensagens<i>1</i></button>
      </nav>
    </main>
  );
}
