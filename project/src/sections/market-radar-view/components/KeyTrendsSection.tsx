import React from "react";
import type { TrendCard } from "../types";
import { TrendCardBlock } from "./common";

type KeyTrendsSectionProps = {
  trends: TrendCard[];
};

const KeyTrendsSection: React.FC<KeyTrendsSectionProps> = ({ trends }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-slate-900">Key Trends</h3>
    <div className="grid gap-4 md:grid-cols-3">
      {trends.map((trend) => (
        <TrendCardBlock key={trend.label} trend={trend} />
      ))}
    </div>
  </div>
);

export default KeyTrendsSection;
