import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ExpenseDashboard } from "../portfolio_analytics_types";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fmtCurrency = (value?: number) => (value === undefined ? "-" : `$${value.toLocaleString()}`);
const fmtPercent = (value?: number) =>
  value === undefined ? "-" : `${(value * 100).toFixed(1)}%`;

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

const ExpenseIntelTab: React.FC<{ data?: ExpenseDashboard }> = ({ data }) => {
  if (!data) {
    return <p className="text-sm text-slate-500">Expense intelligence is not available.</p>;
  }

  const categories = data.categories ?? [];

  const compositionData = {
    labels: categories.map((cat) => cat.name ?? "Category"),
    datasets: [
      {
        data: categories.map((cat) => (cat.compositionPercent ?? 0) * 100),
        backgroundColor: ["#3b82f6", "#6366f1", "#0ea5e9", "#14b8a6", "#f97316", "#ef4444"],
      },
    ],
  };

  const growthData = {
    labels: categories.map((cat) => cat.name ?? ""),
    datasets: [
      {
        label: "YoY Growth",
        data: categories.map((cat) => (cat.yoyGrowthPercent ?? 0) * 100),
        borderRadius: 6,
        backgroundColor: categories.map((cat) => (cat.yoyGrowthPercent ?? 0) >= 0 ? "#fbbf24" : "#ef4444"),
      },
    ],
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-m text-indigo-700">Total Current</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{fmtCurrency(data.summary?.totalCurrent)}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-m  text-indigo-700">Total Prior Year</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{fmtCurrency(data.summary?.totalPriorYear)}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-m text-indigo-700">Overall YoY</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{fmtPercent(data.summary?.overallYoYGrowth)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-blue-200 bg-white p-5 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-m font-semibold tracking-wide text-blue-900">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Current</th>
              <th className="px-4 py-2">Prior Year</th>
              <th className="px-4 py-2">YoY Growth</th>
              <th className="px-4 py-2">Per Unit</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.name} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-black">{category.name}</td>
                <td className="px-4 py-3 text-black">{fmtCurrency(category.current)}</td>
                <td className="px-4 py-3 text-black">{fmtCurrency(category.priorYear)}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    (category.yoyGrowthPercent ?? 0) < 0 ? "text-rose-500" : "text-emerald-600"
                  }`}
                >
                  {fmtPercent(category.yoyGrowthPercent)}
                </td>
                <td className="px-4 py-3 text-black">{fmtCurrency(category.perUnit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Expense Composition</h3>
          <div className="mt-4 h-56">
            <Doughnut data={compositionData} />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Expense Growth (YoY %)</h3>
          <div className="mt-4 h-56">
            <Bar data={growthData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseIntelTab;
