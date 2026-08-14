const TABS = [
  { id: "blast-radius", label: "Blast Radius" },
  { id: "exposure", label: "Vulnerability Exposure" },
  { id: "shortest-path", label: "Shortest Path" },
  { id: "cycles", label: "Circular Dependencies" },
  { id: "bus-factor", label: "Bus Factor Risk" },
];

export function TabNav({ active, onChange }) {
  return (
    <nav className="tabnav" role="tablist" aria-label="Analysis views">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`tab-btn ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
