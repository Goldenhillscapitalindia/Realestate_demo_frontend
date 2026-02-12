// src/components/deal/S1DealSnapshot.tsx
import React from "react";

const blank = "—";
const ord = (d: number) => {
  const s = ["th", "st", "nd", "rd"], v = d % 100;
  return d + (s[(v - 20) % 10] || s[v] || s[0]);
};
const dateFmt = (iso?: string | null) => {
  if (!iso) return blank;
  const d = new Date(iso);
  if (Number.isNaN(+d)) return blank;
  return `${ord(d.getDate())} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
};

type Props = {
  dates: { filed?: string | null; range?: string | null; pricing?: string | null; firstTrade?: string | null };
  snapshot: {
    sector: string; priceRange: string; bookrunners: string;
    dealSizeMM: string; sharesOffered: string; nosh: string; established: string;
  };
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between px-3 py-2 even:bg-slate-50 rounded-md">
    <span className="font-medium text-black">{label}</span>
    <span className="text-black">{value}</span>
  </div>
);

const S1DealSnapshot: React.FC<Props> = ({ dates, snapshot }) => {
  const timeline = [
    { k: "Filed", v: dates.filed },
    { k: "Pricing Range", v: dates.range },
    { k: "Pricing", v: dates.pricing },
    { k: "First Trade", v: dates.firstTrade },
  ];
  const completedCount = timeline.filter(t => !!t.v).length;

  return (
    <section className="space-y-10">
      {/* TIMELINE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h2 className="text-base font-semibold text-black mb-6 flex items-center">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-2"></span>
          Timeline
        </h2>

        <div className="relative flex justify-between items-center">
          {/* Connector line */}
          <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-slate-200 -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-[3px] bg-blue-600 -translate-y-1/2 transition-all"
            style={{ width: `${(completedCount - 1) / (timeline.length - 1) * 100}%` }}
          />

          {timeline.map((n, i) => {
            const isCompleted = !!n.v;
            return (
              <div key={i} className="relative flex flex-col items-center w-1/4 text-center">
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full font-semibold text-xs shadow-md z-10
                    ${isCompleted ? "bg-blue-600 text-white" : "bg-slate-200 text-black"}`}
                >
                  {i + 1}
                </div>
                <div className="mt-2 text-sm font-medium text-black">{n.k}</div>
                <div className="text-xs text-black">{dateFmt(n.v)}</div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-black text-center">
          Dates shown in company/local filing context; check EDGAR for official timestamps.
        </p>
      </div>

      {/* DEAL SNAPSHOT */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h2 className="text-base font-semibold text-black mb-6 flex items-center">
          <span className="w-1.5 h-5 bg-indigo-600 rounded-full mr-2"></span>
          Deal Snapshot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-2">
            {/* Sector + Bookrunners in one line */}
            <div className="flex justify-between px-3 py-2 bg-slate-50 rounded-md">
              <span className="font-medium text-black">Sector</span>
              <span className="text-black">{snapshot.sector}</span>
            </div>
            <div className="flex justify-between px-3 py-2 bg-slate-50 rounded-md">
              <span className="font-medium text-black">Bookrunners</span>
              <span className="text-black">{snapshot.bookrunners}</span>
            </div>
            <InfoRow label="Price Range" value={snapshot.priceRange} />
            <InfoRow label="Deal Size ($MM)" value={snapshot.dealSizeMM} />
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <InfoRow label="Shares Offered" value={snapshot.sharesOffered} />
            <InfoRow label="No. of Shares Outstanding" value={snapshot.nosh} />
            <InfoRow label="Established" value={snapshot.established} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default S1DealSnapshot;
