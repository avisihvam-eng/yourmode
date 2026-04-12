"use client";

export default function Totals({ entries }) {
  const totalEntries = entries.length;

  const last7 = entries.slice(-7);
  const weeklyAvg =
    last7.length > 0
      ? (last7.reduce((sum, e) => sum + e.net, 0) / last7.length).toFixed(1)
      : "—";

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-text mb-3">Totals</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">{totalEntries}</p>
          <p className="text-xs text-text-tertiary">Total entries</p>
        </div>
        <div className="border border-border rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">{weeklyAvg}</p>
          <p className="text-xs text-text-tertiary">Weekly avg net</p>
        </div>
      </div>
    </div>
  );
}
