const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describeDonutSlice(cx, cy, outerR, innerR, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    'M', outerStart.x, outerStart.y,
    'A', outerR, outerR, 0, largeArc, 1, outerEnd.x, outerEnd.y,
    'L', innerStart.x, innerStart.y,
    'A', innerR, innerR, 0, largeArc, 0, innerEnd.x, innerEnd.y,
    'Z',
  ].join(' ');
}

export default function OrderPieChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
        No order data yet
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : 'Unknown',
    value: item.value ?? 0,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
        No order data yet
      </div>
    );
  }

  const cx = 150;
  const cy = 150;
  const outerR = 100;
  const innerR = 60;
  const slices = chartData.reduce((accumulator, item, index) => {
    const startAngle = accumulator.currentAngle;
    const sliceAngle = (item.value / total) * 360;
    const endAngle = startAngle + sliceAngle;

    accumulator.items.push({
      ...item,
      path: describeDonutSlice(cx, cy, outerR, innerR, startAngle, endAngle),
      color: COLORS[index % COLORS.length],
      percent: ((item.value / total) * 100).toFixed(0),
    });

    return {
      currentAngle: endAngle,
      items: accumulator.items,
    };
  }, { currentAngle: 0, items: [] }).items;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <svg viewBox="0 0 300 300" className="w-64 h-64 shrink-0">
        {slices.map((slice) => (
          <path
            key={slice.name}
            d={slice.path}
            fill={slice.color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-900 text-2xl font-bold">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="fill-gray-500 text-xs">
          orders
        </text>
      </svg>

      <ul className="space-y-3 w-full max-w-xs">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-gray-700">{slice.name}</span>
            </div>
            <span className="font-medium text-gray-900">
              {slice.value} ({slice.percent}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
