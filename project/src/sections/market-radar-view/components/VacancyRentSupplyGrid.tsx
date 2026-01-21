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
        <div
          className="rounded-2xl border border-slate-200 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.98) 100%)",
          }}
        >
          <SectionHeading
            label="Vacancy Dynamics"
            accent="text-violet-500"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <MetricCard label="Current Vacancy" value={vacancy.currentVacancy} />
            <MetricCard label="YoY Change" value={vacancy.yoyChange} isDelta />
          </div>
          <NarrativeCard text={vacancy.narrative} />
        </div>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <SectionHeading
          label="Rent Performance"
          accent="text-emerald-500"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4v16M8 7.5c0-1.7 1.8-3 4-3s4 1.3 4 3-1.8 3-4 3-4 1.3-4 3 1.8 3 4 3 4-1.3 4-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <div
          className="rounded-2xl border border-slate-200 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.98) 100%)",
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
        <SectionHeading
          label="Supply Pipeline Risk"
          accent="text-cyan-500"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 14c3-4 6-4 9-2s6 2 7-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle cx="6" cy="14" r="1.5" fill="currentColor" />
              <circle cx="13" cy="12" r="1.5" fill="currentColor" />
            </svg>
          }
        />
        <div
          className="rounded-2xl border border-slate-200 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.98) 100%)",
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
