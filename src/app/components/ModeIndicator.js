"use client";

export default function ModeIndicator({ creation, reflection, consumption }) {
  const net = creation + reflection - consumption;
  let mode;

  if (consumption > creation + reflection) {
    mode = "Consumption mode";
  } else if (net > 0) {
    mode = "Builder mode";
  } else {
    mode = "Neutral";
  }

  return (
    <div className="w-full rounded-lg border border-border py-4 text-center font-bold text-lg text-white">
      {mode}
    </div>
  );
}
