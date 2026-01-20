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
    className="rounded-2xl border border-white/10 p-5"
    style={{
      background:
        "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
    }}
  >
    <h3 className="text-m font-bold text-white">Supply-Demand Balance</h3>
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
    <div className="mt-4 rounded-xl border border-cyan-400/40 bg-[#0B1220] px-4 py-3 text-sm text-slate-300">
      <span className="mr-2 text-cyan-300">*</span>
      {insight}
    </div>
  </div>
);

export default SupplyDemandCard;
