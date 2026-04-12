"use client";

const HABITS = [
  { key: "gym", label: "Gym" },
  { key: "run", label: "Run" },
  { key: "sleep", label: "Sleep > 7 hrs" },
  { key: "protein", label: "Protein > 100g" },
  { key: "water", label: "Water 3.5L" },
  { key: "supplements", label: "Supplements" },
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
              className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium ${
                active
                  ? "bg-white border-white text-bg"
                  : "bg-bg border-border text-text-secondary hover:border-border-hover hover:text-text"
              }`}
            >
              <span>{habit.label}</span>
              {active && (
                <svg
                  className="w-4 h-4"
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
        {completedCount} / {HABITS.length}
      </p>
    </div>
  );
}

export { HABITS };
