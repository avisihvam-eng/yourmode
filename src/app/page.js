"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/today");
        return;
      }
      const guestId = localStorage.getItem("mode_guest_id");
      if (guestId) {
        router.replace("/today");
        return;
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/today`,
      },
    });
    if (error) console.error("OAuth error:", error);
  }

  function handleGuest() {
    const id = crypto.randomUUID();
    localStorage.setItem("mode_guest_id", id);
    router.push("/today");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh]">
      {/* Title */}
      <h1 className="text-2xl font-bold text-text mb-10 tracking-tight text-center">
        How to avoid brainrot 101
      </h1>

      {/* Equation */}
      <div className="w-full border border-border rounded-lg px-5 py-5 mb-4">
        <p className="text-center text-lg font-semibold text-white mb-6 tracking-wide">
          (Creation + Reflection) {">"} Consumption
        </p>

        <div className="space-y-4 text-sm">
          <div>
            <span className="text-white font-medium">Creation</span>
            <p className="text-text-secondary mt-0.5">
              You made or shipped something today.
            </p>
          </div>
          <div>
            <span className="text-white font-medium">Reflection</span>
            <p className="text-text-secondary mt-0.5">
              You paused and thought.
            </p>
          </div>
          <div>
            <span className="text-white font-medium">Consumption</span>
            <p className="text-text-secondary mt-0.5">
              Scrolling, watching, drifting.
            </p>
          </div>
        </div>
      </div>

      {/* Systems > motivation */}
      <p className="text-sm text-text-tertiary mb-10 text-center">
        Systems {">"} motivation.
      </p>

      {/* Buttons */}
      <div className="w-full space-y-3 mb-6">
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-white text-bg text-sm font-semibold"
        >
          Start tracking today
        </button>

        <button
          onClick={handleGuest}
          className="w-full px-4 py-3.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover"
        >
          Try as guest
        </button>
      </div>

      {/* Footer note */}
      <p className="text-xs text-text-tertiary text-center">
        Takes 30 seconds a day
      </p>
    </div>
  );
}
