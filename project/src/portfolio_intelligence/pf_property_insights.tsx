import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

type TrendPoint = {
  month: string;
  value: number;
};

type RevenueExpensePoint = {
  month: string;
  revenue: number;
  expense: number;
};

type IntelligenceTips = {
  confidence?: string;
  nextActions?: string[];
};

type RiskAlert = IntelligenceTips & {
  renewalRate?: number;
  riskDrivers?: string[];
  expiringUnits?: number;
  monthlyImpact?: number;
  revenueAtRisk?: number;
  annualNoiImpact?: number;
  avgTenureMonths?: number;
};

type MarketMomentum = IntelligenceTips & {
  absorption?: number;
  vacancyTrend?: string;
  monthlyImpact?: number;
  annualNoiImpact?: number;
  rentGrowthTrend?: string;
  concessionsTrend?: string;
  employmentGrowthYoY?: number;
};

type ReviewIntelligence = IntelligenceTips & {
  rating?: number;
  avgRating?: number;
  reviews90d?: number;
  responseRate?: number;
  sentimentPositive?: number;
  monthlyImpact?: number;
  annualNoiImpact?: number;
};

type PropertyIntelligence = {
  riskAlert?: RiskAlert;
  marketMomentum?: MarketMomentum;
  reviewIntelligence?: ReviewIntelligence;
};

type PropertyResponseDetails = {
  kpis?: {
    noi?: number;
    noiYoY?: number;
    revenue?: number;
    noiMargin?: number;
    occupancy?: number;
    expenseYoY?: number;
    revenueYoY?: number;
    lossToLease?: number;
    renewalRate?: number;
    expenseRatio?: number;
    markToMarket?: number;
  };
  trends?: {
    noiTrend12Month?: TrendPoint[];
    revenueVsExpense?: RevenueExpensePoint[];
  };
  property?: {
    name?: string;
    units?: number;
    location?: string;
    yearBuilt?: number;
  };
  intelligence?: PropertyIntelligence;
  rentComparison?: {
    market?: number;
    inPlace?: number;
    unitType?: string;
  }[];
  leaseExpirationLadder?: {
    month?: string;
    units?: number;
  }[];
};

type PropertyRecord = {
  property_name: string;
  submarket: string;
  region: string;
  property_response: PropertyResponseDetails | null;
};

const isValidNumber = (value: number | undefined | null): value is number =>
  typeof value === "number" && !Number.isNaN(value);

