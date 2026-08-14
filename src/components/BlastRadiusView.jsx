import { useEffect, useState } from "react";
import { api } from "../api.js";
import { RadialBlastGraph } from "./RadialBlastGraph.jsx";
import { LoadingState, ErrorState, EmptyState } from "./States.jsx";
import { EcosystemBadge } from "./Badges.jsx";

export function BlastRadiusView({ packageName, onSelect }) {
  const [maxHops, setMaxHops] = useState(6);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!packageName) return;
    let cancelled = false;
    setStatus("loading");
    api
      .blastRadius(packageName, maxHops)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [packageName, maxHops]);

  if (!packageName) {
    return (
      <EmptyState
        title="Pick a package to trace its blast radius"
        body="Search the sidebar for a package, or choose one from the highest blast-radius shortlist. We'll show every package that would be exposed if it were compromised."
      />
    );
  }

  if (status === "loading" || status === "idle") return <LoadingState label={`Tracing dependents of ${packageName}…`} />;
  if (status === "error") return <ErrorState body="Couldn't load the blast radius for this package." />;

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            If <span style={{ color: "var(--signal-critical)" }}>{data.target}</span> were compromised…
          </div>
          <div className="panel-subtitle">
            {data.dependents.length} package{data.dependents.length === 1 ? "" : "s"} depend on it, directly or
            transitively, within {maxHops} hops.
          </div>
        </div>
        <div className="btn-row">
          <span className="field-label" style={{ marginBottom: 0 }}>
            Max hops
          </span>
          {[2, 4, 6, 10].map((h) => (
            <button
              key={h}
              className={`btn ${maxHops === h ? "btn-primary" : "btn-quiet"}`}
              onClick={() => setMaxHops(h)}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {data.dependents.length === 0 ? (
        <EmptyState
          title="Nothing depends on this package"
          body={`No other seeded package reaches ${data.target} through a DEPENDS_ON path within ${maxHops} hops. It's a leaf, or the only thing near it is upstream.`}
        />
      ) : (
        <>
          <RadialBlastGraph
            target={data.target}
            dependents={data.dependents}
            edges={data.edges}
            onSelectNode={onSelect}
          />

          <div className="divider" />

          <table className="data-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Ecosystem</th>
                <th>Hops away</th>
                <th>Latest version</th>
              </tr>
            </thead>
            <tbody>
              {data.dependents.map((d) => (
                <tr key={d.name}>
                  <td>
                    <button className="pill" onClick={() => onSelect(d.name)}>
                      {d.name}
                    </button>
                  </td>
                  <td>
                    <EcosystemBadge ecosystem={d.ecosystem} />
                  </td>
                  <td className="mono">{d.hops}</td>
                  <td className="mono">{d.latestVersion || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
