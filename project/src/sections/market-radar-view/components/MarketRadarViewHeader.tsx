import React from "react";

type MarketRadarViewHeaderProps = {
  submarket: string;
  region: string;
  pulseLabel: string;
  pulseDot: string;
  onBack: () => void;
};

const MarketRadarViewHeader: React.FC<MarketRadarViewHeaderProps> = ({
  submarket,
  region,
  pulseLabel,
  pulseDot,
  onBack,
}) => (
  <div
    className="rounded-2xl border border-white/10 px-6 py-4 shadow-[0_0_40px_rgba(0,140,255,0.15)]"
    style={{
      background:
        "linear-gradient(135deg, rgba(12,20,35,0.95) 0%, rgba(10,15,30,0.9) 100%)",
    }}
  >
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-white">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
        >
          {"<"}
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white font-bold">{submarket}</h2>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${pulseDot}`,
                color: pulseDot,
              }}
            >
              {pulseLabel}
            </span>
          </div>
          <p className="text-sm text-slate-400">{region}</p>
        </div>
      </div>
      <div
        className="rounded-full px-4 py-1 text-sm font-semibold text-cyan-100"
        style={{
          backgroundColor: "rgba(0, 193, 255, 0.15)",
          border: "1px solid rgba(0, 193, 255, 0.35)",
        }}
      >
        AI-Powered
      </div>
    </div>
  </div>
);

export default MarketRadarViewHeader;
