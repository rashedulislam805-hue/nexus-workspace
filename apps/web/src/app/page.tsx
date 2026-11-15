"use client";

import { useMemo, useState } from "react";
import { messages, type Locale } from "@nexus/shared";

type Page = { id: string; title: string; body: string };

const starterPages: Page[] = [
  { id: "welcome", title: "শুরু করুন", body: "Nexus Workspace-এ স্বাগতম!\n\nএখানে আপনার নোট, পরিকল্পনা ও কাজ গুছিয়ে রাখুন।" },
  { id: "ideas", title: "আইডিয়া", body: "আপনার নতুন আইডিয়াগুলো এখানে লিখুন…" },
];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("bn");
  const [pages, setPages] = useState(starterPages);
  const [activeId, setActiveId] = useState("welcome");
  const [query, setQuery] = useState("");
  const t = messages[locale];
  const active = pages.find((p) => p.id === activeId) ?? pages[0];
  const filtered = useMemo(
    () => pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [pages, query]
  );

  function addPage() {
    const id = crypto.randomUUID();
    setPages((old) => [...old, { id, title: t.untitled, body: "" }]);
    setActiveId(id);
  }
  function updateActive(patch: Partial<Page>) {
    setPages((old) => old.map((p) => p.id === activeId ? { ...p, ...patch } : p));
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>{t.appName}</span></div>
        <div className="side-links">
          <button className="nav-item active">⌂ <span>{t.home}</span></button>
          <button className="nav-item">⌕ <span>{t.search}</span></button>
          <button className="nav-item">▤ <span>{t.tasks}</span></button>
          <button className="nav-item">▦ <span>{t.calendar}</span></button>
          <button className="nav-item">⚙ <span>{t.settings}</span></button>
        </div>
        <div className="pages-head"><span>{t.pages}</span><button onClick={addPage} aria-label={t.newPage}>＋</button></div>
        <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search + "…"} />
        <div className="page-list">
          {filtered.map((p) => (
            <button key={p.id} className={"page-link " + (p.id === activeId ? "selected" : "")} onClick={() => setActiveId(p.id)}>
              📄 {p.title || t.untitled}
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <span className="avatar">U</span><span>My Workspace</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="crumb">My Workspace <span>/</span> {active?.title}</div>
          <div className="top-actions">
            <span className="saved">● Local draft</span>
            <button className="lang" onClick={() => setLocale(locale === "bn" ? "en" : "bn")}>{locale.toUpperCase()}</button>
          </div>
        </header>
        <article className="editor">
          <div className="page-icon">📝</div>
          <p className="eyebrow">{t.welcome}</p>
          <input className="title-input" value={active?.title ?? ""} onChange={(e) => updateActive({ title: e.target.value })} aria-label="Page title" />
          <textarea className="body-input" value={active?.body ?? ""} onChange={(e) => updateActive({ body: e.target.value })} placeholder={t.editorHint} />
          <div className="editor-note">Starter preview · Changes are currently held in this browser session only.</div>
        </article>
      </section>
    </main>
  );
}
