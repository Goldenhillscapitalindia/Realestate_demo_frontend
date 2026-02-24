import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SnapshotTab from "./tabs/snapshot_tab";
import PerformanceDriversTab from "./tabs/performance_drivers_tab";
import RevenueQualityLeaseIntelligenceTab from "./tabs/revenue_quality_lease_intelligence_tab";
import ExpenseIntelTab from "./tabs/expense_intel_tab";
import RiskStabilityTab from "./tabs/risk_stability_tab";
import { PortfolioAnalyticsRecord } from "./portfolio_analytics_types";

export const portfolioAnalyticsTabDefinitions = [
  { id: "snapshot", label: "Snapshot" },
  { id: "performance_drivers", label: "Performance Drivers" },
  { id: "revenue_quality_lease_intelligence", label: "Revenue & Leases" },
  { id: "expenses_dashboard", label: "Expense Intel" },
  { id: "risk_stability_dashboard", label: "Risk & Stability" },
] as const;

export type PortfolioAnalyticsTabId = (typeof portfolioAnalyticsTabDefinitions)[number]["id"];

const portfolioAnalyticsHeroStyles: Record<
  PortfolioAnalyticsTabId,
  {
    subtitle: string;
    containerClass: string;
    glowClass: string;
  }
> = {
  snapshot: {
    subtitle: "Portfolio pulse at a glance",
    containerClass: "bg-[#1e3a8a]",
    glowClass: "bg-white/10",
  },
  performance_drivers: {
    subtitle: "Growth, efficiency, and operating momentum",
    containerClass: "bg-[#1e3a8a]",
    glowClass: "bg-white/10",
  },
  revenue_quality_lease_intelligence: {
    subtitle: "Revenue quality and lease health insights",
    containerClass: "bg-[#1e3a8a]",
    glowClass: "bg-white/10",
  },
  expenses_dashboard: {
    subtitle: "Spend control and efficiency breakdown",
    containerClass: "bg-[#1e3a8a]",
    glowClass: "bg-white/10",
  },
  risk_stability_dashboard: {
    subtitle: "Exposure signals and stability scoring",
    containerClass: "bg-[#1e3a8a]",
    glowClass: "bg-white/10",
  },
};

type PfDemoPortfolioAnalyticsProps = {
  activeSubTab?: PortfolioAnalyticsTabId;
  onSubTabChange?: (tab: PortfolioAnalyticsTabId) => void;
  showTabMenu?: boolean;
};

const PfDemoPortfolioAnalytics: React.FC<PfDemoPortfolioAnalyticsProps> = ({
  activeSubTab,
  onSubTabChange,
  showTabMenu = true,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [selectedRecord, setSelectedRecord] = useState<PortfolioAnalyticsRecord | null>(null);
  const [internalActiveTab, setInternalActiveTab] = useState<PortfolioAnalyticsTabId>("snapshot");
  const activeTab = activeSubTab ?? internalActiveTab;
  const setActiveTab = (tab: PortfolioAnalyticsTabId) => {
    if (onSubTabChange) onSubTabChange(tab);
    else setInternalActiveTab(tab);
  };

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
      } catch {
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

    switch (activeTab) {
      case "snapshot":
        return <SnapshotTab data={selectedRecord.portfolio_analytics_response?.portfolioSnapshot} />;
      case "performance_drivers":
        return <PerformanceDriversTab data={selectedRecord.performance_drivers_response?.performance_drivers} />;
      case "revenue_quality_lease_intelligence":
        return (
          <RevenueQualityLeaseIntelligenceTab
            data={selectedRecord.revenue_leases_response?.revenue_quality_lease_intelligence}
          />
        );
      case "expenses_dashboard":
        return <ExpenseIntelTab data={selectedRecord.expense_intel_response?.expensesDashboard} />;
      case "risk_stability_dashboard":
        return <RiskStabilityTab data={selectedRecord.risk_stability_response?.riskStabilityDashboard} />;
      default:
        return null;
    }
  }, [activeTab, selectedRecord]);

  const activeTabDefinition = useMemo(
    () => portfolioAnalyticsTabDefinitions.find((tab) => tab.id === activeTab),
    [activeTab]
  );

  const heroStyle = portfolioAnalyticsHeroStyles[activeTab];

  return (
    <>
      {showTabMenu && (
        <div className="mb-4 max-w-sm">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white" />
            <div className="relative space-y-2">
              {portfolioAnalyticsTabDefinitions.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                      isActive ? "bg-[#eef7f3] text-[#0b7a5c]" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        isActive ? "bg-[#0fa77d]" : "bg-slate-300"
                      }`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div>
        {status === "loading" ? (
          <p className="text-sm text-slate-500">Loading analytics...</p>
        ) : status === "error" ? (
          <p className="text-sm text-rose-600">Unable to load analytics right now. Please try again later.</p>
        ) : selectedRecord ? (
          <div className="space-y-4">
            <section
              className={`relative overflow-hidden rounded-2xl px-6 py-5 text-white shadow-md ${heroStyle.containerClass}`}
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Portfolio Intelligence</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight">{activeTabDefinition?.label ?? "Overview"}</h2>
                <p className="mt-1 text-sm text-white/85">{heroStyle.subtitle}</p>
              </div>
              <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl ${heroStyle.glowClass}`} />
            </section>
            {activeTabContent}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No analytics data available.</p>
        )}
      </div>
    </>
  );
};

export default PfDemoPortfolioAnalytics;
