"use client";

export default function MetricBars({ creation, reflection, consumption, onCreation, onReflection, onConsumption }) {
  const metrics = [
    { label: "Creation", value: creation, color: "#1DB47A", onChange: onCreation },
    { label: "Reflection", value: reflection, color: "#1DB47A", onChange: onReflection },
    { label: "Consumption", value: consumption, color: "#E5484D", onChange: onConsumption },
  ];

  return (
    <div className="flex gap-4 w-full mt-6 mb-2">
      {metrics.map((m) => {
        const pct = (m.value / 10) * 100;
        return (
          <div key={m.label} className="flex-1 flex flex-col gap-1.5">
            {/* Label */}
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest text-center">
              {m.label}
            </span>

            {/* Slideable bar track */}
            <div className="relative h-2 rounded-full" style={{ background: "#1e1e1e" }}>
              {/* Fill */}
              <div
                className="absolute left-0 top-0 h-full rounded-full pointer-events-none transition-all duration-150"
                style={{ width: `${pct}%`, background: m.color }}
              />
              {/* Range input overlaid on top — invisible but interactive */}
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={m.value}
                onChange={(e) => m.onChange(parseInt(e.target.value, 10))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: "100%", margin: 0 }}
              />
            </div>

            {/* Value */}
            <span
              className="text-xs font-bold text-center tabular-nums"
              style={{ color: m.color }}
            >
              {Math.round(pct)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
