// src/components/deal/S1DealSummary.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import S1DealSnapshot from "./S1DealSnapshot";
import S1KeyNarratives from "./S1KeyNarratives";

export type S1DealData = Partial<{
  ticker_name: string; exchange: string; company_name: string;
  filed_date: string | null; pricing_range_date: string | null; pricing_date: string | null; first_trade_date: string | null;
  price_range: string | null; lower_bound: string | number | null; upper_bound: string | number | null;
  deal_size: number | string | null; industry: string | null; shares_offered: number | string | null;
  nosh: number | string | null; established_year: number | string | null; bookrunners: string | null;

  revenue_growth: string | null; profitability: string | null; leverage: string | null;
  management_quality: string | null; customer_mix: string | null; barriers_to_entry: string | null;
  proprietary_solution: string | null; near_term_catalyst: string | null; valuation_attractiveness: string | null;

  business_overview: string | null; key_highlights: string | null; strengths: string | null; concerns: string | null;
  principal_stockholders_preipo: string | null; key_management_personnel: string | null; use_of_proceeds: string | null;

  regulatory_environment_category?: string; customer_mix_category?: string; supplier_mix_category?: string;
  market_analysis_category?: string; tam_sam_penetration_category?: string; growth_catalysts_category?: string;
  secular_trends_category?: string; revenue_growth_profile_category?: string; margin_profile_category?: string;
  leverage_profile_category?: string; management_team_category?: string; sponsor_track_record_category?: string;
  esg_focus_category?: string; ma_opportunities_category?: string;
}>;

type Props = { data?: S1DealData; fetchUrl?: string };

// ---------- helpers ----------
const blank = "—";
const isNil = (v: any) => v == null || (typeof v === "string" && v.trim() === "");
const safe = (v: any) => (isNil(v) ? blank : String(v));
const num = (v: any) => {
  const n = typeof v === "string" ? Number(v.replace(/,/g, "")) : Number(v);
  return Number.isFinite(n) ? n : null;
};
const intFmt = (v: any) => {
  const n = num(v); return n == null ? blank : n.toLocaleString("en-US", { maximumFractionDigits: 0 });
};
const mmFmt = (v: any) => { const n = num(v); return n == null ? blank : n.toLocaleString("en-US", { maximumFractionDigits: 0 }); };
const ord = (d: number) => { const s = ["th","st","nd","rd"], v = d % 100; return d + (s[(v-20)%10] || s[v] || s[0]); };
const dateFmt = (iso?: string | null) => {
  if (!iso) return blank; const d = new Date(iso); if (Number.isNaN(+d)) return blank;
  return `${ord(d.getDate())} ${d.toLocaleString("en-US",{month:"short"})} ${d.getFullYear()}`;
};
export const bullets = (t?: string | null) =>
  (t || "").split(/\r?\n+/).map(s => s.trim()).filter(Boolean).map(s => s.replace(/^[-•–—]\s+/, "").replace(/^\d+\.\s+/, ""));
export const persons = (t?: string | null) =>
  bullets(t).map(line => { const m = line.match(/^([^:]+):\s*(.+)$/); return m ? { name: m[1], meta: m[2] } : { name: line, meta: "" }; });
export const catColor = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v.includes("green") || v === "g" || v.includes("positive")) return "#16a34a";
  if (v.includes("yellow") || v === "y" || v.includes("neutral")) return "#f59e0b";
  if (v.includes("red") || v === "r" || v.includes("negative")) return "#dc2626";
  return "#94a3b8";
};

const Pill = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur">
    {text}
  </span>
);

const SkeletonHero = () => (
  <div className="bg-gradient-to-b from-slate-900 to-slate-800">
    <div className="mx-auto max-w-[1600px] px-6 pt-16 pb-12">
      <div className="h-10 w-80 rounded bg-white/15 animate-pulse" />
      <div className="mt-3 h-6 w-56 rounded bg-white/10 animate-pulse" />
      <div className="mt-4 flex gap-2">
        {Array.from({length:4}).map((_,i)=><div key={i} className="h-6 w-24 rounded-full bg-white/10 animate-pulse" />)}
      </div>
    </div>
  </div>
);

// ---------- MAIN ----------
const S1DealSummary: React.FC<Props> = ({ data: initial, fetchUrl }) => {
  const [data, setData] = useState<S1DealData | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial && !!fetchUrl);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    const run = async () => {
      if (!fetchUrl) return;
      setLoading(true); setError("");
      try {
        const r = await axios.get(fetchUrl);
        const payload: S1DealData = r.data?.data ?? r.data ?? {};
        if (on) setData(payload);
      } catch (e: any) {
        if (on) setError(e?.response?.data?.detail || "Failed to load deal data.");
      } finally { if (on) setLoading(false); }
    };
    run(); return () => { on = false; };
  }, [fetchUrl]);

  if (error) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>
    </div>
  );

  const d = data ?? {};
  const priceRange = !isNil(d.price_range)
    ? String(d.price_range)
    : !isNil(d.lower_bound) || !isNil(d.upper_bound)
    ? `$${mmFmt(d.lower_bound)} - $${mmFmt(d.upper_bound)}`
    : blank;

  const pills = useMemo(() => {
    const arr: string[] = [];
    if (!isNil(d.exchange)) arr.push(String(d.exchange));
    if (!isNil(d.industry)) arr.push(String(d.industry!));
    if (!isNil(d.deal_size)) arr.push(`Deal ~$${mmFmt(d.deal_size)}M`);
    if (!isNil(d.pricing_date)) arr.push(`Pricing ${dateFmt(d.pricing_date)}`);
    return arr;
  }, [data]);

  return (
  <div className="min-h-[100dvh] bg-slate-50">
    {/* Decorative background gradient */}
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,#2563EB20,transparent),radial-gradient(1000px_500px_at_90%_10%,#22C55E20,transparent)]" />
    </div>

    {/* HERO */}
    {loading ? <SkeletonHero /> : (
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto w-[90%] max-w-[1800px] px-6 py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-sm uppercase tracking-wide text-white/70">
              IPO • SEC Filing Summary
            </div>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white">
              {safe(d.company_name)}{" "}
              <span className="text-white/50">({safe(d.ticker_name)})</span>
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {pills.map((p, i) => <Pill key={i} text={p} />)}
            </div>
          </div>

          <a
            href="https://www.sec.gov/edgar/search/#/category=custom&forms=S-1%2CF-1%2C424B"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20 backdrop-blur transition"
          >
            View on SEC EDGAR
          </a>
        </div>
      </div>
    )}

    {/* CONTENT */}
    <main className="mx-auto w-[90%] max-w-[1800px] -mt-10 space-y-10">
      <div className="rounded-2xl bg-white shadow p-6 md:p-8">
        <S1DealSnapshot
          dates={{
            filed: d.filed_date, range: d.pricing_range_date, pricing: d.pricing_date, firstTrade: d.first_trade_date
          }}
          snapshot={{
            sector: safe(d.industry), priceRange, bookrunners: safe(d.bookrunners),
            dealSizeMM: d.deal_size == null ? blank : `$${mmFmt(d.deal_size)}`,
            sharesOffered: intFmt(d.shares_offered), nosh: intFmt(d.nosh), established: safe(d.established_year),
          }}
        />
      </div>

      <div className="rounded-2xl bg-white shadow p-6 md:p-8">
        <S1KeyNarratives data={d} />
      </div>
    </main>
  </div>
);
};

export default S1DealSummary;
