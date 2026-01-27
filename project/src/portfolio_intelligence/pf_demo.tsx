import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import PfDemoPortfolioAnalytics from "./pf_demo_portfolio_analytics";
import PfDemoProperties from "./pf_demo_properties";
import PfDemoAiRentIntelligence from "./pf_demo_ai_rent_intelligence";

const tabs = ["Portfolio Analytics", "Properties", "AI Rent Intelligence"] as const;
type DemoTab = (typeof tabs)[number];

const tabComponents: Record<DemoTab, React.FC> = {
  "Portfolio Analytics": PfDemoPortfolioAnalytics,
  Properties: PfDemoProperties,
  "AI Rent Intelligence": PfDemoAiRentIntelligence,
};

const PfDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>("Portfolio Analytics");
  const ActiveTab = useMemo(() => tabComponents[activeTab], [activeTab]);
  const location = useLocation();

  useEffect(() => {
    const requestedTab = location.state?.activeTab as DemoTab | undefined;
    if (requestedTab && tabs.includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.state]);

  return (
    <section
      className="min-h-screen px-6 py-10 text-slate-900"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(214,237,255,0.7) 0%, rgba(248,250,255,0.92) 40%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-lg ring-1 ring-slate-200">
              <span className="text-xl font-semibold">PI</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Portfolio Intelligence</h1>
              {/* <p className="text-sm text-slate-500">318 Properties - $30.2B AUM</p> */}
            </div>
          </div>
        </div>

        <div className="grid gap-6  lg:grid-cols-[220px_1fr]">
          <aside className="space-y-2">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-m opacity-100">›</span>
                </button>
              );
            })}
          </aside>
          <div>
            <ActiveTab />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PfDemo;
