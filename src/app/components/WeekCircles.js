"use client";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function WeekCircles({ entries }) {
  // Get the current week Mon–Sun
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const entryMap = {};
  entries.forEach((e) => { entryMap[e.date] = e; });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const entry = entryMap[dateStr];
    const isFuture = d > today;

    let color = "#1e1e1e"; // no log
    let status = "none";
    if (!isFuture && entry) {
      const net = (entry.creation || 0) + (entry.reflection || 0) - (entry.consumption || 0);
      if (net > 0) { color = "#1DB47A"; status = "builder"; }
      else if (net < 0) { color = "#E5484D"; status = "drift"; }
      else { color = "#F5A623"; status = "neutral"; }
    }

    const isToday = dateStr === today.toISOString().split("T")[0];

    return { dateStr, color, status, isToday, label: DAY_LABELS[i] };
  });

  const builderCount = days.filter((d) => d.status === "builder").length;
  const driftCount = days.filter((d) => d.status === "drift").length;
  const missedCount = days.filter((d) => d.status === "none" && new Date(d.dateStr) <= today).length;

  return (
    <div
      className="w-full rounded-2xl p-4 mb-4"
      style={{ background: "#141414", border: "1px solid #1e1e1e" }}
    >
      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">
        This Week
      </p>
      <div className="flex justify-between mb-3">
        {days.map((day) => (
          <div key={day.dateStr} className="flex flex-col items-center gap-1.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: day.color,
                border: day.isToday ? `2px solid white` : "none",
                opacity: day.status === "none" ? 0.3 : 1,
                boxShadow: day.status !== "none" ? `0 0 10px ${day.color}55` : "none",
              }}
            />
            <span className="text-[10px] text-text-tertiary font-medium">{day.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-tertiary text-center">
        {builderCount > 0 && <span className="text-teal">{builderCount} Builder</span>}
        {builderCount > 0 && (driftCount > 0 || missedCount > 0) && " · "}
        {driftCount > 0 && <span className="text-red">{driftCount} Drift</span>}
        {driftCount > 0 && missedCount > 0 && " · "}
        {missedCount > 0 && <span>{missedCount} Missed</span>}
        {builderCount === 0 && driftCount === 0 && missedCount === 0 && "Perfect week so far!"}
      </p>
    </div>
  );
}
