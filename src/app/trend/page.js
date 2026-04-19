"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getEntries } from "@/lib/entries";
import BottomNav from "@/app/components/BottomNav";
import StreakCounter from "@/app/components/StreakCounter";
import WeeklyTargets from "@/app/components/WeeklyTargets";
import NetTrend from "@/app/components/NetTrend";
import ConsistencyGrid from "@/app/components/ConsistencyGrid";

export default function TrendPage() {
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

  return (
    <div className="flex flex-col min-h-screen pb-28 px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Trend</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Your cognitive history</p>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-bg-elevated rounded-full animate-spin" style={{ borderTopColor: "#1DB47A" }} />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl mb-3">📊</p>
          <p className="text-text-secondary font-semibold">No data yet</p>
          <p className="text-text-tertiary text-sm mt-1">Start logging on the Today tab</p>
        </div>
      ) : (
        <>
          <StreakCounter entries={entries} />

          {/* 7-day chart */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">7-Day Net Score</p>
            <NetTrend entries={entries} />
          </div>

          {/* Consistency */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">28-Day Consistency</p>
            <ConsistencyGrid entries={entries} />
          </div>

          {/* Weekly targets */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">Weekly Targets</p>
            <WeeklyTargets entries={entries} />
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