const formatCurrency = (value?: number | null): string => {
  if (!isValidNumber(value)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
};

const formatPercent = (value?: number | null): string => {
  if (!isValidNumber(value)) {
    return "-";
  }

  if (value > 1) {
    return `${value.toFixed(1)}%`;
  }

  return `${(value * 100).toFixed(1)}%`;
};

const formatYoY = (value?: number | null): string | undefined => {
  if (!isValidNumber(value)) {
    return undefined;
  }

  const percent = value * 100;
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}% YoY`;
};

const LineChart: React.FC<{
  title: string;
  series: Array<{ id: string; color: string; values: number[] }>;
  xLabels: string[];
  height?: number;
  width?: number;
}> = ({ title, series, xLabels, height = 210, width = 360 }) => {
  const padding = 14;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const flatValues = series.flatMap((serie) => serie.values);
  const validValues = flatValues.filter((value) => isValidNumber(value));

  if (!validValues.length) {
    return null;
  }

  const maxValue = Math.max(...validValues);
  const minValue = Math.min(...validValues);
  const range = maxValue === minValue ? 1 : maxValue - minValue;

  const horizontalLines = [0, 0.33, 0.66, 1];

  const buildPoints = (values: number[]) => {
    const pointCount = Math.max(values.length - 1, 1);
    const stepX = chartWidth / pointCount;

    return values
      .map((value, idx) => {
        const normalized = (value - minValue) / range;
        const x = padding + idx * stepX;
        const y = height - padding - normalized * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
        <span className="text-xs text-slate-400">Last 12 months</span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          {horizontalLines.map((fraction) => (
            <line
              key={`line-${fraction}`}
              x1={padding}
              x2={width - padding}
              y1={padding + chartHeight - chartHeight * fraction}
              y2={padding + chartHeight - chartHeight * fraction}
              strokeWidth={1}
              stroke="#e2e8f0"
              className="opacity-50"
            />
          ))}
          {series.map((serie) => (
            <polyline
              key={serie.id}
              points={buildPoints(serie.values)}
              fill="none"
              stroke={serie.color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {xLabels.map((label, index) => {
          const modulus = Math.floor(xLabels.length / 6) || 1;
          const shouldShow = index % modulus === 0 || index === xLabels.length - 1;

          return (
            <span key={`${label}-${index}`} className="truncate">
              {shouldShow ? label : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const LadderChart: React.FC<{ data: { month: string; units: number }[] }> = ({ data }) => {
  const maxUnits = Math.max(...data.map((item) => item.units), 1);

  return (
    <div className="flex items-end gap-3">
      {data.map((item) => (
        <div key={item.month} className="flex flex-col items-center gap-2 text-xs text-slate-500">
          <div className="flex h-36 w-5 items-end justify-center">
            <div
              className="w-full rounded-t-full bg-emerald-400 transition"
              style={{ height: `${(item.units / maxUnits) * 100}%` }}
            />
          </div>
          <span className="uppercase tracking-wide">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

const RentComparisonBar: React.FC<{
  data: { unitType: string; market: number; inPlace: number }[];
}> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap((entry) => [entry.market, entry.inPlace]), 1);

  return (
    <div className="space-y-3">
      {data.map((entry) => (
        <div key={entry.unitType} className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{entry.unitType}</span>
            <span>{formatCurrency(entry.market)}</span>
          </div>
          <div className="relative h-3 rounded-full bg-slate-100">
            <div
              className="absolute inset-y-0 rounded-full bg-slate-300"
              style={{ width: `${(entry.market / maxValue) * 100}%` }}
            />
            <div
              className="absolute inset-y-0 rounded-full bg-emerald-400"
              style={{
                width: `${(entry.inPlace / maxValue) * 100}%`,
              }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            In-place {formatCurrency(entry.inPlace)}
          </div>
        </div>
      ))}
    </div>
  );
};

const InsightCard: React.FC<{
  title: string;
  value: string;
  caption: string;
  badge?: string;
  badgeClass?: string;
  description?: string;
}> = ({ title, value, caption, badge, badgeClass, description }) => (
  <div className="space-y-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {badge ? (
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badgeClass ?? "bg-slate-100 text-slate-500"}`}>
          {badge}
        </span>
      ) : null}
    </div>
    <div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{caption}</p>
      {description ? <p className="mt-2 text-xs text-slate-500">{description}</p> : null}
    </div>
  </div>
);

