import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PfDemoPortfolioAnalytics, {
  portfolioAnalyticsTabDefinitions,
  PortfolioAnalyticsTabId,
} from "./pf_demo_portfolio_analytics";
import PfDemoProperties from "./pf_demo_properties";
import PfDemoAiRentIntelligence from "./pf_demo_ai_rent_intelligence";

const tabs = ["Portfolio Analytics", "Properties", "AI Rent Intelligence"] as const;
type DemoTab = (typeof tabs)[number];
const SIDEBAR_WIDTH = 280;

const PfDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>("Portfolio Analytics");
  const [portfolioSubTab, setPortfolioSubTab] = useState<PortfolioAnalyticsTabId>("snapshot");
  const [isPortfolioMenuOpen, setIsPortfolioMenuOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const requestedTab = location.state?.activeTab as DemoTab | undefined;
    if (requestedTab && tabs.includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.state]);

  const activeContent = useMemo(() => {
    if (activeTab === "Portfolio Analytics") {
      return (
        <PfDemoPortfolioAnalytics
          activeSubTab={portfolioSubTab}
          onSubTabChange={setPortfolioSubTab}
          showTabMenu={false}
        />
      );
    }
    if (activeTab === "Properties") return <PfDemoProperties />;
    return <PfDemoAiRentIntelligence />;
  }, [activeTab, portfolioSubTab]);

  return (
    <section
      className="h-screen overflow-hidden text-black"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(232,239,250,0.85) 0%, rgba(241,246,252,0.95) 40%, rgba(248,251,255,1) 100%)",
      }}
    >
      <div className="h-screen">
        <aside
          className="fixed left-0 top-0 h-screen overflow-y-auto bg-[#050933] px-4 py-5 text-white"
          style={{
            width: SIDEBAR_WIDTH,
            minWidth: SIDEBAR_WIDTH,
            maxWidth: SIDEBAR_WIDTH,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/", { state: { scrollTo: "demos" } })}
            className="mb-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
          >
            {"<-"} Back
          </button>
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h1 className="text-xl font-semibold">Portfolio Intelligence</h1>
          </div>
          <nav className="space-y-2">
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("Portfolio Analytics");
                  setIsPortfolioMenuOpen((prev) => !prev);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === "Portfolio Analytics"
                    ? "bg-[#0fa77d] text-white shadow-[0_6px_18px_rgba(15,167,125,0.35)]"
                    : "bg-white/5 text-blue-100 hover:bg-white/10"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-current" />
                <span className="flex-1">Portfolio Analytics</span>
                <span className="text-xs opacity-80">{isPortfolioMenuOpen ? "v" : ">"}</span>
              </button>

              {isPortfolioMenuOpen && (
                <div className="mt-2 space-y-2 rounded-2xl bg-white p-3 shadow-lg">
                  {portfolioAnalyticsTabDefinitions.map((subTab) => {
                    const isSubActive =
                      activeTab === "Portfolio Analytics" && portfolioSubTab === subTab.id;
                    return (
                      <button
                        key={subTab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab("Portfolio Analytics");
                          setPortfolioSubTab(subTab.id);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                          isSubActive
                            ? "bg-[#dff3eb] text-[#066b52]"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            isSubActive ? "bg-[#0b8f6b]" : "bg-slate-300"
                          }`}
                        />
                        {subTab.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("Properties")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === "Properties"
                  ? "bg-[#0fa77d] text-white shadow-[0_6px_18px_rgba(15,167,125,0.35)]"
                  : "bg-white/5 text-blue-100 hover:bg-white/10"
              }`}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              <span className="flex-1">Properties</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("AI Rent Intelligence")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === "AI Rent Intelligence"
                  ? "bg-[#0fa77d] text-white shadow-[0_6px_18px_rgba(15,167,125,0.35)]"
                  : "bg-white/5 text-blue-100 hover:bg-white/10"
              }`}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              <span className="flex-1">AI Rent Intelligence</span>
            </button>
          </nav>
        </aside>

        <main
          className="h-screen overflow-y-auto bg-[#f3f6fb] px-4 py-6 md:px-6 md:pt-7"
          style={{
            marginLeft: SIDEBAR_WIDTH,
            width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
          }}
        >
          <div className="mx-auto w-full max-w-[1420px]">
            {activeContent}
          </div>
        </main>
      </div>
    </section>
  );
};

export default PfDemo;
