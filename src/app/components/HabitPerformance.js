"use client";

const HABITS = [
  { key: "gym", label: "Gym" },
  { key: "run", label: "Run" },
  { key: "sleep", label: "Sleep > 7 hrs" },
  { key: "protein", label: "Protein > 100g" },
  { key: "water", label: "Water 3.5L" },
  { key: "supplements", label: "Supplements" },
];

export default function HabitPerformance({ entries }) {
  const total = entries.length || 1;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-text mb-3">
        Habit Performance (30 days)
      </h3>
      <div className="space-y-3">
        {HABITS.map((habit) => {
          const completed = entries.filter(
            (e) => e.habits && e.habits[habit.key]
          ).length;
          const pct = Math.round((completed / total) * 100);
          return (
            <div key={habit.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text font-medium">
                  {habit.label}
                </span>
                <span className="text-text-tertiary">{pct}%</span>
              </div>
              <div className="h-1.5 bg-bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
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
