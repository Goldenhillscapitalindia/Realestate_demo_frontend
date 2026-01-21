import React from "react";

const MarketRadarHeader: React.FC = () => (
  <div
    className="rounded-2xl border border-slate-200 px-6 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    style={{
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(244,247,255,0.98) 100%)",
    }}
  >
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-slate-900">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(167,139,250,0.25) 0%, rgba(59,130,246,0.15) 100%)",
            border: "1px solid rgba(124, 58, 237, 0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4C8.1 4 5 7.1 5 11c0 3.9 3.1 7 7 7"
              stroke="#7C3AED"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4"
              stroke="#38BDF8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="1.5" fill="#6366F1" />
          </svg>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Market Signal Radar</p>
          <h2 className="text-xl font-semibold text-slate-900">Market Signal Radar</h2>
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

export default MarketRadarHeader;
