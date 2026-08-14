export function TopBar({ stats }) {
  return (
    <header className="topbar">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 30 30" aria-hidden="true">
          <circle cx="15" cy="15" r="13" fill="none" stroke="var(--hairline-bright)" strokeDasharray="2 4" />
          <circle cx="15" cy="15" r="7.5" fill="none" stroke="var(--signal-high)" strokeWidth="1.5" opacity="0.8" />
          <circle cx="15" cy="15" r="3" fill="var(--signal-critical)" />
        </svg>
        <span className="brand-name">DepRadius</span>
        <span className="brand-tag">dependency blast-radius explorer</span>
      </div>

      {stats && (
        <div className="topbar-stats">
          <span className="stat-chip">
            <b>{stats.packageCount}</b> packages
          </span>
          <span className="stat-chip">
            <b>{stats.edgeCount}</b> depends-on edges
          </span>
          <span className="stat-chip">
            <b>{stats.vulnCount}</b> known vulns
          </span>
          <span className="stat-chip">
            <b>{stats.maintainerCount}</b> maintainers
          </span>
        </div>
      )}
    </header>
  );
}
