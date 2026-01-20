import React from "react";

const MarketRadarHeader: React.FC = () => (
  <div
    className="rounded-2xl border border-white/10 px-6 py-4 shadow-[0_0_40px_rgba(0,140,255,0.15)]"
    style={{
      background:
        "linear-gradient(135deg, rgba(12,20,35,0.95) 0%, rgba(10,15,30,0.9) 100%)",
    }}
  >
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(27, 202, 234, 0.15)" }}
        >
          <span style={{ color: "#20C7D9" }}>O</span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Market Signal Radar</p>
          <h2 className="text-xl font-semibold text-slate-100">Market Signal Radar</h2>
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

export default MarketRadarHeader;
