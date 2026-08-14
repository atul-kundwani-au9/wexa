import { useEffect, useState } from "react";
import { api } from "../api.js";
import { LoadingState, ErrorState, EmptyState } from "./States.jsx";

export function CyclesView() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .cycles()
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return <LoadingState label="Scanning for circular dependency chains…" />;
  if (status === "error") return <ErrorState body="Couldn't run the cycle detection query." />;

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Circular dependencies</div>
          <div className="panel-subtitle">
            Packages that end up depending on themselves through some chain — often a sign of a peer-dependency
            mismatch or an accidental tight coupling between packages.
          </div>
        </div>
      </div>

      {data.cycles.length === 0 ? (
        <EmptyState title="No cycles found" body="No DEPENDS_ON chain in the graph loops back on itself." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {data.cycles.map((c, i) => (
            <div key={i} className="panel" style={{ padding: "var(--space-4)" }}>
              <div className="panel-subtitle" style={{ marginBottom: "var(--space-2)" }}>
                {c.length}-hop cycle
              </div>
              <div className="btn-row" style={{ flexWrap: "wrap" }}>
                {c.packages.map((name, idx) => (
                  <span key={idx} className="btn-row" style={{ gap: 6 }}>
                    <span className="pill" style={{ cursor: "default" }}>
                      {name}
                    </span>
                    {idx < c.packages.length - 1 && <span className="helptext">→</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
