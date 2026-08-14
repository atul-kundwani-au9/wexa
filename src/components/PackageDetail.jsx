import { useEffect, useState } from "react";
import { api } from "../api.js";
import { EcosystemBadge, SeverityBadge } from "./Badges.jsx";
import { LoadingState, ErrorState } from "./States.jsx";

export function PackageDetail({ name }) {
  const [status, setStatus] = useState("loading");
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api
      .packageDetail(name)
      .then((res) => {
        if (cancelled) return;
        setPkg(res);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (status === "loading") return <LoadingState label={`Loading ${name}…`} />;
  if (status === "error" || !pkg) return <ErrorState body={`Couldn't load details for ${name}.`} />;

  return (
    <div className="panel panel-pad" style={{ marginBottom: "var(--space-5)" }}>
      <div className="panel-header">
        <div>
          <div className="panel-title mono" style={{ fontSize: 16 }}>
            {pkg.name}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> @{pkg.latestVersion || "—"}</span>
          </div>
          <div className="panel-subtitle">{pkg.description}</div>
        </div>
        <EcosystemBadge ecosystem={pkg.ecosystem} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <dl className="kv-list">
          <div className="kv-row">
            <dt>Direct dependencies</dt>
            <dd>{pkg.dependsOn.length}</dd>
          </div>
          <div className="kv-row">
            <dt>Direct dependents</dt>
            <dd>{pkg.dependedOnBy.length}</dd>
          </div>
          <div className="kv-row">
            <dt>Maintainers</dt>
            <dd>{pkg.maintainers.length || "—"}</dd>
          </div>
        </dl>

        <div>
          <span className="field-label">Known vulnerabilities</span>
          {pkg.vulnerabilities.length === 0 ? (
            <span className="helptext">None recorded</span>
          ) : (
            <div className="pill-list">
              {pkg.vulnerabilities.map((v) => (
                <SeverityBadge key={v.cveId} severity={v.severity} />
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="field-label">Maintained by</span>
          {pkg.maintainers.length === 0 ? (
            <span className="helptext">Unknown</span>
          ) : (
            <div className="pill-list">
              {pkg.maintainers.map((m) => (
                <span key={m} className="pill mono" style={{ cursor: "default" }}>
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
