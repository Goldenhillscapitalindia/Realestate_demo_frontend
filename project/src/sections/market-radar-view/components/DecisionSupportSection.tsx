import React from "react";
import type { MarketRadarViewData } from "../types";
import { DecisionCard } from "./common";

type DecisionSupportSectionProps = {
  data: MarketRadarViewData["decisionSupport"];
};

const DecisionSupportSection: React.FC<DecisionSupportSectionProps> = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold text-slate-100">Decision Support</h3>
    <div className="grid gap-4 lg:grid-cols-3">
      <DecisionCard title="Positives" color="#2ED573" items={data.positives} />
      <DecisionCard title="Negatives" color="#FF5A4A" items={data.negatives} />
      <DecisionCard title="What to Watch" color="#F4B740" items={data.watch} />
    </div>
  </div>
);

export default DecisionSupportSection;
