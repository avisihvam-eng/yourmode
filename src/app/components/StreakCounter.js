"use client";

// Returns current streak of consecutive Builder Mode days (net > 0)
export function computeStreak(entries) {
  if (!entries || entries.length === 0) return 0;
  
  // Sort descending by date
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  
  let streak = 0;
  for (const entry of sorted) {
    const net = (entry.creation || 0) + (entry.reflection || 0) - (entry.consumption || 0);
    if (net > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function StreakCounter({ entries }) {
  const streak = computeStreak(entries);

  if (streak === 0) {
    return (
      <div
        className="w-full rounded-2xl p-4 mb-4 flex items-center gap-3"
        style={{ background: "#141414", border: "1px solid #1e1e1e" }}
      >
        <span className="text-2xl">🧠</span>
        <div>
          <p className="text-sm font-semibold text-white">Start your streak</p>
          <p className="text-xs text-text-tertiary">Log a Builder Mode day to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-2xl p-4 mb-4 flex items-center gap-3"
      style={{
        background: "linear-gradient(135deg, #1a1a0a, #141414)",
        border: "1px solid rgba(245, 166, 35, 0.3)",
        boxShadow: "0 0 20px rgba(245, 166, 35, 0.08)",
      }}
    >
      <span className="text-3xl">🔥</span>
      <div className="flex-1">
        <p className="text-xl font-bold text-white">{streak}-day Builder Streak</p>
        <p className="text-xs text-text-tertiary">Keep going — don&apos;t break the chain</p>
      </div>
    </div>
  );
}
