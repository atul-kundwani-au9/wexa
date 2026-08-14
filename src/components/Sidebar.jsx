import { useEffect, useState } from "react";
import { api } from "../api.js";
import { EcosystemBadge } from "./Badges.jsx";

export function Sidebar({ selected, onSelect, overview }) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const data = await api.search(term.trim());
        if (!cancelled) setResults(data.results);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 220); // small debounce so we don't hammer the API on every keystroke
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [term]);

  const showingSearch = term.trim().length > 0;
  const list = showingSearch ? results : overview?.mostCritical || [];

  return (
    <aside className="sidebar">
      <div>
        <span className="field-label">Find a package</span>
        <div className="search-field">
          <input
            type="text"
            placeholder="express, qs, jinja2…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search packages"
          />
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <span className="field-label">
          {showingSearch ? (searching ? "Searching…" : `Results (${results.length})`) : "Highest blast radius"}
        </span>

        {showingSearch && !searching && results.length === 0 && (
          <p className="helptext">No packages match "{term}". Try a shorter or different term.</p>
        )}

        <ul className="result-list">
          {list.map((pkg) => (
            <li key={pkg.name}>
              <button
                className={`result-item ${selected === pkg.name ? "active" : ""}`}
                onClick={() => onSelect(pkg.name)}
              >
                <span className="result-item-name">{pkg.name}</span>
                {"blastRadius" in pkg ? (
                  <span className="result-item-eco mono">{pkg.blastRadius} dependents</span>
                ) : (
                  <EcosystemBadge ecosystem={pkg.ecosystem} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="helptext">
        Data is synthetic, seeded for this demo — package names and
        dependency shapes are illustrative, not a live feed.
      </div>
    </aside>
  );
}
