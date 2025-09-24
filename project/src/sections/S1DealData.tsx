// src/components/S1DealSummary.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type S1DealData = Partial<{
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
const bullets = (t?: string | null) =>
  (t || "").split(/\r?\n+/).map(s => s.trim()).filter(Boolean).map(s => s.replace(/^[-•–—]\s+/, "").replace(/^\d+\.\s+/, ""));
const persons = (t?: string | null) =>
  bullets(t).map(line => { const m = line.match(/^([^:]+):\s*(.+)$/); return m ? { name: m[1], meta: m[2] } : { name: line, meta: "" }; });

const Dot = ({ c }: { c: string }) => (
  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
);
const catColor = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v.includes("green") || v === "g" || v === "positive") return "#16a34a";
  if (v.includes("yellow") || v === "y" || v === "neutral") return "#f59e0b";
  if (v.includes("red") || v === "r" || v === "negative") return "#dc2626";
  return "#9ca3af";
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
    {children}
  </section>
);

/** ------------------- MAIN ------------------- */
const S1DealSummary: React.FC<Props> = ({ data: init, fetchUrl }) => {
  const [data, setData] = useState<S1DealData | null>(init ?? null);
  const [loading, setLoading] = useState(!init && !!fetchUrl);
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

  if (loading)
    return (
      <div className="min-h-[80vh] bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="mx-auto max-w-[1600px] px-6 pt-14 pb-10 animate-pulse">
          <div className="h-9 w-96 rounded bg-white/20" />
          <div className="mt-4 h-6 w-64 rounded bg-white/10" />
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      </div>
    );

  const d = data ?? {};
  const priceRange =
    !isNil(d.price_range)
      ? String(d.price_range)
      : !isNil(d.lower_bound) || !isNil(d.upper_bound)
      ? `$${mmFmt(d.lower_bound)} - $${mmFmt(d.upper_bound)}`
      : blank;

  const pills = useMemo(() => {
    const arr: string[] = [];
    if (!isNil(d.exchange)) arr.push(String(d.exchange));
    if (!isNil(d.industry)) arr.push(String(d.industry));
    if (!isNil(d.deal_size)) arr.push(`Deal Size ~$${mmFmt(d.deal_size)}M`);
    return arr;
  }, [data]);

  const metricsRows = [
    { crit: "Regulatory Environment", cat: d.regulatory_environment_category, note: d.barriers_to_entry },
    { crit: "Customer Mix", cat: d.customer_mix_category, note: d.customer_mix },
    { crit: "Supplier Mix", cat: d.supplier_mix_category, note: d.proprietary_solution },
    { crit: "TAM/SAM & Penetration", cat: d.tam_sam_penetration_category, note: d.market_analysis_category ? null : null },
    { crit: "Near-Term Catalysts", cat: d.growth_catalysts_category, note: d.near_term_catalyst },
    { crit: "Secular Tailwinds/Headwinds", cat: d.secular_trends_category, note: d.valuation_attractiveness },
    { crit: "Revenue Growth Profile", cat: d.revenue_growth_profile_category, note: d.revenue_growth },
    { crit: "Margin Profile", cat: d.margin_profile_category, note: d.profitability },
    { crit: "Leverage Profile", cat: d.leverage_profile_category, note: d.leverage },
    { crit: "Management Team/Bench", cat: d.management_team_category, note: d.management_quality },
    { crit: "Sponsor Track Record", cat: d.sponsor_track_record_category, note: null },
    { crit: "ESG Focus", cat: d.esg_focus_category, note: null },
    { crit: "M&A Opportunities", cat: d.ma_opportunities_category, note: null },
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,#2563EB20,transparent),radial-gradient(1000px_500px_at_90%_10%,#22C55E20,transparent)]" />
        <div className="bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="mx-auto max-w-[1600px] px-6 pt-14 pb-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs text-white/70">IPO • SEC Filing Summary</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-white">
                  {safe(d.company_name)} <span className="text-white/50">({safe(d.ticker_name)})</span>
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pills.map((p, i) => (
                    <span key={i} className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="https://www.sec.gov/edgar/search/#/category=custom&forms=S-1%2CF-1%2C424B"
                target="_blank" rel="noreferrer"
                className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 backdrop-blur"
              >
                Open on SEC EDGAR
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="mx-auto max-w-[1600px] px-6 -mt-8 pb-16">
        {/* --- CARD 1: TIMELINE (exact style) --- */}
        <Section title="">
          <div className="rounded-2xl bg-[#EEF4FF] p-6 shadow-inner">
            <div className="relative mx-auto w-full">
              <div className="flex justify-between text-sm font-semibold text-[#0B1B5E]">
                <span>Filed Date</span><span>Pricing Range Date</span><span>Pricing Date</span><span>First Trade Date</span>
              </div>
              <div className="mt-3 relative h-6">
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-[#0b5e53]" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#17226b]" />
                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#17226b]" />
                <div className="absolute left-2/3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#17226b]" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#17226b]" />
              </div>
              <div className="mt-3 flex justify-between text-sm text-[#0B1B5E]">
                <span>{dateFmt(d.filed_date)}</span>
                <span>{dateFmt(d.pricing_range_date)}</span>
                <span>{dateFmt(d.pricing_date)}</span>
                <span>{dateFmt(d.first_trade_date)}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* --- CARD 2: DEAL SNAPSHOT (exact two-column spec) --- */}
        <Section title="">
          <div className="rounded-2xl bg-[#EEF4FF] p-6 shadow-inner">
            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2">
              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Pricing Date</div>
                <div className="mt-1 text-[#0B1B5E]">{dateFmt(d.pricing_date)}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Sector</div>
                <div className="mt-1 text-[#0B1B5E]">{safe(d.industry)}</div>
              </div>

              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Price Range</div>
                <div className="mt-1 text-[#0B1B5E]">{safe(priceRange)}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Bookrunners</div>
                <div className="mt-1 whitespace-pre-wrap text-[#0B1B5E]">{safe(d.bookrunners)}</div>
              </div>

              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Deal Size ($ Million)</div>
                <div className="mt-1 text-[#0B1B5E]">{d.deal_size == null ? blank : `$${mmFmt(d.deal_size)}`}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Shares Offered</div>
                <div className="mt-1 text-[#0B1B5E]">{intFmt(d.shares_offered)}</div>
              </div>

              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">No of Shares Outstanding</div>
                <div className="mt-1 text-[#0B1B5E]">{intFmt(d.nosh)}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0B1B5E]">Established</div>
                <div className="mt-1 text-[#0B1B5E]">{safe(d.established_year)}</div>
              </div>
            </div>
          </div>
        </Section>

        {/* --- KEY METRICS TABLE (categories + notes) --- */}
        <Section title="Key Metrics">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#0B1B5E] text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Criteria</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Color</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {metricsRows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 text-sm text-slate-800">{r.crit}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Dot c={catColor(r.cat)} />
                        <span className="text-slate-600">{safe(r.cat)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap">
                      {isNil(r.note) ? blank : r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* --- Narrative Sections --- */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {[
            { t: "Business Overview", v: d.business_overview },
            { t: "Key Highlights", v: d.key_highlights },
            { t: "Use of Proceeds", v: d.use_of_proceeds },
          ].map((s, i) => (
            <Section key={i} title={s.t}>
              {bullets(s.v).length ? (
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  {bullets(s.v).map((l, j) => <li key={j}>{l}</li>)}
                </ul>
              ) : <p className="text-sm text-slate-500">{blank}</p>}
            </Section>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[
            { t: "Strengths", v: d.strengths },
            { t: "Concerns", v: d.concerns },
          ].map((s, i) => (
            <Section key={i} title={s.t}>
              {bullets(s.v).length ? (
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  {bullets(s.v).map((l, j) => <li key={j}>{l}</li>)}
                </ul>
              ) : <p className="text-sm text-slate-500">{blank}</p>}
            </Section>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Principal Stockholders (pre-IPO)">
            {bullets(d.principal_stockholders_preipo).length ? (
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                {bullets(d.principal_stockholders_preipo).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            ) : <p className="text-sm text-slate-500">{blank}</p>}
          </Section>

          <Section title="Key Management Personnel">
            {persons(d.key_management_personnel).length ? (
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {persons(d.key_management_personnel).map((p, i) => {
                  const initials = p.name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
                  return (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold">{initials || "—"}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                        {p.meta && <div className="text-sm text-slate-700 mt-0.5">{p.meta}</div>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="text-sm text-slate-500">{blank}</p>}
          </Section>
        </div>
      </main>
    </div>
  );
};

export default S1DealSummary;
