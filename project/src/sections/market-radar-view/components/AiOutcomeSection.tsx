import React from "react";
import type { MarketRadarViewData } from "../types";
import { OutcomeCard, OutcomeChart } from "./common";

type AiOutcomeSectionProps = {
  data: MarketRadarViewData["aiOutcome"];
};

const AiOutcomeSection: React.FC<AiOutcomeSectionProps> = ({ data }) => (
  <div
    className="rounded-2xl border border-white/10 p-6"
    style={{
      background:
        "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
    }}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-100">AI Expected Market Outcome</h3>
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: "rgba(46, 213, 115, 0.2)",
          border: "1px solid rgba(46, 213, 115, 0.4)",
          color: "#2ED573",
        }}
      >
        {data.confidence}
      </span>
    </div>

    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-center">
        <OutcomeChart />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <OutcomeCard title="Upside" color="#2ED573" data={data.upside} />
        <OutcomeCard title="Base" color="#21C7D9" data={data.base} />
        <OutcomeCard title="Downside" color="#FF5A4A" data={data.downside} />
      </div>
    </div>
  </div>
);

export default AiOutcomeSection;
