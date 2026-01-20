import React from "react";
import { PULSE_COLORS } from "./constants";

type MarketRadarHighlightsProps = {
  pulseCounts: Record<string, number>;
};

const MarketRadarHighlights: React.FC<MarketRadarHighlightsProps> = ({ pulseCounts }) => (
  <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
    <div
      className="rounded-2xl border border-white/10 p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-cyan-300">*</span>
        <h3 className="text-base font-semibold text-cyan-200">AI Market Pulse</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        AI detects shifts in absorption efficiency and pricing pressure across key submarkets.
        Track improving momentum and areas under stress in near real time.
      </p>
    </div>
    <div
      className="rounded-2xl border border-white/10 p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
      }}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Pulse</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
        {Object.keys(PULSE_COLORS).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: PULSE_COLORS[key].dot,
                boxShadow: `0 0 12px ${PULSE_COLORS[key].glow}`,
              }}
            />
            <span className="flex-1">{PULSE_COLORS[key].label}</span>
            <span className="text-slate-400">{pulseCounts[key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MarketRadarHighlights;
