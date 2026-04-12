"use client";

export default function NetTrend({ entries }) {
  const last7 = entries.slice(-7);
  const maxAbs = Math.max(...last7.map((e) => Math.abs(e.net)), 1);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-text mb-3">
        Net Trend (7 days)
      </h3>
      <div className="flex items-end justify-between gap-2 h-28 border border-border rounded-lg px-4 py-3">
        {last7.length === 0 && (
          <p className="text-xs text-text-tertiary m-auto">No data yet</p>
        )}
        {last7.map((entry, i) => {
          const height = Math.max((Math.abs(entry.net) / maxAbs) * 80, 4);
          const day = new Date(entry.date + "T00:00:00");
          const label = dayLabels[day.getDay()];

          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-1">
              <div className="flex-1 flex items-end w-full justify-center">
                <div
                  className="w-full max-w-[24px] rounded-t bg-white/80"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-[10px] text-text-tertiary">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
