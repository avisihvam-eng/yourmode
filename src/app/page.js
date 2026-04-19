"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getEntry, upsertEntry } from "@/lib/entries";
import ArcRing from "@/app/components/ArcRing";
import MetricBars from "@/app/components/MetricBars";
import HabitGrid from "@/app/components/HabitGrid";

import BottomNav from "@/app/components/BottomNav";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function TodayPage() {
  const [userId, setUserId] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);
  const [userName, setUserName] = useState("");

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
        setSessionUser(session.user);
        setUserId(session.user.id);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        setUserName(name ? name.split(" ")[0] : "");
      } else {
        setSessionUser(null);
        setUserName("");
        let guestId = localStorage.getItem("mode_guest_id");
        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("mode_guest_id", guestId);
        }
        setUserId(guestId);
      }
      setAuthLoading(false);
    }
    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => handleSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Load
  useEffect(() => {
    if (!userId) return;
    setDataLoaded(false);
    getEntry(userId, selectedDate).then((entry) => {
      if (entry) {
        setHabits(entry.habits || {});
        setCreation(entry.creation || 0);
        setReflection(entry.reflection || 0);
        setConsumption(entry.consumption || 0);
      } else {
        setHabits({}); setCreation(0); setReflection(0); setConsumption(0);
      }
      setDataLoaded(true);
    });
  }, [userId, selectedDate]);

  // Save
  const save = useCallback((h, c, r, co, date) => {
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      upsertEntry(userId, date, { habits: h, creation: c, reflection: r, consumption: co });
    }, 500);
  }, [userId]);

  function toggleHabit(key) {
    const next = { ...habits, [key]: !habits[key] };
    setHabits(next);
    save(next, creation, reflection, consumption, selectedDate);
  }
  function updateCreation(v) { setCreation(v); save(habits, v, reflection, consumption, selectedDate); }
  function updateReflection(v) { setReflection(v); save(habits, creation, v, consumption, selectedDate); }
  function updateConsumption(v) { setConsumption(v); save(habits, creation, reflection, v, selectedDate); }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("mode_guest_id");
    window.location.reload();
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-border border-t-teal rounded-full animate-spin" style={{ borderTopColor: "#1DB47A" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <span className="text-white font-bold text-xl tracking-tight">Mode</span>
        {sessionUser ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">Hi, {userName} 👋</span>
            <button onClick={handleLogout} className="text-xs text-text-tertiary hover:text-white transition-colors">Sign out</button>
          </div>
        ) : (
          <button
            onClick={handleGoogle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "white", color: "#0a0a0a" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in
          </button>
        )}
      </div>

      {/* Date */}
      <div className="flex items-center justify-center gap-3 px-4 pt-1 pb-4">
        <input
          type="date"
          value={selectedDate}
          max={getToday()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-xs text-text-tertiary bg-transparent outline-none cursor-pointer"
          style={{ colorScheme: "dark" }}
        />
      </div>

      {/* Arc Ring Hero */}
      {dataLoaded && (
        <div className="flex flex-col items-center px-4">
          <ArcRing score={net} />
          <MetricBars
            creation={creation} reflection={reflection} consumption={consumption}
            onCreation={updateCreation} onReflection={updateReflection} onConsumption={updateConsumption}
          />
        </div>
      )}

      {/* Separator */}
      <div className="mx-4 mt-6 mb-4" style={{ height: "1px", background: "#1e1e1e" }} />

      {/* Habits */}
      {dataLoaded && (
        <div className="px-4">
          <HabitGrid habits={habits} onToggle={toggleHabit} />
        </div>
      )}



      <BottomNav />
    </div>
  );
}
