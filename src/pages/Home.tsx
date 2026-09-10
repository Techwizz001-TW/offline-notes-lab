import { useEffect, useMemo, useState } from "react";

type Note = { id: number; title: string; body: string; updated: string };

const steps = [
  "Create the shell",
  "Make it installable",
  "Make it offline",
  "Test the boundary",
  "Deploy it",
];

const pillars = ["React UI", "localStorage", "Manifest", "Service worker"];

const starterNotes: Note[] = [
  {
    id: 1,
    title: "What makes a PWA?",
    body: "A manifest, a service worker, and a reliable user experience.",
    updated: "Today",
  },
];

const STUDENT = {
  name: "Stephen Divine Owoicho",
  department: "Computer Engineering",
  matricNumber: "2024/1/96689CP",
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("notes") || "null") || starterNotes;
    } catch {
      return starterNotes;
    }
  });
  const [done, setDone] = useState<number[]>([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [activePillar, setActivePillar] = useState(0);

  const progress = useMemo(() => Math.round((done.length / steps.length) * 100), [done]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  function addNote() {
    if (!title.trim() || !body.trim()) return;
    setNotes([
      { id: Date.now(), title: title.trim(), body: body.trim(), updated: "Just now" },
      ...notes,
    ]);
    setTitle("");
    setBody("");
  }

  function toggleStep(index: number) {
    setDone(done.includes(index) ? done.filter((x) => x !== index) : [...done, index]);
  }

  return (
    <div className="shell">
      <header>
        <strong>Offline Notes Lab</strong>
        <span>{online ? "Online" : "Offline"}</span>
      </header>

      <aside>
        <p className="section-label">Workshop map</p>
        <ol className="steps">
          {steps.map((step, index) => (
            <li key={step}>
              <button
                type="button"
                onClick={() => toggleStep(index)}
                className={done.includes(index) ? "done" : ""}
              >
                <span className="step-marker">{done.includes(index) ? "✓" : index + 1}</span>
                {step}
              </button>
            </li>
          ))}
        </ol>

        <div className="progress-block">
          <div className="progress-heading">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>
            Complete each checkpoint, then deliberately test what happens when the network
            disappears.
          </p>
        </div>
      </aside>

      <main>
        <div className="hero-row">
          <div className="hero-copy">
            <p className="eyebrow">Foundation track · PWA practical</p>
            <h1>Keep learning when the network leaves.</h1>

            <div className="student-card">
              <p>{STUDENT.name}</p>
              <p>{STUDENT.department}</p>
              <p>{STUDENT.matricNumber}</p>
            </div>

            <p className="lede">
              Create a note, refresh the page, then test the same experience with the network
              turned off. This small project demonstrates the core PWA building blocks from the
              workshop.
            </p>

            <nav className="pillars">
              {pillars.map((pillar, index) => (
                <button
                  type="button"
                  key={pillar}
                  className={index === activePillar ? "active" : ""}
                  onClick={() => setActivePillar(index)}
                >
                  {pillar}
                </button>
              ))}
            </nav>
          </div>

          <aside className={`signal-card ${online ? "signal-online" : "signal-offline"}`}>
            <p className="signal-label">Live test signal</p>
            <h2>{online ? "Network available" : "Offline mode"}</h2>
            <p>
              {online
                ? "Your browser can reach the network. Reload once to make the offline boundary easy to test."
                : "The service worker is serving the cached shell. Notes stay saved locally in this browser."}
            </p>
          </aside>
        </div>

        <section className="columns">
          <div>
            <h2>Notes from the lab</h2>
            {notes.map((note) => (
              <article key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <small>{note.updated}</small>
              </article>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              addNote();
            }}
          >
            <h2>Write a note</h2>
            <label>
              Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label>
              Observation
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={5}
              />
            </label>
            <button type="submit">Save locally</button>
          </form>
        </section>
      </main>
    </div>
  );
}
