"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getEntry, upsertEntry } from "@/lib/entries";
import HabitGrid from "@/app/components/HabitGrid";
import EnergySlider from "@/app/components/EnergySlider";
import NetScore from "@/app/components/NetScore";
import ModeIndicator from "@/app/components/ModeIndicator";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  // Auth State
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [sessionUser, setSessionUser] = useState(null);

  // Tracker State
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [habits, setHabits] = useState({});
  const [creation, setCreation] = useState(0);
  const [reflection, setReflection] = useState(0);
  const [consumption, setConsumption] = useState(0);
  
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const saveTimer = useRef(null);

  const net = creation + reflection - consumption;

  // 1. Auth Check
  useEffect(() => {
    async function initAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session) {
        setSessionUser(session.user);
        setUserId(session.user.id);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        setUserName(name ? name.split(" ")[0] : "");
      } else {
        // Implicit Guest Flow
        let guestId = localStorage.getItem("mode_guest_id");
        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("mode_guest_id", guestId);
        }
        setUserId(guestId);
        setUserName("");
      }
      setAuthLoading(false);
    }
    initAuth();
  }, []);

  // 2. Load Data when userId or date changes
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

  // 3. Save Logic
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

  // Handlers
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

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-6 pb-20 px-4">
      
      {/* Header / Auth */}
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        {sessionUser ? (
          <>
            <span className="text-white font-medium tracking-tight">Hi, {userName || "Avinash"} 👋</span>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-text-tertiary hover:text-white transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <span className="text-text-tertiary text-sm font-medium">Guest Mode</span>
            <button
              onClick={handleGoogle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-bg text-xs font-bold transition-all hover:bg-gray-100 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in
            </button>
          </>
        )}
      </div>

      {/* Intro / Logic Explained */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">
          How to avoid brainrot 101
        </h1>
        <p className="text-sm font-semibold text-text mb-4 bg-bg-card border border-border inline-block px-4 py-2 rounded-lg">
          (Creation + Reflection) {">"} Consumption
        </p>

        <div className="grid grid-cols-1 gap-3 text-left bg-bg-card p-4 rounded-xl border border-border mt-3 text-sm">
          <div>
            <span className="text-white font-medium block">Creation</span>
            <span className="text-text-secondary text-xs">You made or shipped something today.</span>
          </div>
          <div>
            <span className="text-white font-medium block">Reflection</span>
            <span className="text-text-secondary text-xs">You paused and thought.</span>
          </div>
          <div>
            <span className="text-white font-medium block">Consumption</span>
            <span className="text-text-secondary text-xs">Scrolling, watching, drifting.</span>
          </div>
        </div>
      </div>

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
          {/* Habits */}
          <HabitGrid habits={habits} onToggle={toggleHabit} />

          {/* Sliders */}
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

    </div>
  );
}
