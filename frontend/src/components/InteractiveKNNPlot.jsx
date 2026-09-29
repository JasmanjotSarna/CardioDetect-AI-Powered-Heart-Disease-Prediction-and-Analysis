import React, { useState, useMemo } from 'react';

// Static illustrative training points in normalized 2D projection
const SAMPLE_TRAIN_POINTS = [
  { id: 1, x: 25, y: 35, label: 0 },
  { id: 2, x: 30, y: 45, label: 0 },
  { id: 3, x: 20, y: 55, label: 0 },
  { id: 4, x: 40, y: 30, label: 0 },
  { id: 5, x: 35, y: 65, label: 0 },
  { id: 6, x: 45, y: 50, label: 0 },
  { id: 7, x: 50, y: 40, label: 0 },
  { id: 8, x: 55, y: 25, label: 0 },
  { id: 9, x: 60, y: 60, label: 1 },
  { id: 10, x: 65, y: 70, label: 1 },
  { id: 11, x: 70, y: 55, label: 1 },
  { id: 12, x: 75, y: 80, label: 1 },
  { id: 13, x: 80, y: 65, label: 1 },
  { id: 14, x: 85, y: 75, label: 1 },
  { id: 15, x: 65, y: 45, label: 1 },
  { id: 16, x: 55, y: 75, label: 1 },
  { id: 17, x: 75, y: 40, label: 1 },
  { id: 18, x: 90, y: 60, label: 1 }
];

export default function InteractiveKNNPlot() {
  const [queryPoint, setQueryPoint] = useState({ x: 55, y: 52 });
  const [kValue, setKValue] = useState(5);

  // Compute nearest neighbors to query point
  const { nearestNeighbors, radius, positiveVotes, negativeVotes } = useMemo(() => {
    const withDist = SAMPLE_TRAIN_POINTS.map((pt) => {
      const dx = pt.x - queryPoint.x;
      const dy = pt.y - queryPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return { ...pt, dist };
    });

    withDist.sort((a, b) => a.dist - b.dist);
    const topK = withDist.slice(0, kValue);
    const r = topK.length > 0 ? topK[topK.length - 1].dist : 0;
    const pos = topK.filter((p) => p.label === 1).length;
    const neg = topK.filter((p) => p.label === 0).length;

    return {
      nearestNeighbors: topK,
      radius: r,
      positiveVotes: pos,
      negativeVotes: neg
    };
  }, [queryPoint, kValue]);

  const handleSvgClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    setQueryPoint({
      x: Math.max(10, Math.min(90, Math.round(clickX))),
      y: Math.max(10, Math.min(90, Math.round(clickY)))
    });
  };

  return (
    <div className="product-card p-6 space-y-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h3 className="font-display font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
            <span>Interactive Feature Space & k-Neighbors Voting</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Click anywhere on the coordinate plane to position a patient query vector.
          </p>
        </div>

        {/* k-Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[var(--text-secondary)]">Neighbors (k):</span>
          {[3, 5, 7].map((k) => (
            <button
              key={k}
              onClick={() => setKValue(k)}
              className={`px-2.5 py-1 rounded transition-colors ${
                kValue === k
                  ? 'bg-[var(--coral-red)] text-white font-bold'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              k={k}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Coordinate Space */}
      <div className="relative aspect-video sm:aspect-[2/1] w-full border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-canvas)] cursor-crosshair select-none medical-grid-bg">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          onClick={handleSvgClick}
        >
          {/* k-Radius Boundary Circle */}
          <circle
            cx={queryPoint.x}
            cy={queryPoint.y}
            r={radius}
            fill="var(--accent-cyan-subtle)"
            stroke="var(--accent-cyan)"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />

          {/* Distance vectors to nearest neighbors */}
          {nearestNeighbors.map((n) => (
            <line
              key={n.id}
              x1={queryPoint.x}
              y1={queryPoint.y}
              x2={n.x}
              y2={n.y}
              stroke="var(--accent-cyan)"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
            />
          ))}

          {/* Training Points */}
          {SAMPLE_TRAIN_POINTS.map((pt) => {
            const isNeighbor = nearestNeighbors.some((nn) => nn.id === pt.id);
            return (
              <circle
                key={pt.id}
                cx={pt.x}
                cy={pt.y}
                r={isNeighbor ? 2.5 : 1.8}
                fill={pt.label === 1 ? 'var(--coral-red)' : 'var(--medical-green)'}
                stroke={isNeighbor ? 'var(--text-main)' : 'none'}
                strokeWidth={isNeighbor ? 0.8 : 0}
                className="transition-all duration-200"
              />
            );
          })}

          {/* Interactive Query Vector Marker */}
          <circle
            cx={queryPoint.x}
            cy={queryPoint.y}
            r="3.5"
            fill="var(--accent-cyan)"
            stroke="var(--bg-surface)"
            strokeWidth="1.2"
          />
          <circle
            cx={queryPoint.x}
            cy={queryPoint.y}
            r="6"
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="0.6"
            className="animate-ping"
            style={{ transformOrigin: `${queryPoint.x}px ${queryPoint.y}px` }}
          />
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-[var(--bg-surface)]/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--medical-green)]" />
            <span>Normal Case</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--coral-red)]" />
            <span>Heart Disease</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
            <span>Query Patient</span>
          </div>
        </div>
      </div>

      {/* Live Voting Synthesis Bar */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold text-[var(--text-main)]">
            Voting Consensus (k={kValue}):
          </span>
          <span className="text-[var(--coral-red)] font-mono font-semibold">
            {positiveVotes} Positive
          </span>
          <span className="text-[var(--text-secondary)]">•</span>
          <span className="text-[var(--medical-green)] font-mono font-semibold">
            {negativeVotes} Negative
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-[var(--text-secondary)]">Classification:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              positiveVotes > negativeVotes
                ? 'bg-[var(--coral-red-subtle)] text-[var(--coral-red)]'
                : 'bg-[var(--medical-green-subtle)] text-[var(--medical-green)]'
            }`}
          >
            {positiveVotes > negativeVotes ? 'Elevated Cardiac Risk' : 'Low Cardiac Risk'}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[var(--text-muted)] italic">
        Educational demonstration: 2D projection of standardized coordinate space. Real inference computes Euclidean distances across all 15 pipeline dimensions.
      </p>
    </div>
  );
}
