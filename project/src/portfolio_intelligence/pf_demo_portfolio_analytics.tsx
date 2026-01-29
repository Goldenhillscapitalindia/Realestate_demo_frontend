import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UnitTypeAnalytics from "./unit_type_analytics";
import ExpenseImpact from "./expense_impact";
import RiskSignals from "./risk_signals";
import PortfolioKpis from "./portfolio_kpis";

const PfDemoPortfolioAnalytics: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<PortfolioAnalyticsRecord[]>([]);
  const [selected, setSelected] = useState<PortfolioAnalyticsRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"unit" | "expense" | "risk">("unit");

  const [filters, setFilters] = useState({
    property_name: "",
    submarket: "",
    region: "",
  });

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setStatus("loading");
      try {
        const response = await axios.post<{ data: PortfolioAnalyticsRecord[] }>(
          `${API_URL}/api/get_portfolio_analytics_data/`,
          { fetch: "all" }
        );
        if (isActive) {
          const rows = response.data?.data ?? [];
          setData(rows);
          if (rows[0]) {
            setFilters({
              property_name: rows[0].property_name,
              submarket: rows[0].submarket,
              region: rows[0].region,
            });
          }
          setStatus("idle");
        }
      } catch (error) {
        if (isActive) setStatus("error");
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, [API_URL]);

  useEffect(() => {
    let isActive = true;
    const loadDetail = async () => {
      if (!filters.property_name || !filters.submarket || !filters.region) return;
      setDetailStatus("loading");
      try {
        const response = await axios.post<{ data: PortfolioAnalyticsRecord }>(
          `${API_URL}/api/get_portfolio_analytics_data/`,
          {
            fetch: "specific",
            property_name: filters.property_name,
            submarket: filters.submarket,
            region: filters.region,
          }
        );
        if (isActive) {
          setSelected(response.data?.data ?? null);
          setDetailStatus("idle");
        }
      } catch (error) {
        if (isActive) setDetailStatus("error");
      }
    };
    loadDetail();
    return () => {
      isActive = false;
    };
  }, [API_URL, filters.property_name, filters.submarket, filters.region]);

  const propertyOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => row.property_name && set.add(row.property_name));
    return Array.from(set);
  }, [data]);

  const submarketOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => row.submarket && set.add(row.submarket));
    return Array.from(set);
  }, [data]);

  const regionOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => row.region && set.add(row.region));
    return Array.from(set);
  }, [data]);

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <PortfolioKpis />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Property-Level Analytics</h2>
          <p className="mt-1 text-sm text-slate-600">
            Select a property to view unit mix, expense impact, and risk signals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <SelectField
            label="Property"
            value={filters.property_name}
            options={propertyOptions}
            onChange={(value) => setFilters((prev) => ({ ...prev, property_name: value }))}
          />
          <SelectField
            label="Submarket"
            value={filters.submarket}
            options={submarketOptions}
            onChange={(value) => setFilters((prev) => ({ ...prev, submarket: value }))}
          />
          <SelectField
            label="Region"
            value={filters.region}
            options={regionOptions}
            onChange={(value) => setFilters((prev) => ({ ...prev, region: value }))}
          />
        </div>
      </div>

      {status === "loading" ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          Loading analytics...
        </div>
      ) : status === "error" ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load analytics.
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap gap-2 rounded-full bg-white p-1 shadow-sm">
            {[
              { id: "unit", label: "Unit Type Analytics" },
              { id: "expense", label: "Expense Impact" },
              { id: "risk", label: "Risk Signals" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {detailStatus === "loading" ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Loading property analytics...
            </div>
          ) : detailStatus === "error" ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Failed to load property analytics.
            </div>
          ) : selected ? (
            <div className="mt-6">
              {activeTab === "unit" ? (
                <UnitTypeAnalytics data={selected.portfolio_analytics_response?.unit_type_analytics ?? []} />
              ) : null}
              {activeTab === "expense" ? (
                <ExpenseImpact data={selected.portfolio_analytics_response?.expense_impact ?? null} />
              ) : null}
              {activeTab === "risk" ? (
                <RiskSignals data={selected.portfolio_analytics_response?.risk_signals ?? []} />
              ) : null}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Select a property to view analytics.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PfDemoPortfolioAnalytics;

type ExpenseImpactResponse = {
  noi_margin_pct?: number;
  noi_vs_benchmark_pct?: number;
  operating_expense_ratio_pct?: number;
  submarket_avg_oer_pct?: number;
  expense_categories?: Array<{
    category: string;
    property_expense: string;
    submarket_avg_expense: string;
    variance: string;
    noi_impact: string;
  }>;
  oer?: {
    property: string;
    submarket_avg: string;
  };
};

type PortfolioAnalyticsResponse = {
  expense_impact?: ExpenseImpactResponse;
  risk_signals?: Array<{
    signal: string;
    description: string;
    metric?: string;
    severity: string;
  }>;
  unit_type_analytics?: Array<{
    unit_type: string;
    unit_count: number | string;
    avg_in_place_rent: number | string;
    occupancy_pct: number | string;
    rent_vs_market_pct: number | string;
    avg_market_rent?: number | string;
    avg_unit_size_sqft?: number | string;
  }>;
};

type PortfolioAnalyticsRecord = {
  property_name: string;
  submarket: string;
  region: string;
  address: string;
  location: string;
  portfolio_analytics_response?: PortfolioAnalyticsResponse | null;
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => {
  return (
    <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
      <select
        className="mt-2 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
};
