import { useState } from "react";
import { api } from "../api.js";
import { LoadingState, ErrorState, EmptyState } from "./States.jsx";

export function ShortestPathView({ defaultFrom }) {
  const [from, setFrom] = useState(defaultFrom || "");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    setStatus("loading");
    try {
      const res = await api.shortestPath(from.trim(), to.trim());
      setResult(res);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Shortest dependency path</div>
          <div className="panel-subtitle">
            Find the shortest chain of DEPENDS_ON relationships connecting any two packages, in either direction.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="btn-row" style={{ marginBottom: "var(--space-5)" }}>
        <div className="search-field" style={{ flex: 1, minWidth: 160 }}>
          <input placeholder="from: create-react-app" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <span className="helptext">to</span>
        <div className="search-field" style={{ flex: 1, minWidth: 160 }}>
          <input placeholder="to: ms" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">
          Find path
        </button>
      </form>

      {status === "loading" && <LoadingState label={`Searching for a path between ${from} and ${to}…`} />}
      {status === "error" && <ErrorState body="Couldn't compute a path. Check both package names and try again." />}

      {status === "ready" && result && !result.connected && (
        <EmptyState
          title="No path found"
          body={`${result.from} and ${result.to} aren't connected by any DEPENDS_ON chain within 15 hops — or one of those package names doesn't exist in the seeded graph.`}
        />
      )}

      {status === "ready" && result?.connected && (
        <div className="panel-pad panel" style={{ padding: "var(--space-4)" }}>
          <div className="panel-subtitle" style={{ marginBottom: "var(--space-3)" }}>
            {result.hops} hop{result.hops === 1 ? "" : "s"} apart
          </div>
          <div className="btn-row" style={{ flexWrap: "wrap" }}>
            {result.path.map((name, i) => (
              <span key={`${name}-${i}`} className="btn-row" style={{ gap: 6 }}>
                <span className="pill" style={{ cursor: "default" }}>
                  {name}
                </span>
                {i < result.path.length - 1 && <span className="helptext">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {status === "idle" && (
        <EmptyState
          title="Enter two package names above"
          body="Try create-react-app → ms, or checkout-service → ms, to see a multi-hop chain."
        />
      )}
    </div>
  );
}
