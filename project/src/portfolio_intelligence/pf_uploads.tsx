import React, { useMemo, useState } from "react";

const tabs = ["Portfolio Analytics", "Properties", "AI Rent Intelligence"] as const;
type UploadTab = (typeof tabs)[number];

const PfUploads: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UploadTab>("Portfolio Analytics");

  const tabLabel = useMemo(() => activeTab.toUpperCase(), [activeTab]);

  return (
    <section
      className="min-h-screen px-6 py-10 text-slate-900"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(214,237,255,0.7) 0%, rgba(248,250,255,0.9) 40%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">{tabLabel}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Portfolio Uploads</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage data ingestion for analytics, property records, and AI rent intelligence.
            </p>
          </div>
          <div className="flex gap-2 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
          style={{
            backdropFilter: "blur(12px)",
          }}
        >
          {activeTab === "Portfolio Analytics" ? (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">Portfolio Analytics Upload</h2>
                <p className="text-sm text-slate-600">
                  Upload portfolio-level performance snapshots, valuation histories, or benchmarking
                  exports.
                </p>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Drag and drop your portfolio analytics file
                  </p>
                  <p className="mt-2 text-xs text-slate-500">CSV or XLSX accepted. Max 25MB.</p>
                  <button
                    type="button"
                    className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-400"
                  >
                    Browse files
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold text-slate-500">Recommended Columns</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Portfolio name, reporting period, NAV</li>
                  <li>• NOI, EBITDA, cash-on-cash, cap rate</li>
                  <li>• Debt metrics, occupancy, rent growth</li>
                </ul>
              </div>
            </div>
          ) : null}

          {activeTab === "Properties" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Property Upload</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Provide property metadata to enrich portfolio intelligence and downstream analysis.
                </p>
              </div>
              <form className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Property Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Enter property name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Submarket
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Enter submarket"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Region
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Enter region"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Class
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Class A / B / C"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Units
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Total units"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Occupancy
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="e.g. 94%"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rent / Sqft
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="e.g. $2.15"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Property Response
                  </label>
                  <textarea
                    className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Notes or responses about the property"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/40 hover:bg-slate-800"
                  >
                    Save Property
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {activeTab === "AI Rent Intelligence" ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">AI Rent Intelligence Upload</h2>
                <p className="text-sm text-slate-600">
                  Upload rent rolls or lease comps to activate AI-driven rent insights.
                </p>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-700">Upload rent intelligence files</p>
                  <p className="mt-2 text-xs text-slate-500">CSV, XLSX, or PDF accepted.</p>
                  <button
                    type="button"
                    className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-400"
                  >
                    Browse files
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold text-slate-500">What gets smarter</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Market rent benchmarking vs. submarket</li>
                  <li>• Renewal risk and pricing sensitivity</li>
                  <li>• Unit-level rent lift suggestions</li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PfUploads;
