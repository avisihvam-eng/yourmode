"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getEntries } from "@/lib/entries";
import NavToggle from "@/app/components/NavToggle";
import NetTrend from "@/app/components/NetTrend";
import ConsistencyGrid from "@/app/components/ConsistencyGrid";
import HabitPerformance from "@/app/components/HabitPerformance";
import Totals from "@/app/components/Totals";
import WeeklyTargets from "@/app/components/WeeklyTargets";

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      let uid = null;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        uid = session.user.id;
      } else {
        uid = localStorage.getItem("mode_guest_id");
      }
      if (!uid) {
        router.replace("/");
        return;
      }

      const data = await getEntries(uid, 30);
      setEntries(data);
      setLoaded(true);
    }
    init();
  }, [router]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-mode-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <NavToggle />
      <WeeklyTargets entries={entries} />
      <NetTrend entries={entries} />
      <ConsistencyGrid entries={entries} />
      <HabitPerformance entries={entries} />
      <Totals entries={entries} />
    </>
  );
}
