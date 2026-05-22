"use client";

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export default function RadarChart({ data, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 5;
  const total = data.length;

  // Calculate point position on the radar
  const getPoint = (index: number, value: number, maxR: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Grid polygon points for each level
  const gridPolygons = Array.from({ length: levels }, (_, lvl) => {
    const r = radius * ((lvl + 1) / levels);
    const pts = Array.from({ length: total }, (_, i) => {
      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return pts.join(' ');
  });

  // Data polygon
  const dataPoints = data.map((d, i) => getPoint(i, d.value, radius));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Axis lines
  const axisLines = data.map((_, i) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });

  // Label positions (slightly outside)
  const labelPositions = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const labelRadius = radius + 28;
    return {
      label: d.label,
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid polygons */}
      {gridPolygons.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="#2D3748"
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={line.x2}
          y2={line.y2}
          stroke="#2D3748"
          strokeWidth={1}
        />
      ))}

      {/* Data polygon fill */}
      <polygon
        points={dataPolygon}
        fill="rgba(16, 185, 129, 0.2)"
        stroke="#10B981"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={4}
          fill="#10B981"
          stroke="#101418"
          strokeWidth={2}
        />
      ))}

      {/* Labels */}
      {labelPositions.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#94A3B8"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="500"
        >
          {lp.label}
        </text>
      ))}
    </svg>
  );
}
