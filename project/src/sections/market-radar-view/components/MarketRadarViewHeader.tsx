import React from "react";

type MarketRadarViewHeaderProps = {
  sub_market_name: string;
  region: string;
  pulseLabel: string;
  pulseDot: string;
  onBack: () => void;
};

const MarketRadarViewHeader: React.FC<MarketRadarViewHeaderProps> = ({
  sub_market_name,
  region,
  pulseLabel,
  pulseDot,
  onBack,
}) => (
  <div
    className="rounded-2xl border border-blue-200 px-6 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] bg-indigo-100"

  >
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-black">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500 text-purple-500 transition hover:border-slate-300 hover:text-black"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-black">{sub_market_name}</h2>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{
                backgroundColor: "rgba(248, 250, 252, 0.9)",
                border: `1px solid ${pulseDot}`,
                color: pulseDot,
              }}
            >
              {pulseLabel}
            </span>
          </div>
          <p className="text-sm text-black">{region}</p>
        </div>
      </div>
      <div
        className="rounded-full px-4 py-1 text-sm font-semibold text-violet-600"
        style={{
          backgroundColor: "rgba(124, 58, 237, 0.1)",
          border: "1px solid rgba(124, 58, 237, 0.35)",
        }}
      >
        AI-Powered
      </div>
    </div>
  </div>
);

export default MarketRadarViewHeader;
