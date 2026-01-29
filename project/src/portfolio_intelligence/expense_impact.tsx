import React from "react";

type ExpenseCategory = {
  category: string;
  property_expense: string;
  submarket_avg_expense: string;
  variance: string;
  noi_impact: string;
};

type ExpenseImpactData = {
  noi_margin_pct?: number;
  noi_vs_benchmark_pct?: number;
  operating_expense_ratio_pct?: number;
  submarket_avg_oer_pct?: number;
  expense_categories?: ExpenseCategory[];
  oer?: {
    property: string;
    submarket_avg: string;
  };
};

type Props = {
  data: ExpenseImpactData | null;
};

const formatPercent = (value?: number | string) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return String(value);
  return `${num}%`;
};

const ExpenseImpact: React.FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No expense impact data available.
      </div>
    );
  }

  const oerValue = data.operating_expense_ratio_pct ?? data.oer?.property;
  const oerBenchmark = data.submarket_avg_oer_pct ?? data.oer?.submarket_avg;
  const noiValue = data.noi_margin_pct;
  const noiBenchmark = data.noi_vs_benchmark_pct;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-wide text-slate-500">Operating Expense Ratio</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {formatPercent(oerValue as number | string)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Submarket avg: {formatPercent(oerBenchmark as number | string)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-wide text-slate-500">NOI Margin</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {formatPercent(noiValue as number | string)}
          </p>
          <p className="mt-2 text-sm text-emerald-600">
            {noiBenchmark !== undefined && noiBenchmark !== null
              ? `${noiBenchmark > 0 ? "+" : ""}${noiBenchmark}% vs benchmark`
              : "—"}
          </p>
        </div>
      </div>

      {data.expense_categories && data.expense_categories.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Submarket Avg</th>
                <th className="px-4 py-3">Variance</th>
                <th className="px-4 py-3">NOI Impact</th>
              </tr>
            </thead>
            <tbody>
              {data.expense_categories.map((row, idx) => (
                <tr
                  key={`${row.category}-${idx}`}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="px-4 py-3 text-slate-700">{row.category || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.property_expense || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.submarket_avg_expense || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.variance || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.noi_impact || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default ExpenseImpact;
