export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="pulse-ring" aria-hidden="true" />
      <div className="state-title mono">{label}</div>
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="state-block">
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="23" cy="23" r="21" fill="none" stroke="var(--hairline-bright)" strokeDasharray="3 5" />
        <circle cx="23" cy="23" r="4" fill="var(--text-muted)" />
      </svg>
      <div className="state-title mono">{title}</div>
      {body && <div className="state-body">{body}</div>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", body, onRetry }) {
  return (
    <div className="state-block">
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="23" cy="23" r="21" fill="var(--signal-critical-dim)" stroke="var(--signal-critical)" />
        <line x1="23" y1="14" x2="23" y2="26" stroke="var(--signal-critical)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="23" cy="32" r="1.6" fill="var(--signal-critical)" />
      </svg>
      <div className="state-title mono" style={{ color: "var(--signal-critical)" }}>{title}</div>
      {body && <div className="state-body">{body}</div>}
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
