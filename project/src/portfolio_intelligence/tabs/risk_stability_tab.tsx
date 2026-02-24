import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { RiskStabilityDashboard } from "../portfolio_analytics_types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#475569" },
    },
    y: {
      grid: { color: "rgba(148,163,184,0.2)" },
      ticks: { color: "#475569" },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: { display: false },
  },
};

const PROPERTY_CHART_COLORS = [
  "#1D4ED8",
  "#0F766E",
  "#7C3AED",
  "#BE185D",
  "#B45309",
  "#0369A1",
];

const fmtCurrency = (value?: number) => (value === undefined ? "-" : `$${value.toLocaleString()}`);
const fmtPercent = (value?: number) => (value === undefined ? "-" : `${value.toFixed(1)}%`);

const RiskStabilityTab: React.FC<{ data?: RiskStabilityDashboard }> = ({ data }) => {
  if (!data) {
    return <p className="text-sm text-slate-500">Risk & stability insights are not available.</p>;
  }

  const summary = data.summaryMetrics;
  const riskLabels = data.riskScoreByProperty?.map((row) => row.propertyName ?? "Property") ?? [];
  const concentrationLabels = data.revenueConcentration?.map((row) => row.propertyName ?? "Property") ?? [];
  const allPropertyNames = Array.from(new Set([...riskLabels, ...concentrationLabels]));
  const propertyColorMap = new Map(
    allPropertyNames.map((property, index) => [property, PROPERTY_CHART_COLORS[index % PROPERTY_CHART_COLORS.length]])
  );
  const getPropertyColor = (propertyName: string, index: number) =>
    propertyColorMap.get(propertyName) ?? PROPERTY_CHART_COLORS[index % PROPERTY_CHART_COLORS.length];

  const riskBars = {
    labels: riskLabels,
    datasets: [
      {
        label: "Risk Score",
        data: data.riskScoreByProperty?.map((row) => row.riskScore ?? 0) ?? [],
        backgroundColor: riskLabels.map((propertyName, index) => getPropertyColor(propertyName, index)),
        borderRadius: 6,
      },
    ],
  };

  const concentrationBars = {
    labels: concentrationLabels,
    datasets: [
      {
        label: "Revenue Share",
        data: data.revenueConcentration?.map((row) => (row.revenueSharePercent ?? 0) * 100) ?? [],
        backgroundColor: concentrationLabels.map((propertyName, index) => getPropertyColor(propertyName, index)),
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-m  text-indigo-700">Revenue at Risk (60d)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{fmtCurrency(summary?.revenueAtRisk60Days)}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-m text-indigo-700">Revenue at Risk (90d)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{fmtCurrency(summary?.revenueAtRisk90Days)}</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-m text-indigo-700">Stability Score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary?.portfolioStabilityScore?.score ?? "-"} / {summary?.portfolioStabilityScore?.maxScore ?? 100}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Risk Score by Property</h3>
          <div className="mt-4 h-56">
            <Bar data={riskBars} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Revenue Concentration</h3>
          <div className="mt-4 h-56">
            <Bar data={concentrationBars} options={chartOptions} />
          </div>
        </div>
      </div>

      {data.underperformingAssets?.length ? (
        <div className="rounded-3xl border border-slate-200 bg-red-100 p-5 shadow-sm">
          <p className="text-m font-semibold text-red-700  tracking-wide">Underperforming Assets</p>
          {data.underperformingAssets.map((asset) => (
            <div
              key={asset.propertyName}
              className="mt-3 flex flex-wrap items-baseline gap-4 border-t border-slate-100 pt-3"
            >
              <div>
                <p className="text-base font-semibold text-black">{asset.propertyName}</p>
                <p className="text-xs text-slate-500">
                  {asset.location} · {asset.units ?? 0} units
                </p>
              </div>
              <div className="text-sm text-black">
                NOI Growth: {fmtPercent(asset.noiGrowthPercent)} · Expense Growth: {fmtPercent(asset.expenseGrowthPercent)} ·
                Risk: {asset.riskScore ?? "-"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No underperforming assets flagged.</p>
      )}
    </div>
  );
};

export default RiskStabilityTab;
