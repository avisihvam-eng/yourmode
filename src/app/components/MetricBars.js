"use client";

export default function MetricBars({ creation, reflection, consumption }) {
  const metrics = [
    { label: "Creation", value: creation, color: "#1DB47A" },
    { label: "Reflection", value: reflection, color: "#1DB47A" },
    { label: "Consumption", value: consumption, color: "#E5484D" },
  ];

  return (
    <div className="flex gap-3 w-full mt-6 mb-2">
      {metrics.map((m) => {
        const pct = (m.value / 10) * 100;
        return (
          <div key={m.label} className="flex-1 flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest text-center">
              {m.label}
            </span>
            <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: m.color }}
              />
            </div>
            <span className="text-xs font-semibold text-center" style={{ color: m.color }}>
              {Math.round(pct)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
