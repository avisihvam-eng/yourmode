"use client";

export default function NetScore({ net, creation, reflection, consumption }) {
  const sign = net > 0 ? "+" : "";

  return (
    <div className="text-center py-4 mb-4">
      <span className="text-4xl font-bold text-white tabular-nums">
        {sign}{net}
      </span>
      <p className="text-xs text-text-tertiary mt-1">net score</p>
      <p className="text-[10px] bg-bg font-mono text-text-tertiary/70 mt-1.5 px-2 py-0.5 border border-border inline-block rounded-md tracking-widest">
        ({creation} + {reflection}) - {consumption}
      </p>
    </div>
  );
}
