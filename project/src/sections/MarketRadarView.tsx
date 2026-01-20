import React, { useEffect, useId, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

type HealthIndicator = {
  label: string;
  score: number;
  color: string;
};

type TrendCard = {
  label: string;
  delta: string;
  data: number[];
  color: string;
};

type MarketRadarViewData = {
  submarket: string;
  region: string;
  pulseLabel: string;
  pulseKey: "strong" | "improving" | "mixed" | "weakening";
  healthIndicators: HealthIndicator[];
  keyTrends: TrendCard[];
  supplyDemand: {
    ratio: number;
    insight: string;
  };
  vacancyDynamics: {
    currentVacancy: string;
    yoyChange: string;
    narrative: string;
  };
  rentPerformance: {
    avgAsking: string;
    growthYoy: string;
    fiveYearAvg: string;
    narrative: string;
  };
  supplyPipeline: {
    underConstruction: string;
    narrative: string;
  };
  capitalMarkets: {
    capRate: string;
    spread: string;
    salesVolume: string;
    fiveYearAvgVolume: string;
    pricePerUnit: string;
    leasedAtSale: string;
    narrative: string;
  };
  aiOutcome: {
    confidence: string;
    upside: {
      vacancy: string;
      rentGrowth: string;
      absorptionDelta: string;
    };
    base: {
      vacancy: string;
      rentGrowth: string;
      absorptionDelta: string;
    };
    downside: {
      vacancy: string;
      rentGrowth: string;
      absorptionDelta: string;
    };
  };
  decisionSupport: {
    positives: string[];
    negatives: string[];
    watch: string[];
  };
};

type MarketRadarApiResponse = {
  header?: {
    submarket?: string;
    metro?: string;
    status_tag?: string;
  };
  market_health_indicators?: {
    demand_strength?: { score?: number; direction?: string; explanation?: string[] };
    supply_risk?: { score?: number; direction?: string; explanation?: string[] };
    vacancy_pressure?: { score?: number; direction?: string; explanation?: string[] };
    capital_liquidity?: { score?: number; direction?: string; explanation?: string[] };
  };
  key_trends?: {
    vacancy_trend_12m?: string;
    rent_growth_vs_5yr_avg?: string;
    absorption_trend?: string;
  };
  supply_demand_balance?: {
    demand_supply_ratio?: number;
    ai_insight?: string;
  };
  vacancy_dynamics?: {
    current_vacancy?: string;
    yoy_change?: string;
    ai_insight?: string;
  };
  rent_performance?: {
    avg_asking_rent?: string;
    rent_growth_yoy?: string;
    rent_growth_5yr_avg?: string;
    ai_insight?: string;
  };
  supply_pipeline_risk?: {
    under_construction_pct_inventory?: string;
    ai_insight?: string;
  };
  capital_markets_health?: {
    cap_rate?: string;
    cap_rate_spread_vs_metro?: string;
    sales_volume_12m?: string;
    sales_volume_5yr_avg?: string;
    price_per_unit?: string;
    pct_leased_at_sale?: string;
    ai_insight?: string;
  };
  ai_expected_market_outcome?: {
    confidence_level?: string;
    upside?: {
      vacancy?: string;
      rent_growth?: string;
      absorption_delta?: string;
    };
    base?: {
      vacancy?: string;
      rent_growth?: string;
      absorption_delta?: string;
    };
    downside?: {
      vacancy?: string;
      rent_growth?: string;
      absorption_delta?: string;
    };
  };
  decision_support?: {
    positives?: string[];
    negatives?: string[];
    what_to_watch?: string[];
  };
};

const EMPTY_VIEW_DATA: MarketRadarViewData = {
  submarket: "",
  region: "",
  pulseLabel: "",
  pulseKey: "mixed",
  healthIndicators: [],
  keyTrends: [],
  supplyDemand: {
    ratio: 0,
    insight: "",
  },
  vacancyDynamics: {
    currentVacancy: "",
    yoyChange: "",
    narrative: "",
  },
  rentPerformance: {
    avgAsking: "",
    growthYoy: "",
    fiveYearAvg: "",
    narrative: "",
  },
  supplyPipeline: {
    underConstruction: "",
    narrative: "",
  },
  capitalMarkets: {
    capRate: "",
    spread: "",
    salesVolume: "",
    fiveYearAvgVolume: "",
    pricePerUnit: "",
    leasedAtSale: "",
    narrative: "",
  },
  aiOutcome: {
    confidence: "",
    upside: { vacancy: "", rentGrowth: "", absorptionDelta: "" },
    base: { vacancy: "", rentGrowth: "", absorptionDelta: "" },
    downside: { vacancy: "", rentGrowth: "", absorptionDelta: "" },
  },
  decisionSupport: {
    positives: [],
    negatives: [],
    watch: [],
  },
};

const PULSE_STYLES: Record<
  MarketRadarViewData["pulseKey"],
  { dot: string; glow: string; label: string }
> = {
  strong: { dot: "#2ED573", glow: "rgba(46, 213, 115, 0.45)", label: "Strong" },
  improving: { dot: "#21C7D9", glow: "rgba(33, 199, 217, 0.45)", label: "Improving" },
  mixed: { dot: "#F4B740", glow: "rgba(244, 183, 64, 0.45)", label: "Mixed" },
  weakening: { dot: "#FF5A4A", glow: "rgba(255, 90, 74, 0.45)", label: "Weakening" },
};

const MarketRadarView: React.FC = () => {
  const { submarket = "" } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState<MarketRadarViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_URL}/api/market_radar_view/`, {
          submarket,
        });
        const payload = response.data?.data ?? response.data;
        if (!active) return;
        setData(normalizeApiPayload(payload, submarket));
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError("Unable to load market radar view.");
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [API_URL, submarket]);

  const viewData = useMemo(
    () => buildViewData(data, submarket),
    [data, submarket]
  );

  const pulseStyle = PULSE_STYLES[viewData.pulseKey];

  return (
    <section className="min-h-screen px-6 py-10" style={{ backgroundColor: "#060B14" }}>
      <div className="mx-auto max-w-6xl space-y-8">
        <div
          className="rounded-2xl border border-white/10 px-6 py-4 shadow-[0_0_40px_rgba(0,140,255,0.15)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,20,35,0.95) 0%, rgba(10,15,30,0.9) 100%)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                {"<"}
              </button>
              {/* <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(27, 202, 234, 0.15)" }}
              >
                <span style={{ color: "#20C7D9" }}>O</span>
              </div> */}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-100">{viewData.submarket}</h2>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                      border: `1px solid ${pulseStyle.dot}`,
                      color: pulseStyle.dot,
                    }}
                  >
                    {viewData.pulseLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{viewData.region}</p>
              </div>
            </div>
            <div
              className="rounded-full px-4 py-1 text-sm font-semibold text-cyan-100"
              style={{
                backgroundColor: "rgba(0, 193, 255, 0.15)",
                border: "1px solid rgba(0, 193, 255, 0.35)",
              }}
            >
              AI-Powered
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <h3 className="text-sm font-semibold text-slate-100">Market Health Indicators</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {viewData.healthIndicators.map((indicator) => (
              <Gauge key={indicator.label} indicator={indicator} />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Key Trends</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {viewData.keyTrends.map((trend) => (
                <TrendCardBlock key={trend.label} trend={trend} />
              ))}
            </div>
          </div>
          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
            }}
          >
            <h3 className="text-sm font-semibold text-slate-100">Supply-Demand Balance</h3>
            <div className="mt-4 flex items-center justify-center">
              <div
                className="rounded-full px-5 py-2 text-sm font-semibold"
                style={{
                  border: "1px solid rgba(46, 213, 115, 0.4)",
                  color: "#2ED573",
                  backgroundColor: "rgba(46, 213, 115, 0.1)",
                }}
              >
                Demand : Supply&nbsp;&nbsp;
                <span className="text-lg">{viewData.supplyDemand.ratio.toFixed(2)}</span>
              </div>
            </div>
            <div
              className="mt-4 rounded-xl border border-cyan-400/40 bg-[#0B1220] px-4 py-3 text-sm text-slate-300"
            >
              <span className="mr-2 text-cyan-300">*</span>
              {viewData.supplyDemand.insight}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <SectionHeading label="Vacancy Dynamics" accent="text-cyan-300" icon="[]" />
            <div
              className="rounded-2xl border border-white/10 p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard label="Current Vacancy" value={viewData.vacancyDynamics.currentVacancy} />
                <MetricCard label="YoY Change" value={viewData.vacancyDynamics.yoyChange} isDelta />
              </div>
              <NarrativeCard text={viewData.vacancyDynamics.narrative} />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeading label="Rent Performance" accent="text-green-300" icon="$" />
            <div
              className="rounded-2xl border border-white/10 p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
              }}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard label="Avg Asking" value={viewData.rentPerformance.avgAsking} />
                <MetricCard label="Growth YoY" value={viewData.rentPerformance.growthYoy} isDelta />
                <MetricCard label="5-Yr Avg" value={viewData.rentPerformance.fiveYearAvg} />
              </div>
              <NarrativeCard text={viewData.rentPerformance.narrative} />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeading label="Supply Pipeline Risk" accent="text-cyan-200" icon="^" />
            <div
              className="rounded-2xl border border-white/10 p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
              }}
            >
              <div className="grid gap-3 sm:grid-cols-1">
                <MetricCard
                  label="Under Construction / Inventory"
                  value={viewData.supplyPipeline.underConstruction}
                />
              </div>
              <NarrativeCard text={viewData.supplyPipeline.narrative} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeading label="Capital Markets Health" accent="text-cyan-300" icon="O" />
          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <MetricCard label="Cap Rate" value={viewData.capitalMarkets.capRate} />
              <MetricCard label="Spread vs Metro" value={viewData.capitalMarkets.spread} />
              <MetricCard label="12M Sales Volume" value={viewData.capitalMarkets.salesVolume} />
              <MetricCard label="5-Yr Avg Volume" value={viewData.capitalMarkets.fiveYearAvgVolume} />
              <MetricCard label="Price / Unit" value={viewData.capitalMarkets.pricePerUnit} />
              <MetricCard label="% Leased at Sale" value={viewData.capitalMarkets.leasedAtSale} />
            </div>
            <NarrativeCard text={viewData.capitalMarkets.narrative} />
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">AI Expected Market Outcome</h3>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "rgba(46, 213, 115, 0.2)",
                border: "1px solid rgba(46, 213, 115, 0.4)",
                color: "#2ED573",
              }}
            >
              {viewData.aiOutcome.confidence}
            </span>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <OutcomeChart />
            <div className="grid gap-4">
              <OutcomeCard title="Upside" color="#2ED573" data={viewData.aiOutcome.upside} />
              <OutcomeCard title="Base" color="#21C7D9" data={viewData.aiOutcome.base} />
              <OutcomeCard title="Downside" color="#FF5A4A" data={viewData.aiOutcome.downside} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-100">Decision Support</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            <DecisionCard title="Positives" color="#2ED573" items={viewData.decisionSupport.positives} />
            <DecisionCard title="Negatives" color="#FF5A4A" items={viewData.decisionSupport.negatives} />
            <DecisionCard title="What to Watch" color="#F4B740" items={viewData.decisionSupport.watch} />
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {loading ? "Loading latest pulse..." : "Updated moments ago"}{" "}
          {error ? `- ${error}` : null}
        </div>
      </div>
    </section>
  );
};

const buildViewData = (
  payload: Partial<MarketRadarViewData> | null,
  submarket: string
): MarketRadarViewData => {
  const safePayload = payload ?? {};
  return {
    ...EMPTY_VIEW_DATA,
    ...safePayload,
    submarket: safePayload.submarket ?? submarket ?? EMPTY_VIEW_DATA.submarket,
    region: safePayload.region ?? EMPTY_VIEW_DATA.region,
    pulseLabel: safePayload.pulseLabel ?? EMPTY_VIEW_DATA.pulseLabel,
    pulseKey: safePayload.pulseKey ?? EMPTY_VIEW_DATA.pulseKey,
    healthIndicators: safePayload.healthIndicators ?? EMPTY_VIEW_DATA.healthIndicators,
    keyTrends: safePayload.keyTrends ?? EMPTY_VIEW_DATA.keyTrends,
    supplyDemand: safePayload.supplyDemand ?? EMPTY_VIEW_DATA.supplyDemand,
    vacancyDynamics: safePayload.vacancyDynamics ?? EMPTY_VIEW_DATA.vacancyDynamics,
    rentPerformance: safePayload.rentPerformance ?? EMPTY_VIEW_DATA.rentPerformance,
    supplyPipeline: safePayload.supplyPipeline ?? EMPTY_VIEW_DATA.supplyPipeline,
    capitalMarkets: safePayload.capitalMarkets ?? EMPTY_VIEW_DATA.capitalMarkets,
    aiOutcome: safePayload.aiOutcome ?? EMPTY_VIEW_DATA.aiOutcome,
    decisionSupport: safePayload.decisionSupport ?? EMPTY_VIEW_DATA.decisionSupport,
  };
};

const normalizeApiPayload = (
  payload: MarketRadarApiResponse | null,
  submarketParam: string
): MarketRadarViewData => {
  if (!payload) return buildViewData(null, submarketParam);
  const status = payload.header?.status_tag?.toLowerCase();
  const pulseKey =
    status === "strong" || status === "improving" || status === "mixed" || status === "weakening"
      ? status
      : undefined;

  const indicatorColors = {
    demand: "#2ED573",
    supply: "#21C7D9",
    vacancy: "#2ED573",
    capital: "#2ED573",
  };

  const healthIndicators: HealthIndicator[] = payload.market_health_indicators
    ? [
        {
          label: "Demand Strength",
          score: payload.market_health_indicators?.demand_strength?.score ?? 0,
          color: indicatorColors.demand,
        },
        {
          label: "Supply Risk",
          score: payload.market_health_indicators?.supply_risk?.score ?? 0,
          color: indicatorColors.supply,
        },
        {
          label: "Vacancy Pressure",
          score: payload.market_health_indicators?.vacancy_pressure?.score ?? 0,
          color: indicatorColors.vacancy,
        },
        {
          label: "Capital Liquidity",
          score: payload.market_health_indicators?.capital_liquidity?.score ?? 0,
          color: indicatorColors.capital,
        },
      ]
    : [];

  const keyTrends: TrendCard[] = payload.key_trends
    ? [
        {
          label: "Vacancy Trend (12M)",
          delta: payload.key_trends?.vacancy_trend_12m ?? "",
          data: [],
          color: "#2ED573",
        },
        {
          label: "Rent Growth vs 5-Yr Avg",
          delta: payload.key_trends?.rent_growth_vs_5yr_avg ?? "",
          data: [],
          color: "#21C7D9",
        },
        {
          label: "Absorption Trend",
          delta: payload.key_trends?.absorption_trend ?? "",
          data: [],
          color: "#21C7D9",
        },
      ]
    : [];

  return buildViewData(
    {
    submarket: payload.header?.submarket,
    region: payload.header?.metro,
    pulseLabel: payload.header?.status_tag
      ? payload.header.status_tag.charAt(0).toUpperCase() + payload.header.status_tag.slice(1).toLowerCase()
      : undefined,
    pulseKey,
    healthIndicators,
    keyTrends,
    supplyDemand: {
      ratio: payload.supply_demand_balance?.demand_supply_ratio ?? 0,
      insight: payload.supply_demand_balance?.ai_insight ?? "",
    },
    vacancyDynamics: {
      currentVacancy: payload.vacancy_dynamics?.current_vacancy ?? "",
      yoyChange: payload.vacancy_dynamics?.yoy_change ?? "",
      narrative: payload.vacancy_dynamics?.ai_insight ?? "",
    },
    rentPerformance: {
      avgAsking: payload.rent_performance?.avg_asking_rent ?? "",
      growthYoy: payload.rent_performance?.rent_growth_yoy ?? "",
      fiveYearAvg: payload.rent_performance?.rent_growth_5yr_avg ?? "",
      narrative: payload.rent_performance?.ai_insight ?? "",
    },
    supplyPipeline: {
      underConstruction: payload.supply_pipeline_risk?.under_construction_pct_inventory ?? "",
      narrative: payload.supply_pipeline_risk?.ai_insight ?? "",
    },
    capitalMarkets: {
      capRate: payload.capital_markets_health?.cap_rate ?? "",
      spread: payload.capital_markets_health?.cap_rate_spread_vs_metro ?? "",
      salesVolume: payload.capital_markets_health?.sales_volume_12m ?? "",
      fiveYearAvgVolume: payload.capital_markets_health?.sales_volume_5yr_avg ?? "",
      pricePerUnit: payload.capital_markets_health?.price_per_unit ?? "",
      leasedAtSale: payload.capital_markets_health?.pct_leased_at_sale ?? "",
      narrative: payload.capital_markets_health?.ai_insight ?? "",
    },
    aiOutcome: {
      confidence: payload.ai_expected_market_outcome?.confidence_level
        ? `${payload.ai_expected_market_outcome.confidence_level} Confidence`
        : "",
      upside: {
        vacancy: payload.ai_expected_market_outcome?.upside?.vacancy ?? "",
        rentGrowth: payload.ai_expected_market_outcome?.upside?.rent_growth ?? "",
        absorptionDelta: payload.ai_expected_market_outcome?.upside?.absorption_delta ?? "",
      },
      base: {
        vacancy: payload.ai_expected_market_outcome?.base?.vacancy ?? "",
        rentGrowth: payload.ai_expected_market_outcome?.base?.rent_growth ?? "",
        absorptionDelta: payload.ai_expected_market_outcome?.base?.absorption_delta ?? "",
      },
      downside: {
        vacancy: payload.ai_expected_market_outcome?.downside?.vacancy ?? "",
        rentGrowth: payload.ai_expected_market_outcome?.downside?.rent_growth ?? "",
        absorptionDelta: payload.ai_expected_market_outcome?.downside?.absorption_delta ?? "",
      },
    },
    decisionSupport: {
      positives: payload.decision_support?.positives ?? [],
      negatives: payload.decision_support?.negatives ?? [],
      watch: payload.decision_support?.what_to_watch ?? [],
    },
    },
    submarketParam
  );
};

const Gauge: React.FC<{ indicator: HealthIndicator }> = ({ indicator }) => {
  const percentage = Math.min(Math.max(indicator.score / 10, 0), 1);
  const background = `conic-gradient(${indicator.color} ${percentage * 360}deg, rgba(148,163,184,0.15) 0deg)`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full p-2"
        style={{ background }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-full text-center"
          style={{
            backgroundColor: "#0B1220",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-lg font-semibold" style={{ color: indicator.color }}>
            {indicator.score.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">AI Score</span>
        </div>
      </div>
      <p className="text-xs text-slate-400">{indicator.label}</p>
    </div>
  );
};

const TrendCardBlock: React.FC<{ trend: TrendCard }> = ({ trend }) => {
  const deltaColor = trend.delta.startsWith("-") ? "#FF5A4A" : "#2ED573";

  return (
    <div
      className="rounded-2xl border border-white/10 p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
      }}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-[0.15em]">{trend.label}</span>
        <span style={{ color: deltaColor }}>{trend.delta}</span>
      </div>
      <div className="mt-3 h-12">
        <Sparkline data={trend.data} color={trend.color} />
      </div>
    </div>
  );
};

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const gradientId = useId();
  if (!data || data.length < 2) return null;
  const width = 140;
  const height = 40;
  const padding = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={`url(#spark-${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
      <circle cx={points[points.length - 1].split(",")[0]} cy={points[points.length - 1].split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
};

const MetricCard: React.FC<{ label: string; value: string; isDelta?: boolean }> = ({
  label,
  value,
  isDelta,
}) => {
  const color = isDelta && value.trim().startsWith("-") ? "#FF5A4A" : "#2ED573";

  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold" style={{ color: isDelta ? color : "#E2E8F0" }}>
        {value}
      </p>
    </div>
  );
};

const NarrativeCard: React.FC<{ text: string }> = ({ text }) => (
  <div className="mt-4 rounded-xl border border-cyan-400/40 bg-[#0B1220] px-4 py-3 text-sm text-slate-300">
    <span className="mr-2 text-cyan-300">*</span>
    {text}
  </div>
);

const SectionHeading: React.FC<{ label: string; icon: string; accent: string }> = ({
  label,
  icon,
  accent,
}) => (
  <div className="flex items-center gap-2 text-sm font-semibold">
    <span className={accent}>{icon}</span>
    <span className="text-slate-100">{label}</span>
  </div>
);

const OutcomeChart: React.FC = () => (
  <div className="flex items-center justify-center">
    <svg width="260" height="140" viewBox="0 0 260 140">
      <defs>
        <linearGradient id="outcome-up" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2ED573" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2ED573" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="outcome-base" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#21C7D9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#21C7D9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="outcome-down" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF5A4A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF5A4A" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <line x1="40" y1="70" x2="220" y2="70" stroke="#1E293B" strokeWidth="2" />
      <circle cx="40" cy="70" r="4" fill="#38BDF8" />
      <path d="M40 70 C90 68, 130 52, 220 30" stroke="url(#outcome-up)" strokeWidth="3" fill="none" />
      <path d="M40 70 C95 75, 135 72, 220 72" stroke="url(#outcome-base)" strokeWidth="3" fill="none" />
      <path d="M40 70 C95 82, 130 95, 220 110" stroke="url(#outcome-down)" strokeWidth="3" fill="none" />
      <text x="10" y="74" fill="#94A3B8" fontSize="10">
        Now
      </text>
      <text x="230" y="30" fill="#2ED573" fontSize="10">
        Upside
      </text>
      <text x="230" y="112" fill="#FF5A4A" fontSize="10">
        Downside
      </text>
    </svg>
  </div>
);

const OutcomeCard: React.FC<{
  title: string;
  color: string;
  data: MarketRadarViewData["aiOutcome"]["upside"];
}> = ({ title, color, data }) => (
  <div
    className="rounded-2xl border border-white/10 px-4 py-3"
    style={{ backgroundColor: "#0B1220", borderColor: `${color}55` }}
  >
    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color }}>
      <span>[]</span>
      <span>{title}</span>
    </div>
    <div className="mt-2 space-y-1 text-xs text-slate-400">
      <div className="flex justify-between">
        <span>Vacancy</span>
        <span className="text-slate-200">{data.vacancy}</span>
      </div>
      <div className="flex justify-between">
        <span>Rent Growth</span>
        <span className="text-slate-200">{data.rentGrowth}</span>
      </div>
      <div className="flex justify-between">
        <span>Absorption Delta</span>
        <span className="text-slate-200">{data.absorptionDelta}</span>
      </div>
    </div>
  </div>
);

const DecisionCard: React.FC<{ title: string; color: string; items: string[] }> = ({
  title,
  color,
  items,
}) => (
  <div
    className="rounded-2xl border border-white/10 px-4 py-4"
    style={{
      background:
        "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
    }}
  >
    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color }}>
      <span>*</span>
      <span>{title}</span>
    </div>
    <ul className="mt-3 space-y-2 text-xs text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span style={{ color }}>*</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default MarketRadarView;
