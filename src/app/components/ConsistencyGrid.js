"use client";

export default function ConsistencyGrid({ entries }) {
  const entryMap = {};
  entries.forEach((e) => {
    entryMap[e.date] = e;
  });

  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push(dateStr);
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-text mb-3">
        Consistency (28 days)
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((dateStr) => {
          const entry = entryMap[dateStr];
          let bg = "bg-bg-card"; // missed
          if (entry) {
            if (entry.net > 0) bg = "bg-white"; // builder day
            else bg = "bg-white/30"; // tracked but not positive
          }
          return (
            <div
              key={dateStr}
              className={`aspect-square rounded ${bg}`}
              title={dateStr}
            />
          );
        })}
      </div>
    </div>
  );
}
