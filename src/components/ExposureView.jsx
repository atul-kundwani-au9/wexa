import { useEffect, useState } from "react";
import { api } from "../api.js";
import { LoadingState, ErrorState, EmptyState } from "./States.jsx";
import { SeverityBadge } from "./Badges.jsx";

export function ExposureView({ packageName }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!packageName) return;
    let cancelled = false;
    setStatus("loading");
    api
      .exposure(packageName, 6)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [packageName]);

  if (!packageName) {
    return (
      <EmptyState
        title="Pick a package to check its exposure"
        body="We'll walk its full dependency tree and surface every known vulnerability in anything it pulls in, direct or transitive."
      />
    );
  }
  if (status === "loading" || status === "idle") return <LoadingState label={`Walking ${packageName}'s dependency tree…`} />;
  if (status === "error") return <ErrorState body="Couldn't load vulnerability exposure for this package." />;

  if (data.exposures.length === 0) {
    return (
      <EmptyState
        title="No known vulnerabilities in this tree"
        body={`Nothing in ${data.root}'s dependency tree (within ${data.maxHops} hops) matches a seeded vulnerability record.`}
      />
    );
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Vulnerability exposure for {data.root}</div>
          <div className="panel-subtitle">
            {data.exposures.length} finding{data.exposures.length === 1 ? "" : "s"} across its dependency tree,
            ranked by severity.
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Severity</th>
            <th>CVE</th>
            <th>Found in</th>
            <th>Summary</th>
            <th>Fixed in</th>
          </tr>
        </thead>
        <tbody>
          {data.exposures.map((e) => (
            <tr key={`${e.packageName}-${e.cveId}`}>
              <td>
                <SeverityBadge severity={e.severity} />
              </td>
              <td className="mono">{e.cveId}</td>
              <td>
                <span className="pill" style={{ cursor: "default" }}>
                  {e.packageName}
                </span>{" "}
                {e.isDirect ? (
                  <span className="helptext" style={{ display: "inline" }}>
                    direct
                  </span>
                ) : (
                  <span className="helptext" style={{ display: "inline" }}>
                    transitive
                  </span>
                )}
              </td>
              <td style={{ maxWidth: 340 }}>{e.summary}</td>
              <td className="mono">{e.fixedInVersion || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
