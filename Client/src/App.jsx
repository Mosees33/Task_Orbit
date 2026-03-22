import { useEffect, useState } from "react";

import StatCard from "./components/StatCard";
import TaskCard from "./components/TaskCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fallbackTasks = [
  { id: "1", title: "Install project dependencies", status: "Done", owner: "You", priority: "High" },
  { id: "2", title: "Review the sample folder structure", status: "In Progress", owner: "You", priority: "Medium" },
  { id: "3", title: "Add your real MongoDB URI", status: "Backlog", owner: "You", priority: "High" },
];

const order = ["Backlog", "In Progress", "Done"];

function App() {
  const [health, setHealth] = useState(null);
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [healthResponse, boardResponse] = await Promise.all([
          fetch(`${API_URL}/api/health`),
          fetch(`${API_URL}/api/sample`),
        ]);

        if (!healthResponse.ok || !boardResponse.ok) {
          throw new Error("API request failed");
        }

        const [healthData, boardData] = await Promise.all([
          healthResponse.json(),
          boardResponse.json(),
        ]);

        if (!ignore) {
          setHealth(healthData);
          setBoard(boardData);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError("The frontend loaded, but the API is not reachable yet. Start the server to see live data.");
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const tasks = board?.tasks?.length ? board.tasks : fallbackTasks;
  const groupedTasks = order.map((status) => ({
    status,
    items: tasks.filter((task) => task.status === status),
  }));

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">MERN Starter Workspace</p>
          <h1>Task Orbit</h1>
          <p className="hero-copy">
            A sample React frontend talking to an Express API, with MongoDB ready when you add your connection string.
          </p>
        </div>
        <div className="hero-chip">
          <span className="chip-label">API</span>
          <strong>{error ? "Offline" : "Connected"}</strong>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Frontend"
          value="React + Vite"
          detail="Fast local development in the Client folder."
        />
        <StatCard
          title="Backend"
          value="Express"
          detail={health ? `Server status: ${health.status}` : "Health route ready at /api/health"}
        />
        <StatCard
          title="Database"
          value={board?.source === "database" ? "MongoDB Live" : "MongoDB Optional"}
          detail={board?.message || "Add MONGODB_URI in Server/.env when you are ready."}
        />
      </section>

      <section className="content-grid">
        <article className="board-panel">
          <div className="panel-heading">
            <h2>Sample Task Board</h2>
            <p>Use this as a starting frame for your app screens.</p>
          </div>

          <div className="board-columns">
            {groupedTasks.map((group) => (
              <div key={group.status} className="column">
                <div className="column-heading">
                  <h3>{group.status}</h3>
                  <span>{group.items.length}</span>
                </div>
                <div className="card-stack">
                  {group.items.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="setup-panel">
          <div className="panel-heading">
            <h2>Starter Checklist</h2>
            <p>These are the next edits most projects make first.</p>
          </div>

          <ul className="checklist">
            <li>Replace the sample task model with your real collection schema.</li>
            <li>Add more API routes in the Server `routes` and `controllers` folders.</li>
            <li>Build real pages and reusable components inside `Client/src`.</li>
            <li>Drop in your MongoDB URI to switch from demo data to the database.</li>
          </ul>

          <div className="endpoint-box">
            <p>API base URL</p>
            <code>{API_URL}</code>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}
        </aside>
      </section>
    </main>
  );
}

export default App;
