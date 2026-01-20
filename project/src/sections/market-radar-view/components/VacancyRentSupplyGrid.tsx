import React from "react";
import type { MarketRadarViewData } from "../types";
import { MetricCard, NarrativeCard, SectionHeading } from "./common";
import SupplyDemandCard from "./SupplyDemandCard";

type VacancyRentSupplyGridProps = {
  supplyDemand: MarketRadarViewData["supplyDemand"];
  vacancy: MarketRadarViewData["vacancyDynamics"];
  rent: MarketRadarViewData["rentPerformance"];
  supply: MarketRadarViewData["supplyPipeline"];
};

const VacancyRentSupplyGrid: React.FC<VacancyRentSupplyGridProps> = ({
  supplyDemand,
  vacancy,
  rent,
  supply,
}) => (
  <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-2">
      <SupplyDemandCard ratio={supplyDemand.ratio} insight={supplyDemand.insight} />
      <div className="space-y-4">
        <SectionHeading label="Vacancy Dynamics" accent="text-cyan-300" icon="[]" />
        <div
          className="rounded-2xl border border-white/10 p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Current Vacancy" value={vacancy.currentVacancy} />
            <MetricCard label="YoY Change" value={vacancy.yoyChange} isDelta />
          </div>
          <NarrativeCard text={vacancy.narrative} />
        </div>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <SectionHeading label="Rent Performance" accent="text-green-300" icon="$" />
        <div
          className="rounded-2xl border border-white/10 p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Avg Asking" value={rent.avgAsking} />
            <MetricCard label="Growth YoY" value={rent.growthYoy} isDelta />
            <MetricCard label="5-Yr Avg" value={rent.fiveYearAvg} />
          </div>
          <NarrativeCard text={rent.narrative} />
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading label="Supply Pipeline Risk" accent="text-cyan-200" icon="^" />
        <div
          className="rounded-2xl border border-white/10 p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="grid gap-3 sm:grid-cols-1">
            <MetricCard label="Under Construction / Inventory" value={supply.underConstruction} />
          </div>
          <NarrativeCard text={supply.narrative} />
        </div>
      </div>
    </div>
  </div>
);

export default VacancyRentSupplyGrid;
