import React from "react";

type SupplyDemandCardProps = {
  ratio: number | string;
  insight: string;
};

const formatRatio = (ratio: number | string) => {
  if (typeof ratio === "number" && Number.isFinite(ratio)) {
    return ratio.toFixed(2);
  }
  if (typeof ratio === "string" && ratio.trim().length) {
    return ratio;
  }
  return "N/A";
};

const SupplyDemandCard: React.FC<SupplyDemandCardProps> = ({ ratio, insight }) => (
  <div
    className="rounded-2xl border border-slate-200 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
    style={{
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.98) 100%)",
    }}
  >
    <h3 className="text-m font-bold text-slate-900">Supply-Demand Balance</h3>
    <div className="mt-4 flex items-center justify-center">
      <div
        className="rounded-full px-5 py-2 text-sm font-semibold"
        style={{
          border: "1px solid rgba(46, 213, 115, 0.4)",
          color: "#2ED573",
          backgroundColor: "rgba(46, 213, 115, 0.1)",
        }}
      >
        Demand : Supply&nbsp;&nbsp;
        <span className="text-lg">{formatRatio(ratio)}</span>
      </div>
    </div>
    <div className="mt-4 rounded-xl border border-violet-300/50 bg-violet-50/60 px-4 py-3 text-sm text-slate-600">
      <span className="mr-2 text-violet-500">*</span>
      {insight}
    </div>
  </div>
);

export default SupplyDemandCard;
