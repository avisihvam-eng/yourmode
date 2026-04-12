"use client";

const HABITS = [
  { key: "gym", label: "Gym", emoji: "\uD83C\uDFCB\uFE0F", sub: "4 days/week" },
  { key: "run", label: "Run", emoji: "\uD83C\uDFC3", sub: "3 days/week" },
  { key: "sleep", label: "Sleep > 7 hrs", emoji: "\uD83D\uDE34", sub: "6 days/week" },
  { key: "protein", label: "Protein > 100g", emoji: "\uD83E\uDD69", sub: "daily" },
  { key: "water", label: "Water 3.5L", emoji: "\uD83D\uDCA7", sub: "daily" },
  { key: "supplements", label: "Supplements", emoji: "\uD83D\uDC8A", sub: "daily" },
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
              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left transition-all duration-150 ${
                active
                  ? "bg-white border-white text-bg"
                  : "bg-bg border-border text-text-secondary hover:border-border-hover hover:text-text"
              }`}
            >
              <span className="text-xl leading-none">{habit.emoji}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{habit.label}</span>
                <span className={`text-[10px] ${active ? "text-bg/60" : "text-text-tertiary"}`}>{habit.sub}</span>
              </div>
              {active && (
                <svg
                  className="w-4 h-4 ml-auto flex-shrink-0"
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
