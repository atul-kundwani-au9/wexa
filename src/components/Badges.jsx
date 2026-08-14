export function SeverityBadge({ severity }) {
  const label = severity || "UNKNOWN";
  const cls = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(label)
    ? `badge-${label}`
    : "badge-neutral";
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function EcosystemBadge({ ecosystem }) {
  return <span className="badge badge-neutral">{ecosystem || "unknown"}</span>;
}
