"use client";

export default function EnergySlider({ label, description, value, onChange, isRed = false }) {
  const color = isRed ? "#E5484D" : "#1DB47A";

  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-text">{label}</span>
        <span className="text-lg font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
      <p className="text-xs text-text-tertiary mb-2">{description}</p>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className={`w-full ${isRed ? "slider-red" : ""}`}
        style={{ "--val": `${(value / 10) * 100}%` }}
      />
      <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}
