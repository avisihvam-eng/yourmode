"use client";

const TARGETS = [
  { key: "sleep", label: "Sleep > 7 hrs", goal: 6 },
  { key: "gym", label: "Gym", goal: 4 },
  { key: "run", label: "Run", goal: 3 },
  { key: "water", label: "Water 3.5L", goal: 7 },
  { key: "mode", label: "Builder mode", goal: 4 },
];

export default function WeeklyTargets({ entries }) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  const mondayStr = monday.toISOString().split("T")[0];

  const weekEntries = entries.filter((e) => e.date >= mondayStr);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-text mb-3">
        Weekly Targets
      </h3>
      <div className="space-y-3">
        {TARGETS.map((target) => {
          let achieved = 0;

          if (target.key === "mode") {
            achieved = weekEntries.filter(
              (e) => e.creation + e.reflection > e.consumption
            ).length;
          } else {
            achieved = weekEntries.filter(
              (e) => e.habits && e.habits[target.key]
            ).length;
          }

          const hit = achieved >= target.goal;
          const pct = Math.min(Math.round((achieved / target.goal) * 100), 100);

          return (
            <div key={target.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text font-medium">
                  {target.label}
                </span>
                <span
                  className={
                    hit ? "text-white font-semibold" : "text-text-tertiary"
                  }
                >
                  {achieved} / {target.goal}
                </span>
              </div>
              <div className="h-1.5 bg-bg-card rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    hit ? "bg-white" : "bg-white/30"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
