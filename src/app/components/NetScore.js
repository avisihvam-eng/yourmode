"use client";

export default function NetScore({ net }) {
  const sign = net > 0 ? "+" : "";

  return (
    <div className="text-center py-4 mb-4">
      <span className="text-4xl font-bold text-white tabular-nums">
        {sign}{net}
      </span>
      <p className="text-xs text-text-tertiary mt-1">net score</p>
    </div>
  );
}
