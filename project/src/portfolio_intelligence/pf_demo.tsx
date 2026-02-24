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

const TopLevelIcon: React.FC<{ type: "analytics" | "properties" | "ai"; className?: string }> = ({
  type,
  className = "h-4 w-4",
}) => {
  if (type === "analytics") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path d="M4 18h16" />
        <path d="M6 15l4-4 3 3 5-6" />
        <circle cx="6" cy="15" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="10" cy="11" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="13" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="18" cy="8" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "properties") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path d="M4 20h16" />
        <path d="M6 20V9l6-4 6 4v11" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 3l1.2 3.2L16.5 7l-3 1.8 1 3.5-2.5-2-2.5 2 1-3.5-3-1.8 3.3-.8L12 3z" />
      <path d="M6 14l.7 1.8 1.8.5-1.6 1 .5 1.8-1.4-1.1-1.4 1.1.5-1.8-1.6-1 1.8-.5L6 14z" />
      <path d="M18 14l.7 1.8 1.8.5-1.6 1 .5 1.8-1.4-1.1-1.4 1.1.5-1.8-1.6-1 1.8-.5L18 14z" />
    </svg>
  );
};

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
          className="sidebar-scroll-hidden fixed left-0 top-0 z-30 h-screen min-h-screen max-h-screen overflow-y-auto bg-[#0d1b4f] px-4 py-5 text-white"
          style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH, scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            type="button"
            onClick={() => navigate("/", { state: { scrollTo: "demos" } })}
            className="group mb-5 inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 text-base font-semibold text-white shadow-[0_6px_16px_rgba(5,10,35,0.22)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5be4c0]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
              <path d="M20 12H9" />
            </svg>
            <span>Back</span>
          </button>
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h1 className="text-2xl leading-tight font-semibold">Portfolio Intelligence</h1>
          </div>
          <nav className="space-y-1.5">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("Portfolio Analytics");
                    setIsPortfolioMenuOpen((prev) => !prev);
                  }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-base font-semibold transition ${
                  activeTab === "Portfolio Analytics"
                    ? "bg-[#0fa77d] text-white shadow-[0_6px_18px_rgba(15,167,125,0.35)]"
                    : "bg-white/5 text-blue-100 hover:bg-white/10"
                }`}
                >
                  <TopLevelIcon type="analytics" />
                  <span className="flex-1">Portfolio Analytics</span>
                  <span className="text-sm opacity-80">{isPortfolioMenuOpen ? "v" : ">"}</span>
                </button>

                {isPortfolioMenuOpen && (
                  <div className="mt-2 space-y-2 rounded-2xl bg-white p-3 shadow-lg">
                    {portfolioAnalyticsTabDefinitions.map((subTab, index) => {
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
                        className={`portfolio-subitem-enter flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-base font-semibold transition ${
                          isSubActive
                            ? "bg-[#dff3eb] text-[#066b52]"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                          style={{ animationDelay: `${index * 70}ms` }}
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
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-base font-semibold transition ${
                activeTab === "Properties"
                  ? "bg-[#0fa77d] text-white shadow-[0_6px_18px_rgba(15,167,125,0.35)]"
                  : "bg-white/5 text-blue-100 hover:bg-white/10"
              }`}
              >
                <TopLevelIcon type="properties" />
                <span className="flex-1">Properties</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("AI Rent Intelligence")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-base font-semibold transition ${
                activeTab === "AI Rent Intelligence"
                  ? "bg-[#0fa77d] text-white shadow-[0_6px_18px_rgba(15,167,125,0.35)]"
                  : "bg-white/5 text-blue-100 hover:bg-white/10"
              }`}
              >
                <TopLevelIcon type="ai" />
                <span className="flex-1">AI Rent Intelligence</span>
              </button>
          </nav>
        </aside>

        <main
          className="h-screen min-w-0 overflow-y-auto bg-[#f3f6fb] px-4 py-6 md:px-6 md:pt-7"
          style={{ marginLeft: SIDEBAR_WIDTH }}
        >
          <div className="mx-auto w-full max-w-[1420px]">
            {activeContent}
          </div>
        </main>
      </div>
      <style>{`
        .sidebar-scroll-hidden::-webkit-scrollbar { display: none; }
        .portfolio-subitem-enter {
          animation: portfolioSubitemEnter 320ms ease-out both;
        }
        @keyframes portfolioSubitemEnter {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default PfDemo;
