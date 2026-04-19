"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getEntry, upsertEntry } from "@/lib/entries";
import NavBar from "@/app/components/NavBar";
import HabitGrid from "@/app/components/HabitGrid";
import EnergySlider from "@/app/components/EnergySlider";
import NetScore from "@/app/components/NetScore";
import ModeIndicator from "@/app/components/ModeIndicator";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [habits, setHabits] = useState({});
  const [creation, setCreation] = useState(0);
  const [reflection, setReflection] = useState(0);
  const [consumption, setConsumption] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const saveTimer = useRef(null);

  const net = creation + reflection - consumption;

  // Auth
  useEffect(() => {
    function handleSession(session) {
      if (session) {
        setUserId(session.user.id);
      } else {
        let guestId = localStorage.getItem("mode_guest_id");
        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("mode_guest_id", guestId);
        }
        setUserId(guestId);
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

  // Load data
  useEffect(() => {
    if (!userId) return;
    async function load() {
      setDataLoaded(false);
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
      setDataLoaded(true);
    }
    load();
  }, [userId, selectedDate]);

  // Save
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

      {/* Tagline */}
      <p className="text-sm font-semibold text-text mb-6 bg-bg-card border border-border inline-block px-4 py-2 rounded-lg">
        (Creation + Reflection) {">"} Consumption
      </p>

      {/* Date Picker */}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={selectedDate}
          max={getToday()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-bg border border-border rounded-lg px-4 py-2 text-sm text-text font-medium outline-none hover:border-border-hover focus:border-white transition-colors"
          style={{ colorScheme: "dark" }}
        />
      </div>

      {!dataLoaded ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <HabitGrid habits={habits} onToggle={toggleHabit} />

          <div className="border border-border rounded-lg px-4 py-4 mb-4 bg-bg-card">
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

          <NetScore
            net={net}
            creation={creation}
            reflection={reflection}
            consumption={consumption}
          />

          <ModeIndicator
            creation={creation}
            reflection={reflection}
            consumption={consumption}
          />
        </>
      )}
    </>
  );
}
