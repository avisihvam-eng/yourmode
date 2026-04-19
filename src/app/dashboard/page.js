"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getEntries } from "@/lib/entries";
import NavBar from "@/app/components/NavBar";
import WeeklyTargets from "@/app/components/WeeklyTargets";
import NetTrend from "@/app/components/NetTrend";
import ConsistencyGrid from "@/app/components/ConsistencyGrid";
import HabitPerformance from "@/app/components/HabitPerformance";
import Totals from "@/app/components/Totals";

export default function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    function handleSession(session) {
      let uid = null;
      if (session) {
        uid = session.user.id;
      } else {
        uid = localStorage.getItem("mode_guest_id");
      }

      if (uid) {
        getEntries(uid, 30).then((data) => {
          setEntries(data);
          setLoaded(true);
        });
      } else {
        setLoaded(true);
      }
      setAuthLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <NavBar />

      {!loaded ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-text-secondary text-sm font-medium">No data yet</p>
          <p className="text-text-tertiary text-xs mt-1">
            Start logging on the Today tab to see your dashboard
          </p>
        </div>
      ) : (
        <>
          <Totals entries={entries} />
          <WeeklyTargets entries={entries} />
          <NetTrend entries={entries} />
          <ConsistencyGrid entries={entries} />
          <HabitPerformance entries={entries} />
        </>
      )}
    </>
  );
}
