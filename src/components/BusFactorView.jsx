import { useEffect, useState } from "react";
import { api } from "../api.js";
import { LoadingState, ErrorState, EmptyState } from "./States.jsx";

export function BusFactorView() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .busFactor(6)
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

  if (status === "loading") return <LoadingState label="Aggregating blast radius by maintainer…" />;
  if (status === "error") return <ErrorState body="Couldn't run the bus-factor query." />;

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Bus factor risk</div>
          <div className="panel-subtitle">
            Maintainers of just one or two packages whose combined downstream blast radius is largest — a single
            person leaving would put a lot of the ecosystem at risk.
          </div>
        </div>
      </div>

      {data.maintainers.length === 0 ? (
        <EmptyState title="No concentrated risk found" body="No maintainer of 1–2 packages carries a notable combined blast radius." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Maintainer</th>
              <th>Packages maintained</th>
              <th>Combined blast radius</th>
            </tr>
          </thead>
          <tbody>
            {data.maintainers.map((m) => (
              <tr key={m.maintainer}>
                <td className="mono">{m.maintainer}</td>
                <td>
                  <div className="pill-list">
                    {m.packages.map((p) => (
                      <span key={p.package} className="pill" style={{ cursor: "default" }}>
                        {p.package} <span className="helptext" style={{ display: "inline" }}>({p.blastRadius})</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="mono">{m.totalBlastRadius}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
