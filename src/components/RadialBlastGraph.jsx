import { useMemo, useState } from "react";

const SIZE = 640;
const CENTER = SIZE / 2;
const RING_GAP = 78;
const BASE_RADIUS = 56;

function hopClass(hops) {
  if (hops === 1) return "node-hop-1";
  if (hops === 2) return "node-hop-2";
  if (hops === 3) return "node-hop-3";
  return "node-hop-rest";
}

export function RadialBlastGraph({ target, dependents, edges, onSelectNode }) {
  const [hovered, setHovered] = useState(null);

  const { positions, maxHop, byHop } = useMemo(() => {
    const grouped = new Map();
    let max = 1;
    for (const d of dependents) {
      max = Math.max(max, d.hops);
      if (!grouped.has(d.hops)) grouped.set(d.hops, []);
      grouped.get(d.hops).push(d);
    }

    const pos = new Map();
    pos.set(target, { x: CENTER, y: CENTER, hops: 0 });

    for (const [hops, nodes] of grouped) {
      const radius = BASE_RADIUS + hops * RING_GAP;
      const angleOffset = hops * 0.35; // stagger each ring for readability
      nodes.forEach((node, i) => {
        const angle = angleOffset + (i / nodes.length) * Math.PI * 2;
        pos.set(node.name, {
          x: CENTER + radius * Math.cos(angle),
          y: CENTER + radius * Math.sin(angle),
          hops,
        });
      });
    }

    return { positions: pos, maxHop: max, byHop: grouped };
  }, [target, dependents]);

  const ringRadii = Array.from({ length: maxHop }, (_, i) => BASE_RADIUS + (i + 1) * RING_GAP);
  const viewSize = Math.min(SIZE, BASE_RADIUS + (maxHop + 1) * RING_GAP + 40) || SIZE;

  return (
    <div className="graph-wrap">
      <svg
        className="graph-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-label={`Dependency blast radius graph centered on ${target}, showing ${dependents.length} downstream dependents.`}
      >
        {ringRadii.map((r, i) => (
          <g key={r}>
            <circle className="ring" cx={CENTER} cy={CENTER} r={r} />
            <text className="ring-label" x={CENTER + 4} y={CENTER - r - 4}>
              {i + 1} hop{i === 0 ? "" : "s"}
            </text>
          </g>
        ))}

        {edges.map((e) => {
          const a = positions.get(e.source);
          const b = positions.get(e.target);
          if (!a || !b) return null;
          return (
            <line
              key={`${e.source}->${e.target}`}
              className="edge-line"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          );
        })}

        <g className="node-group node-epicenter" transform={`translate(${CENTER}, ${CENTER})`}>
          <circle className="node-pulse" r={14} />
          <circle className="node-disc" r={9} />
          <text className="node-label" x={13} y={4} style={{ fontWeight: 600 }}>
            {target}
          </text>
        </g>

        {dependents.map((d) => {
          const p = positions.get(d.name);
          if (!p) return null;
          const isHovered = hovered === d.name;
          return (
            <g
              key={d.name}
              className={`node-group ${hopClass(d.hops)} ${isHovered ? "selected" : ""}`}
              transform={`translate(${p.x}, ${p.y})`}
              onMouseEnter={() => setHovered(d.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectNode?.(d.name)}
            >
              <circle className="node-disc" r={6} />
              <text
                className="node-label"
                x={p.x > CENTER ? 10 : -10}
                y={4}
                textAnchor={p.x > CENTER ? "start" : "end"}
              >
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="graph-legend">
        <span className="legend-swatch" style={{ "--dot-color": "var(--signal-critical)" }}>
          1 hop away
        </span>
        <span className="legend-swatch" style={{ "--dot-color": "var(--signal-high)" }}>
          2 hops away
        </span>
        <span className="legend-swatch" style={{ "--dot-color": "var(--signal-medium)" }}>
          3 hops away
        </span>
        <span className="legend-swatch" style={{ "--dot-color": "var(--accent)" }}>
          4+ hops away
        </span>
        <span style={{ marginLeft: "auto" }}>
          {dependents.length} package{dependents.length === 1 ? "" : "s"} would be affected
        </span>
      </div>
    </div>
  );
}
