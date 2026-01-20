import React from "react";
import type { MarketRadarViewData } from "../types";
import { MetricCard, NarrativeCard, SectionHeading } from "./common";

type CapitalMarketsSectionProps = {
  data: MarketRadarViewData["capitalMarkets"];
};

const CapitalMarketsSection: React.FC<CapitalMarketsSectionProps> = ({ data }) => (
  <div className="space-y-4">
    <SectionHeading label="Capital Markets Health" accent="text-cyan-300" icon="O" />
    <div
      className="rounded-2xl border border-white/10 p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <MetricCard label="Cap Rate" value={data.capRate} />
        <MetricCard label="Spread vs Metro" value={data.spread} />
        <MetricCard label="12M Sales Volume" value={data.salesVolume} />
        <MetricCard label="5-Yr Avg Volume" value={data.fiveYearAvgVolume} />
        <MetricCard label="Price / Unit" value={data.pricePerUnit} />
        <MetricCard label="% Leased at Sale" value={data.leasedAtSale} />
      </div>
      <NarrativeCard text={data.narrative} />
    </div>
  </div>
);

export default CapitalMarketsSection;
