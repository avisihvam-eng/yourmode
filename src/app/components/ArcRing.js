"use client";

import { useEffect, useRef } from "react";

// Score range: -20 to +20, mapped to 0–100% arc fill
function scoreToPercent(score) {
  const clamped = Math.max(-20, Math.min(20, score));
  return ((clamped + 20) / 40) * 100;
}

function getColor(score) {
  if (score >= 3) return "#1DB47A";
  if (score <= -3) return "#E5484D";
  return "#F5A623";
}

function getGlow(score) {
  if (score >= 3) return "rgba(29, 180, 122, 0.25)";
  if (score <= -3) return "rgba(229, 72, 77, 0.25)";
  return "rgba(245, 166, 35, 0.25)";
}

function getLabel(score) {
  if (score >= 3) return "🔥 Builder Mode";
  if (score <= -3) return "⚠️ Drift Mode";
  return "⚖️ Balanced";
}

export default function ArcRing({ score = 0, animated = true }) {
  const color = getColor(score);
  const glow = getGlow(score);
  const label = getLabel(score);
  const pct = scoreToPercent(score);
  const sign = score > 0 ? "+" : "";

  // SVG arc math
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 88;
  const strokeWidth = 14;
  const gap = 60; // degrees open at bottom
  const startAngle = 90 + gap / 2;
  const endAngle = 90 - gap / 2 + 360;
  const totalAngle = 360 - gap;
  const circumference = (totalAngle / 360) * 2 * Math.PI * r;

  function polarToCartesian(angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(startDeg, endDeg) {
    const start = polarToCartesian(startDeg);
    const end = polarToCartesian(endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const trackEnd = startAngle + totalAngle;
  const fillEnd = startAngle + (totalAngle * pct) / 100;

  const arcRef = useRef(null);

  useEffect(() => {
    if (!arcRef.current || !animated) return;
    arcRef.current.style.strokeDashoffset = circumference.toString();
    const target = circumference - (circumference * pct) / 100;
    const timeout = setTimeout(() => {
      if (arcRef.current) {
        arcRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)";
        arcRef.current.style.strokeDashoffset = target.toString();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [score, pct, circumference, animated]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ filter: `drop-shadow(0 0 24px ${glow})` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track (background arc) */}
          <path
            d={describeArc(startAngle, trackEnd)}
            fill="none"
            stroke="#1e1e1e"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill arc (animated) */}
          <path
            ref={arcRef}
            d={describeArc(startAngle, trackEnd)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * pct) / 100}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: "24px" }}>
          <span className="text-5xl font-bold text-white tabular-nums tracking-tight">
            {sign}{score}
          </span>
          <span className="text-xs text-text-tertiary mt-1 font-medium tracking-widest uppercase">
            Mode Score
          </span>
        </div>
      </div>

      {/* State badge */}
      <span
        className="text-sm font-semibold px-4 py-1.5 rounded-full -mt-3"
        style={{
          background: `${color}22`,
          color: color,
          border: `1px solid ${color}44`,
        }}
      >
        {label}
      </span>
    </div>
  );
}
