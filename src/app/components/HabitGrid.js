"use client";

const HABITS = [
  { key: "gym", label: "Gym", emoji: "🏋️", sub: "4×/week" },
  { key: "run", label: "Run", emoji: "🏃", sub: "3×/week" },
  { key: "sleep", label: "Sleep 7h+", emoji: "😴", sub: "6×/week" },
  { key: "protein", label: "Protein 100g+", emoji: "🥩", sub: "daily" },
  { key: "water", label: "Water 3.5L", emoji: "💧", sub: "daily" },
  { key: "supplements", label: "Supplements", emoji: "💊", sub: "daily" },
];

export default function HabitGrid({ habits, onToggle }) {
  const completedCount = HABITS.filter((h) => habits[h.key]).length;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-2">
        {HABITS.map((habit) => {
          const active = !!habits[habit.key];
          return (
            <button
              key={habit.key}
              onClick={() => onToggle(habit.key)}
              className={`flex items-center gap-2 px-3 py-3 rounded-lg border text-left transition-all duration-150 ${
                active
                  ? "bg-white border-white text-bg"
                  : "bg-bg border-border text-text-secondary hover:border-border-hover hover:text-text"
              }`}
            >
              <span className="text-lg leading-none flex-shrink-0">{habit.emoji}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-semibold leading-tight">{habit.label}</span>
                <span className={`text-[10px] leading-tight ${active ? "text-bg/60" : "text-text-tertiary"}`}>{habit.sub}</span>
              </div>
              {active && (
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm text-text-tertiary mt-3">
        {completedCount} / {HABITS.length} completed
      </p>
    </div>
  );
}

export { HABITS };
