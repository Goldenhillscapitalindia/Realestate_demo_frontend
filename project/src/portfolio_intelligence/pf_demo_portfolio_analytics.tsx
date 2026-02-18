import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SnapshotTab from "./tabs/snapshot_tab";
import PerformanceDriversTab from "./tabs/performance_drivers_tab";
import RevenueQualityLeaseIntelligenceTab from "./tabs/revenue_quality_lease_intelligence_tab";
import ExpenseIntelTab from "./tabs/expense_intel_tab";
import RiskStabilityTab from "./tabs/risk_stability_tab";
import { PortfolioAnalyticsRecord } from "./portfolio_analytics_types";

const tabDefinitions = [
  { id: "snapshot", label: "Snapshot" },
  { id: "performance_drivers", label: "Performance Drivers" },
  { id: "revenue_quality_lease_intelligence", label: "Revenue & Leases" },
  { id: "expenses_dashboard", label: "Expense Intel" },
  { id: "risk_stability_dashboard", label: "Risk & Stability" },
] as const;

type TabId = (typeof tabDefinitions)[number]["id"];

const PfDemoPortfolioAnalytics: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [selectedRecord, setSelectedRecord] = useState<PortfolioAnalyticsRecord | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("snapshot");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setStatus("loading");
      try {
        const response = await axios.post<{ data: PortfolioAnalyticsRecord[] }>(
          `${API_URL}/api/get_portfolio_analytics_model_data/`,
          { fetch: "all" }
        );
        if (!isMounted) return;
        const record = response.data?.data?.[0] ?? null;
        setSelectedRecord(record);
        setStatus("idle");
      } catch (error) {
        if (isMounted) setStatus("error");
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const activeTabContent = useMemo(() => {
    if (!selectedRecord) return null;
    const response = selectedRecord.portfolio_analytics_response;
    switch (activeTab) {
      case "snapshot":
        return <SnapshotTab data={response?.portfolioSnapshot} />;
      case "performance_drivers":
        return <PerformanceDriversTab data={response?.performance_drivers_response?.performance_drivers} />;
      case "revenue_quality_lease_intelligence":
        return (
          <RevenueQualityLeaseIntelligenceTab
            data={response?.revenue_leases_response?.revenue_quality_lease_intelligence}
          />
        );
      case "expenses_dashboard":
        return <ExpenseIntelTab data={response?.expense_intel_response?.expensesDashboard} />;
      case "risk_stability_dashboard":
        return <RiskStabilityTab data={response?.risk_stability_response?.riskStabilityDashboard} />;
      default:
        return null;
    }
  }, [activeTab, selectedRecord]);

  return (
    <section className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-lg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Portfolio Analytics</p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {selectedRecord?.property_name ?? "Portfolio Snapshot"}
          </h2>
          <p className="text-sm text-slate-500">
            {selectedRecord ? `${selectedRecord.region} - ${selectedRecord.submarket}` : "Loading portfolio metadata..."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabDefinitions.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {status === "loading" ? (
          <p className="text-sm text-slate-500">Loading analytics...</p>
        ) : status === "error" ? (
          <p className="text-sm text-rose-600">Unable to load analytics right now. Please try again later.</p>
        ) : selectedRecord ? (
          activeTabContent
        ) : (
          <p className="text-sm text-slate-500">No analytics data available.</p>
        )}
      </div>
    </section>
  );
};

export default PfDemoPortfolioAnalytics;
