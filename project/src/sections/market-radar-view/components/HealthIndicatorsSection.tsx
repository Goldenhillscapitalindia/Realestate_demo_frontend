import React from "react";
import type { HealthIndicator } from "../types";
import { Gauge } from "./common";

type HealthIndicatorsSectionProps = {
  indicators: HealthIndicator[];
};

const HealthIndicatorsSection: React.FC<HealthIndicatorsSectionProps> = ({ indicators }) => (
  <div
    className="rounded-2xl border border-white/10 p-6"
    style={{
      background:
        "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
    }}
  >
    <h3 className="text-m font-bold text-white">Market Health Indicators</h3>
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {indicators.map((indicator) => (
        <Gauge key={indicator.label} indicator={indicator} />
      ))}
    </div>
  </div>
);

export default HealthIndicatorsSection;
