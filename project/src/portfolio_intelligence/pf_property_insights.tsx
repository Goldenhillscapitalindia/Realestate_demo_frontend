import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  return `${sign}${percent.toFixed(1)}%`;
};

const baseBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: "#475569" },
      grid: { color: "rgba(15,23,42,0.05)" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#475569" },
      grid: { color: "rgba(15,23,42,0.08)" },
    },
  },
  plugins: {
    legend: {
      labels: { color: "#0f172a", font: { weight: 500 } },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
      },
    },
  },
};


const LineChart: React.FC<{
  title: string;
  series: Array<{ id: string; color: string; values: number[] }>;
  xLabels: string[];
  height?: number;
  width?: number;
  strokeWidth?: number;
}> = ({
  title,
  series,
  xLabels,
  height = 220,
  width = 520,
  strokeWidth = 1.6,
}) => {
  const padding = 36;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        setContainerWidth(wrapperRef.current.offsetWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const svgWidth =
    containerWidth && containerWidth > width ? containerWidth : width;
  const chartHeight = height - padding * 2;
  const chartWidth = svgWidth - padding * 2;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const flatValues = series.flatMap((s) => s.values);
  const validValues = flatValues.filter((v) => typeof v === "number");

  if (!validValues.length) return null;

  const maxValue = Math.max(...validValues);
  const minValue = Math.min(...validValues);
  const range = maxValue === minValue ? 1 : maxValue - minValue;

  const getPoint = (value: number, index: number, total: number) => {
    const stepX = chartWidth / (total - 1);
    const normalized = (value - minValue) / range;

    return {
      x: padding + index * stepX,
      y: padding + chartHeight - normalized * chartHeight,
    };
  };
  const formatYAxisValue = (value: number) => {
    const abs = Math.abs(value);

    if (abs >= 1_000_000_000)
      return `${value < 0 ? "-" : ""}${(abs / 1_000_000_000).toFixed(1)}B`;

    if (abs >= 1_000_000)
      return `${value < 0 ? "-" : ""}${(abs / 1_000_000).toFixed(1)}M`;

    if (abs >= 1_000)
      return `${value < 0 ? "-" : ""}${(abs / 1_000).toFixed(1)}K`;

    return value.toString();
  };

  const buildSmoothPath = (values: number[]) => {
    const total = values.length;
    if (total < 2) return "";

    const points = values.map((v, i) => getPoint(v, i, total));

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
    }

    d += ` T ${points[points.length - 1].x} ${points[points.length - 1].y
      }`;

    return d;
  };

  const yTicks = 5;
  const yStep = range / (yTicks - 1);

  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
        <span className="text-xs text-slate-400">Last 12 months</span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Y Axis + Grid */}
        {[...Array(yTicks)].map((_, i) => {
          const value = minValue + yStep * i;
          const y =
            padding +
            chartHeight -
            ((value - minValue) / range) * chartHeight;

          return (
            <g key={i}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#000000"
              >
                {formatYAxisValue(value)}
              </text>

            </g>
          );
        })}

        {/* Lines */}
        {series.map((serie) => (
          <path
            key={serie.id}
            d={buildSmoothPath(serie.values)}
            fill="none"
            stroke={serie.color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}

        {/* Hover Elements */}
        {hoverIndex !== null && (
          <>
            {/* Vertical Line */}
            <line
              x1={
                getPoint(
                  series[0].values[hoverIndex],
                  hoverIndex,
                  series[0].values.length
                ).x
              }
              x2={
                getPoint(
                  series[0].values[hoverIndex],
                  hoverIndex,
                  series[0].values.length
                ).x
              }
              y1={padding}
              y2={height - padding}
              stroke="#000000"
              strokeDasharray="4 4"
            />

            {/* Points */}
            {series.map((serie) => {
              const point = getPoint(
                serie.values[hoverIndex],
                hoverIndex,
                serie.values.length
              );

              return (
                <circle
                  key={serie.id}
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill={serie.color}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            })}
          </>
        )}

        {/* Hover Detection Zones */}
        {xLabels.map((_, i) => {
          const total = xLabels.length;
          const stepX = chartWidth / (total - 1);
          const x = padding + i * stepX;

          return (
            <rect
              key={i}
              x={x - stepX / 2}
              y={padding}
              width={stepX}
              height={chartHeight}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
            />
          );
        })}
      </svg>

      {/* X Labels */}
      <div className="mt-4 flex justify-between text-[11px] text-black">
        {xLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      {/* Tooltip */}
      {hoverIndex !== null && (
        <div className="absolute right-6 top-6 rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
          <div className="font-semibold text-black">
            {xLabels[hoverIndex]}
          </div>
          {series.map((serie) => (
            <div key={serie.id} style={{ color: serie.color }}>
              {serie.id}: {serie.values[hoverIndex]}
            </div>
          ))}
        </div>
      )}
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
      },
      { label: "NOI YoY", value: formatYoY(kpis.noiYoY) },

      {
        label: "Revenue",
        value: formatCurrency(kpis.revenue),
      },
      { label: "Revenue YoY", value: formatYoY(kpis.revenueYoY) },

      { label: "NOI Margin", value: formatPercent(kpis.noiMargin) },
      { label: "Renewal Rate", value: formatPercent(riskAlert?.renewalRate) },
      { label: "Expense Ratio", value: formatPercent(kpis.expenseRatio) },
      { label: "Expense YoY", value: formatYoY(kpis.expenseYoY) },
      { label: "Loss to Lease", value: formatPercent(kpis.lossToLease) },
      { label: "Mark-to-Market", value: formatCurrency(kpis.markToMarket) },
    ];
  }, [record]);

  const rentComparisonList = record?.property_response?.rentComparison ?? [];
  const priceGap = useMemo(() => {
    if (!rentComparisonList.length) {
      return undefined;
    }

    const gap = rentComparisonList.reduce(
      (acc, entry) => acc + ((entry.market ?? 0) - (entry.inPlace ?? 0)),
      0
    );
    return gap / rentComparisonList.length;
  }, [rentComparisonList]);

  const reviewDetails = record?.property_response?.intelligence?.reviewIntelligence;
  const riskAlert = record?.property_response?.intelligence?.riskAlert;
  const marketMomentum = record?.property_response?.intelligence?.marketMomentum;
  const propertyMeta = record?.property_response?.property;
  const yearBuilt = propertyMeta?.yearBuilt;

  const trends = record?.property_response?.trends;
  const noiTrend = trends?.noiTrend12Month ?? [];
  const revenueExpense = trends?.revenueVsExpense ?? [];
  const leaseData = record?.property_response?.leaseExpirationLadder ?? [];

  const leaseChartData = useMemo(() => {
    const entries = leaseData
      .filter((item): item is { month: string; units: number } => Boolean(item.month) && isValidNumber(item.units))
      .map((item) => ({ month: item.month, units: item.units }));

    if (!entries.length) {
      return null;
    }

    return {
      labels: entries.map((entry) => entry.month),
      datasets: [
        {
          label: "Expiring Units",
          data: entries.map((entry) => entry.units),
          backgroundColor: "#a974be",
          borderRadius: 8,
        },
      ],
    };
  }, [leaseData]);

  const rentComparisonEntries = useMemo(() => {
    return rentComparisonList
      .filter(
        (entry) =>
          Boolean(entry.unitType) &&
          isValidNumber(entry.market) &&
          isValidNumber(entry.inPlace)
      )
      .map((entry) => ({
        unitType: entry.unitType ?? "Unknown",
        market: entry.market ?? 0,
        inPlace: entry.inPlace ?? 0,
      }));
  }, [rentComparisonList]);

  const rentComparisonChartData = useMemo(() => {
    if (!rentComparisonEntries.length) {
      return null;
    }

    return {
      labels: rentComparisonEntries.map((entry) => entry.unitType),
      datasets: [
        {
          label: "In-Place",
          data: rentComparisonEntries.map((entry) => entry.inPlace),
          backgroundColor: "#0ea5e9",
          borderRadius: 6,
        },
        {
          label: "Market",
          data: rentComparisonEntries.map((entry) => entry.market),
          backgroundColor: "#f97316",
          borderRadius: 6,
        },
      ],
    };
  }, [rentComparisonEntries]);

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

              <h1 className="text-3xl font-semibold text-indigo-900">{record.property_name}</h1>
              <p className="text-sm text-pink-600">
                {record.submarket} - {record.region}
              </p>
            </div>
            <div className="text-right text-s text-black">
              <p>
                Units: {record.property_response?.property?.units ?? "-"}{" "}
                {yearBuilt ? `- Built ${yearBuilt}` : ""}
              </p>
              <p className="text-right text-s text-blue-600">{propertyMeta?.location ?? "-"}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpiCards.map((card) => (
              <div key={card.label} className="space-y-1 rounded-3xl border border-slate-100 bg-blue-50/50 p-4">
                <p className="text-s font-semibold uppercase tracking-wide text-center text-blue-700">{card.label}</p>
                <p className="text-xl font-semibold text-center text-slate-900">{card.value}</p>
                {/* {card.annotation ? <p className="text-xs text-emerald-600">{card.annotation}</p> : null} */}
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

          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lease Expiration Ladder</h3>
              </div>
              {leaseChartData ? (
                <div className="mt-4 h-72">
                  <Bar data={leaseChartData} options={baseBarOptions} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">No lease ladder data available</p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  In-Place vs Market Rent
                </h3>
              </div>
              {rentComparisonChartData ? (
                <div className="mt-4 h-72">
                  <Bar data={rentComparisonChartData} options={baseBarOptions} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">Rent comparison unavailable</p>
              )}
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
