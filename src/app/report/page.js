"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getEntries } from "@/lib/entries";
import BottomNav from "@/app/components/BottomNav";
import WeekCircles from "@/app/components/WeekCircles";
import HabitPerformance from "@/app/components/HabitPerformance";

function getInsight(entries) {
  if (entries.length < 3) return null;
  const last5 = entries.slice(-5);
  const driftDays = last5.filter(e => e.net < 0).length;
  const builderDays = last5.filter(e => e.net > 0).length;
  const avgCreation = last5.reduce((s, e) => s + (e.creation || 0), 0) / last5.length;

  if (driftDays >= 3) return `⚠️ ${driftDays} of your last 5 days were in Drift Mode. Your cognitive output is trending down — try reducing screen time today.`;
  if (builderDays >= 4) return `🔥 You've been in Builder Mode ${builderDays} of the last 5 days. Momentum is building — protect this streak.`;
  if (avgCreation > 6) return `🧠 Your best days happen when Creation is above 6. You're averaging ${avgCreation.toFixed(1)} — keep creating.`;
  return `💡 Your habit completion drives your net score. Focus on the habits that are in the red this week.`;
}

export default function ReportPage() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function init(session) {
      const uid = session ? session.user.id : localStorage.getItem("mode_guest_id");
      if (uid) {
        getEntries(uid, 30).then((data) => { setEntries(data || []); setLoaded(true); });
      } else {
        setLoaded(true);
      }
    }
    supabase.auth.getSession().then(({ data: { session } }) => init(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => init(s));
    return () => subscription.unsubscribe();
  }, []);

  const totalEntries = entries.length;
  const last7 = entries.slice(-7);
  const avgNet = last7.length > 0
    ? (last7.reduce((s, e) => s + (e.net || 0), 0) / last7.length).toFixed(1)
    : "—";
  const habitDays = entries.filter(e => {
    const habits = e.habits || {};
    return Object.values(habits).some(Boolean);
  }).length;
  const habitRate = totalEntries > 0 ? Math.round((habitDays / totalEntries) * 100) : 0;

  const totalCreation = entries.reduce((s, e) => s + (e.creation || 0), 0);
  const totalReflection = entries.reduce((s, e) => s + (e.reflection || 0), 0);
  const totalConsumption = entries.reduce((s, e) => s + (e.consumption || 0), 0);
  const maxEnergy = Math.max(totalCreation, totalReflection, totalConsumption, 1);
  const insight = getInsight(entries);

  return (
    <div className="flex flex-col min-h-screen pb-28 px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Report</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Your cognitive summary</p>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-bg-elevated rounded-full animate-spin" style={{ borderTopColor: "#1DB47A" }} />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl mb-3">🧠</p>
          <p className="text-text-secondary font-semibold">No data yet</p>
          <p className="text-text-tertiary text-sm mt-1">Start logging on the Today tab</p>
        </div>
      ) : (
        <>
          {/* Week circles */}
          <WeekCircles entries={entries} />

          {/* Three stat cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { value: avgNet, label: "Avg Score", color: Number(avgNet) >= 0 ? "#1DB47A" : "#E5484D" },
              { value: `${habitRate}%`, label: "Habit Rate", color: "#1DB47A" },
              { value: totalEntries, label: "Days Logged", color: "#888888" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3 text-center"
                style={{ background: "#141414", border: "1px solid #1e1e1e" }}
              >
                <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Energy breakdown */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">30-Day Energy</p>
            {[
              { label: "Creation", value: totalCreation, color: "#1DB47A" },
              { label: "Reflection", value: totalReflection, color: "#1DB47A" },
              { label: "Consumption", value: totalConsumption, color: "#E5484D" },
            ].map((bar) => (
              <div key={bar.label} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary font-medium">{bar.label}</span>
                  <span className="font-bold" style={{ color: bar.color }}>{bar.value} pts</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e1e1e" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(bar.value / maxEnergy) * 100}%`, background: bar.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Insight card */}
          {insight && (
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: "#141414", border: "1px solid rgba(29,180,122,0.2)", boxShadow: "0 0 20px rgba(29,180,122,0.05)" }}
            >
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-2">💡 Insight</p>
              <p className="text-sm text-text leading-relaxed">{insight}</p>
            </div>
          )}

          {/* Habit performance */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">Habit Performance</p>
            <HabitPerformance entries={entries} />
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
