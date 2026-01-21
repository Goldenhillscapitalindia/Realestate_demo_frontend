import React from "react";
import type { HealthIndicator } from "../types";
import { Gauge } from "./common";

type HealthIndicatorsSectionProps = {
  indicators: HealthIndicator[];
};

const HealthIndicatorsSection: React.FC<HealthIndicatorsSectionProps> = ({ indicators }) => (
  <div
    className="rounded-2xl border border-slate-200 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
    style={{
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.98) 100%)",
    }}
  >
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl font-bold text-slate-900">Market Health Indicators</h3>
      <span className="text-s font-semibold text-red-400">
        Click score to view explanation
      </span>
    </div>
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {indicators.map((indicator) => (
        <Gauge key={indicator.label} indicator={indicator} />
      ))}
    </div>
  </div>
);

export default HealthIndicatorsSection;
