import React from "react";
import { PULSE_COLORS } from "./constants";
import { Sparkles } from "lucide-react";

type MarketRadarHighlightsProps = {
  pulseCounts: Record<string, number>;
};

const MarketRadarHighlights: React.FC<MarketRadarHighlightsProps> = ({ pulseCounts }) => (
  <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
    <div
      className="rounded-2xl border border-slate-200 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,247,255,0.98) 100%)",
      }}
    >
      <div className="flex items-center gap-2">
    <Sparkles size={16} className="mr-2 inline-block text-violet-500" />
        <h3 className="text-base font-semibold text-slate-900">AI Market Pulse</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        AI detects shifts in absorption efficiency and pricing pressure across key sub_market_names.
        Track improving momentum and areas under stress in near real time.
      </p>
    </div>
    <div
      className="rounded-2xl border border-slate-200 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,247,255,0.98) 100%)",
      }}
    >
      <p className="text-s text-black">Market Pulse</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
        {Object.keys(PULSE_COLORS).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: PULSE_COLORS[key].dot,
                boxShadow: `0 0 10px ${PULSE_COLORS[key].glow}`,
              }}
            />
            <span className="flex-1">{PULSE_COLORS[key].label}</span>
            <span className="text-slate-500">{pulseCounts[key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MarketRadarHighlights;
