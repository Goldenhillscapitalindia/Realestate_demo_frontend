// src/components/deal/S1KeyNarratives.tsx
import React, { useMemo } from "react";
import { S1DealData, bullets, persons, catColor } from "./S1DealSummary";

const blank = "—";
const isNil = (v: any) =>
  v == null || (typeof v === "string" && v.trim() === "");
const safe = (v: any) => (isNil(v) ? blank : String(v));

const Section = ({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color?: string;
}) => (
  <section
    className={`rounded-xl border shadow-sm p-6`}
    style={{
      borderColor: color || "#E2E8F0",
      backgroundColor: color ? `${color}10` : "#FFFFFF",
    }}
  >
    <h3 className="mb-3 text-base font-semibold text-black">{title}</h3>
    {children}
  </section>
);

const ListBullets = ({ text }: { text?: string | null }) => {
  const items = bullets(text);
  if (!items.length) return <p className="text-sm text-black">{blank}</p>;
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm text-black">
      {items.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
};

const S1KeyNarratives: React.FC<{ data: S1DealData }> = ({ data: d }) => {
  const metrics = useMemo(
    () => [
      {
        crit: "Regulatory Environment",
        cat: d.regulatory_environment_category,
        note: d.barriers_to_entry,
      },
      {
        crit: "Customer Mix",
        cat: d.customer_mix_category,
        note: d.customer_mix,
      },
      {
        crit: "Supplier Mix",
        cat: d.supplier_mix_category,
        note: d.proprietary_solution,
      },
      {
        crit: "TAM/SAM & Penetration",
        cat: d.tam_sam_penetration_category,
        note: d.market_analysis_category,
      },
      {
        crit: "Near-Term Catalysts",
        cat: d.growth_catalysts_category,
        note: d.near_term_catalyst,
      },
      {
        crit: "Secular Trends",
        cat: d.secular_trends_category,
        note: d.valuation_attractiveness,
      },
      {
        crit: "Revenue Growth Profile",
        cat: d.revenue_growth_profile_category,
        note: d.revenue_growth,
      },
      {
        crit: "Margin Profile",
        cat: d.margin_profile_category,
        note: d.profitability,
      },
      {
        crit: "Leverage Profile",
        cat: d.leverage_profile_category,
        note: d.leverage,
      },
      {
        crit: "Management Team",
        cat: d.management_team_category,
        note: d.management_quality,
      },
      {
        crit: "Sponsor Track Record",
        cat: d.sponsor_track_record_category,
        note: null,
      },
      { crit: "ESG Focus", cat: d.esg_focus_category, note: null },
      {
        crit: "M&A Opportunities",
        cat: d.ma_opportunities_category,
        note: null,
      },
    ],
    [d]
  );

  const mgmt = persons(d.key_management_personnel);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Section title="Key Metrics">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-black">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Criteria
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-200 even:bg-slate-50 hover:bg-slate-100/60"
                >
                  <td className="px-4 py-3 text-sm text-black">{r.crit}</td>
                  <td className="px-4 py-3 text-sm text-black">
                    {safe(r.cat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Business Overview */}
      <Section title="Business Overview" color="#E0F2FE">
        <ListBullets text={d.business_overview} />
      </Section>

      {/* Key Highlights */}
      <Section title="Key Highlights" color="#FEF3C7">
        <ListBullets text={d.key_highlights} />
      </Section>

      {/* Use of Proceeds */}
      <Section title="Use of Proceeds" color="#FEE2E2">
        <ListBullets text={d.use_of_proceeds} />
      </Section>

      {/* Strengths */}
      <Section title="Strengths" color="#D1FAE5">
        <ListBullets text={d.strengths} />
      </Section>

      {/* Concerns */}
      <Section title="Concerns" color="#FEE2E2">
        <ListBullets text={d.concerns} />
      </Section>

      {/* Stockholders */}
      <Section title="Principal Stockholders (pre-IPO)" color="#E0F2FE">
        <ListBullets text={d.principal_stockholders_preipo} />
      </Section>

      {/* Management */}
      <Section title="Key Management Personnel" color="#F0F9FF">
        {!mgmt.length ? (
          <p className="text-sm text-black">{blank}</p>
        ) : (
          <ul className="space-y-3">
            {mgmt.map((p, i) => {
              const initials = p.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {initials || "—"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black">
                      {p.name}
                    </div>
                    {p.meta && (
                      <div className="text-sm text-black">{p.meta}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
};

export default S1KeyNarratives;
