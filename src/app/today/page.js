"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getEntry, upsertEntry } from "@/lib/entries";
import NavToggle from "@/app/components/NavToggle";
import HabitGrid from "@/app/components/HabitGrid";
import EnergySlider from "@/app/components/EnergySlider";
import NetScore from "@/app/components/NetScore";
import ModeIndicator from "@/app/components/ModeIndicator";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function TodayPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [habits, setHabits] = useState({});
  const [creation, setCreation] = useState(0);
  const [reflection, setReflection] = useState(0);
  const [consumption, setConsumption] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  const net = creation + reflection - consumption;

  // Auth check
  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "User";
        setUserName(name.split(" ")[0]);
        return;
      }
      const guestId = localStorage.getItem("mode_guest_id");
      if (guestId) {
        setUserId(guestId);
        setUserName("Guest");
        return;
      }
      router.replace("/");
    }
    init();
  }, [router]);

  // Load selected date's entry
  useEffect(() => {
    if (!userId) return;
    async function load() {
      const entry = await getEntry(userId, selectedDate);
      if (entry) {
        setHabits(entry.habits || {});
        setCreation(entry.creation || 0);
        setReflection(entry.reflection || 0);
        setConsumption(entry.consumption || 0);
      } else {
        setHabits({});
        setCreation(0);
        setReflection(0);
        setConsumption(0);
      }
      setLoaded(true);
    }
    load();
  }, [userId, selectedDate]);

  // Debounced save
  const save = useCallback(
    (h, c, r, co, date) => {
      if (!userId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        upsertEntry(userId, date, {
          habits: h,
          creation: c,
          reflection: r,
          consumption: co,
        });
      }, 500);
    },
    [userId]
  );

  function toggleHabit(key) {
    const next = { ...habits, [key]: !habits[key] };
    setHabits(next);
    save(next, creation, reflection, consumption, selectedDate);
  }

  function updateCreation(v) {
    setCreation(v);
    save(habits, v, reflection, consumption, selectedDate);
  }
  function updateReflection(v) {
    setReflection(v);
    save(habits, creation, v, consumption, selectedDate);
  }
  function updateConsumption(v) {
    setConsumption(v);
    save(habits, creation, reflection, v, selectedDate);
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <NavToggle />

      <div className="flex flex-col items-center justify-center mb-8 mt-2 space-y-4">
        {userName && (
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Hi, {userName}
          </h2>
        )}
        <input
          type="date"
          value={selectedDate}
          max={getToday()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-bg border border-border rounded-lg px-4 py-2 text-sm text-text font-medium outline-none hover:border-border-hover focus:border-white transition-colors"
          style={{ colorScheme: "dark" }}
        />
      </div>

      <HabitGrid habits={habits} onToggle={toggleHabit} />

      <div className="border border-border rounded-lg px-4 py-4 mb-4">
        <EnergySlider
          label="Creation"
          description="You made or shipped something today."
          value={creation}
          onChange={updateCreation}
        />
        <EnergySlider
          label="Reflection"
          description="You paused and thought."
          value={reflection}
          onChange={updateReflection}
        />
        <EnergySlider
          label="Consumption"
          description="Scrolling, watching, drifting."
          value={consumption}
          onChange={updateConsumption}
        />
      </div>

      <NetScore net={net} />

      <ModeIndicator
        creation={creation}
        reflection={reflection}
        consumption={consumption}
      />
    </>
  );
}
