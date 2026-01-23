import React, { useMemo, useState } from "react";

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

  return (
    <section
      className="min-h-screen px-6 py-10 text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(20,30,50,0.85) 0%, rgba(10,15,25,0.98) 45%, rgba(6,9,16,1) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70 text-sky-300 shadow-lg ring-1 ring-sky-500/30">
              <span className="text-xl font-semibold">PI</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Portfolio Intelligence</h1>
              <p className="text-sm text-slate-400">318 Properties - $30.2B AUM</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-[0_24px_60px_rgba(8,15,30,0.55)] lg:grid-cols-[220px_1fr]">
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
                      ? "bg-sky-500/90 text-slate-900 shadow-sm"
                      : "bg-slate-900/60 text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-xs opacity-70">›</span>
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