const PfPropertyInsights: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyName = searchParams.get("property_name") ?? "";
  const submarket = searchParams.get("submarket") ?? "";
  const region = searchParams.get("region") ?? "";
  const [record, setRecord] = useState<PropertyRecord | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      if (!propertyName || !submarket || !region) {
        if (isActive) {
          setStatus("error");
        }
        return;
      }

      setStatus("loading");
      try {
        const response = await axios.post<{ data: PropertyRecord }>(`${API_URL}/api/get_property_model_data/`, {
          fetch: "specific",
          property_name: propertyName,
          submarket,
          region,
        });

        if (isActive) {
          setRecord(response.data?.data ?? null);
          setStatus("idle");
        }
      } catch (error) {
        if (isActive) {
          setStatus("error");
        }
      }
    };

    fetchData();
    return () => {
      isActive = false;
    };
  }, [API_URL, propertyName, region, submarket]);

  const kpiCards = useMemo(() => {
    const kpis = record?.property_response?.kpis;
    const intelligence = record?.property_response?.intelligence;
    if (!kpis) {
      return [];
    }

    const reviewRating = intelligence?.reviewIntelligence?.rating;
    const riskAlert = intelligence?.riskAlert;
    const market = intelligence?.marketMomentum;

    return [
      { label: "Occupancy", value: formatPercent(kpis.occupancy) },
      {
        label: "NOI",
        value: formatCurrency(kpis.noi),
        annotation: formatYoY(kpis.noiYoY),
      },
      {
        label: "Revenue",
        value: formatCurrency(kpis.revenue),
        annotation: formatYoY(kpis.revenueYoY),
      },
      { label: "NOI Margin", value: formatPercent(kpis.noiMargin) },
      { label: "Renewal Rate", value: formatPercent(riskAlert?.renewalRate) },
      { label: "Expense Ratio", value: formatPercent(kpis.expenseRatio) },
      { label: "Loss to Lease", value: formatPercent(kpis.lossToLease) },
      { label: "Mark-to-Market", value: formatCurrency(kpis.markToMarket) },
      { label: "Risk Score", value: reviewRating ? reviewRating.toFixed(1) : "-" },
      { label: "Absorption", value: market?.absorption !== undefined ? market.absorption.toString() : "-" },
    ];
  }, [record]);

  const priceGap = useMemo(() => {
    const rentComparison = record?.property_response?.rentComparison ?? [];
    if (!rentComparison.length) {
      return undefined;
    }

    const gap = rentComparison.reduce(
      (acc, entry) => acc + ((entry.market ?? 0) - (entry.inPlace ?? 0)),
      0
    );
    return gap / rentComparison.length;
  }, [record]);

  const reviewDetails = record?.property_response?.intelligence?.reviewIntelligence;
  const riskAlert = record?.property_response?.intelligence?.riskAlert;
  const marketMomentum = record?.property_response?.intelligence?.marketMomentum;
  const propertyMeta = record?.property_response?.property;
  const yearBuilt = propertyMeta?.yearBuilt;

  const trends = record?.property_response?.trends;
  const noiTrend = trends?.noiTrend12Month ?? [];
  const revenueExpense = trends?.revenueVsExpense ?? [];
  const leaseData = record?.property_response?.leaseExpirationLadder ?? [];
  const rentComparison = record?.property_response?.rentComparison
    ?.filter((entry) => isValidNumber(entry.market) && isValidNumber(entry.inPlace))
    .map((entry) => ({
      unitType: entry.unitType ?? "Unknown",
      market: entry.market ?? 0,
      inPlace: entry.inPlace ?? 0,
    })) ?? [];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <p className="text-sm font-semibold">Loading property insights...</p>
      </div>
    );
  }

  if (status === "error" || !record) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <p className="text-sm font-semibold text-red-500">Unable to load property insights.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/portfolio_intelligence", { state: { activeTab: "Properties" } })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Back
        </button>
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Portfolio Intelligence
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">{record.property_name}</h1>
              <p className="text-sm text-slate-500">
                {record.submarket} - {record.region}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>
                Units: {record.property_response?.property?.units ?? "-"}{" "}
                {yearBuilt ? `- Built ${yearBuilt}` : ""}
              </p>
              <p>{propertyMeta?.location ?? "-"}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpiCards.map((card) => (
              <div key={card.label} className="space-y-1 rounded-3xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
                {card.annotation ? <p className="text-xs text-emerald-600">{card.annotation}</p> : null}
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {noiTrend.length ? (
              <LineChart
                title="NOI Trend (12 Month)"
                series={[
                  {
                    id: "noi",
                    color: "#047857",
                    values: noiTrend.map((point) => point.value),
                  },
                ]}
                xLabels={noiTrend.map((point) => point.month)}
              />
            ) : null}
            {revenueExpense.length ? (
              <LineChart
                title="Revenue vs Expense"
                series={[
                  {
                    id: "revenue",
                    color: "#2563eb",
                    values: revenueExpense.map((point) => point.revenue),
                  },
                  {
                    id: "expense",
                    color: "#f97316",
                    values: revenueExpense.map((point) => point.expense),
                  },
                ]}
                xLabels={revenueExpense.map((point) => point.month)}
              />
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lease Expiration Ladder</h3>
              {leaseData.length ? (
                <LadderChart
                  data={leaseData
                    .filter((item): item is { month: string; units: number } => Boolean(item.month) && isValidNumber(item.units))
                    .map((item) => ({ month: item.month, units: item.units }))}
                />
              ) : (
                <p className="mt-3 text-sm text-slate-400">No lease ladder data available</p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                In-Place vs Market Rent
              </h3>
              {rentComparison.length ? <RentComparisonBar data={rentComparison} /> : <p className="mt-3 text-sm text-slate-400">Rent comparison unavailable</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">AI Insights</h2>
            <p className="text-sm text-slate-500">White theme only</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <InsightCard
              title="Price Optimization"
              value={
                priceGap !== undefined ? `${priceGap >= 0 ? "+" : ""}${formatCurrency(priceGap)}` : "-"
              }
              caption="Rent gap per unit"
              badge="High"
              badgeClass="bg-emerald-100 text-emerald-700"
              description="Benchmark vs market to unlock extra yield."
            />
            <InsightCard
              title="Review Intelligence"
              value={reviewDetails?.rating ? reviewDetails.rating.toFixed(1) : "-"}
              caption="Avg rating"
              badge={reviewDetails?.confidence}
              badgeClass="bg-amber-100 text-amber-700"
              description={`Resident sentiment trending ${reviewDetails?.sentimentPositive ?? 0}% positive.`}
            />
            <InsightCard
              title="Market Momentum"
              value={marketMomentum?.absorption ? `${marketMomentum.absorption.toLocaleString()} units` : "-"}
              caption="Metro-level traction"
              badge="Medium"
              badgeClass="bg-sky-100 text-sky-700"
              description={marketMomentum?.vacancyTrend ? `Vacancy ${marketMomentum.vacancyTrend.toLowerCase()}` : "Momentum data loading."}
            />
            <InsightCard
              title="Risk Alert"
              value={riskAlert?.expiringUnits ? `${riskAlert.expiringUnits} units` : "-"}
              caption="Expiring soon"
              badge="High"
              badgeClass="bg-rose-100 text-rose-700"
              description="Actionable next steps to protect NOI."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Review Intelligence</h3>
              <div>
                <p className="text-4xl font-semibold text-slate-900">{reviewDetails?.rating ? reviewDetails.rating.toFixed(1) : "-"}</p>
                <p className="text-sm text-slate-500">Avg rating across {reviewDetails?.reviews90d ?? "-"} reviews (90d)</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-3 text-xs font-semibold text-slate-600">
                  Rating {reviewDetails?.rating ? reviewDetails.rating.toFixed(1) : "-"}/5
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3 text-xs font-semibold text-slate-600">
                  Response {reviewDetails?.responseRate ?? 0}% rate
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3 text-xs font-semibold text-slate-600">
                  Sentiment {reviewDetails?.sentimentPositive ?? 0}% positive
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3 text-xs font-semibold text-slate-600">
                  Reviews 90d {reviewDetails?.reviews90d ?? 0}
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Why this matters</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                  {reviewDetails?.confidence ?? "Confidence unknown"}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Properties with 4.5+ ratings drive stronger renewal performance.</li>
                <li>Negative maintenance themes correlate with turnover spikes.</li>
                <li>Active review management lifts digital leads by 15-20%.</li>
              </ul>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly Impact</p>
                  <p className="text-2xl font-semibold text-emerald-700">
                    {formatCurrency(reviewDetails?.monthlyImpact ?? marketMomentum?.monthlyImpact ?? riskAlert?.monthlyImpact)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Annual NOI Impact</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatCurrency(reviewDetails?.annualNoiImpact ?? marketMomentum?.annualNoiImpact ?? riskAlert?.annualNoiImpact)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next best actions</p>
                {reviewDetails?.nextActions?.length ? (
                  <ol className="space-y-2 text-sm text-slate-600">
                    {reviewDetails.nextActions.map((action, index) => (
                      <li
                        key={action}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
                      >
                        <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-slate-500">No next actions defined for this insight.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PfPropertyInsights;
