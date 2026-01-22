import { EMPTY_VIEW_DATA } from "./constants";
import type {
  HealthIndicator,
  MarketRadarApiResponse,
  MarketRadarApiWrapper,
  MarketRadarViewData,
  TrendCard,
} from "./types";

export const buildViewData = (
  payload: Partial<MarketRadarViewData> | null,
  sub_market_name: string
): MarketRadarViewData => {
  const safePayload = payload ?? {};
  return {
    ...EMPTY_VIEW_DATA,
    ...safePayload,
    sub_market_name: safePayload.sub_market_name ?? sub_market_name ?? EMPTY_VIEW_DATA.sub_market_name,
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

const normalizesub_market_name = (value: string) => value.trim().toLowerCase();

const extractAnswer = (
  payload: MarketRadarApiResponse | MarketRadarApiWrapper
): MarketRadarApiResponse | null => {
  if ("market_radar_resp" in payload && payload.market_radar_resp?.answer?.length) {
    return payload.market_radar_resp.answer[0];
  }
  return payload as MarketRadarApiResponse;
};

const resolvePayload = (
  payload: MarketRadarApiResponse | MarketRadarApiWrapper | MarketRadarApiWrapper[] | null,
  sub_market_nameParam: string
): { answer: MarketRadarApiResponse | null; wrapper?: MarketRadarApiWrapper | null } => {
  if (!payload) return { answer: null, wrapper: null };
  if (Array.isArray(payload)) {
    const normalizedParam = normalizesub_market_name(sub_market_nameParam);
    const match = payload.find((item) => {
      const candidate =
        item.sub_market_name ??
        item.market_radar_resp?.answer?.[0]?.header?.sub_market_name ??
        item.market_radar_resp?.answer?.[0]?.header?.submarket ??
        "";
      return normalizesub_market_name(String(candidate)) === normalizedParam;
    });
    const wrapper = match ?? payload[0];
    return { answer: extractAnswer(wrapper), wrapper };
  }
  if ("market_radar_resp" in payload) {
    return { answer: extractAnswer(payload), wrapper: payload };
  }
  return { answer: extractAnswer(payload) };
};

const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "not available" || trimmed.toLowerCase() === "na") {
    return null;
  }
  const parsed = Number(trimmed.replace(/[% ,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const formatPercent = (value: number | null): string =>
  value === null ? "N/A" : `${value.toFixed(1)}%`;

const formatUnits = (value: number | null): string =>
  value === null ? "N/A" : value.toLocaleString();

export const normalizeApiPayload = (
  payload: MarketRadarApiResponse | MarketRadarApiWrapper | MarketRadarApiWrapper[] | null,
  sub_market_nameParam: string
): MarketRadarViewData => {
  const resolved = resolvePayload(payload, sub_market_nameParam);
  if (!resolved.answer) return buildViewData(null, sub_market_nameParam);
  const { answer, wrapper } = resolved;
  const status = answer.header?.status_tag?.toLowerCase();
  const pulseKey =
    status === "strong" || status === "improving" || status === "mixed" || status === "weakening"
      ? status
      : undefined;

  const resolveIndicatorColor = (score?: number): string => {
    const value = typeof score === "number" ? score : 0;
    if (value < 4) return "#FF5A4A";
    if (value < 7) return "#4070f4ff";
    return "#0aaf4fff";
  };

  const healthIndicators: HealthIndicator[] = answer.market_health_indicators
    ? [
        {
          label: "Demand Strength",
          score: answer.market_health_indicators?.demand_strength?.score ?? 0,
          color: resolveIndicatorColor(answer.market_health_indicators?.demand_strength?.score),
          direction: answer.market_health_indicators?.demand_strength?.direction ?? "",
          explanation: answer.market_health_indicators?.demand_strength?.explanation ?? [],
        },
        {
          label: "Supply Risk",
          score: answer.market_health_indicators?.supply_risk?.score ?? 0,
          color: resolveIndicatorColor(answer.market_health_indicators?.supply_risk?.score),
          direction: answer.market_health_indicators?.supply_risk?.direction ?? "",
          explanation: answer.market_health_indicators?.supply_risk?.explanation ?? [],
        },
        {
          label: "Vacancy Pressure",
          score: answer.market_health_indicators?.vacancy_pressure?.score ?? 0,
          color: resolveIndicatorColor(answer.market_health_indicators?.vacancy_pressure?.score),
          direction: answer.market_health_indicators?.vacancy_pressure?.direction ?? "",
          explanation: answer.market_health_indicators?.vacancy_pressure?.explanation ?? [],
        },
        {
          label: "Capital Liquidity",
          score: answer.market_health_indicators?.capital_liquidity?.score ?? 0,
          color: resolveIndicatorColor(answer.market_health_indicators?.capital_liquidity?.score),
          direction: answer.market_health_indicators?.capital_liquidity?.direction ?? "",
          explanation: answer.market_health_indicators?.capital_liquidity?.explanation ?? [],
        },
      ]
    : [];

  const keyTrends: TrendCard[] = answer.key_trends
    ? (() => {
        const rentGrowthComparison = answer.key_trends?.rent_growth_comparison;
        const absorptionVsDeliveries = answer.key_trends?.absorption_vs_deliveries;
        const vacancyTrendValue = parseNumber(
          answer.key_trends?.vacancy_trend_12m_pct_pts ?? answer.key_trends?.vacancy_trend_12m
        );

        const hasStructuredData =
          Boolean(rentGrowthComparison) ||
          Boolean(absorptionVsDeliveries) ||
          answer.key_trends?.vacancy_trend_12m_pct_pts !== undefined;

        if (hasStructuredData) {
          const rentYoy = parseNumber(rentGrowthComparison?.rent_growth_yoy_pct);
          const rentAvg = parseNumber(rentGrowthComparison?.rent_growth_5yr_avg_pct);
          const rentHasData = rentYoy !== null || rentAvg !== null;

          const delivered = parseNumber(absorptionVsDeliveries?.delivered_12m_units);
          const absorbed = parseNumber(absorptionVsDeliveries?.absorption_12m_units);
          const absorptionHasData = delivered !== null || absorbed !== null;

          const vacancySeries = (() => {
            if (vacancyTrendValue === null) return [];
            const step = Math.max(Math.abs(vacancyTrendValue) * 0.15, 0.4);
            const direction = vacancyTrendValue >= 0 ? 1 : -1;
            const base = vacancyTrendValue;
            return [
              base - direction * step * 3,
              base - direction * step * 2,
              base - direction * step,
              base,
            ];
          })();

          return [
            {
              label: "Rent Growth vs 5-Yr Avg",
              delta: `YoY ${formatPercent(rentYoy)}`,
              deltaValue: rentYoy,
              data: rentHasData ? [rentYoy ?? 0, rentAvg ?? 0] : [],
              labels: ["YoY", "5-Yr Avg"],
              color: "#f7813cff",
              chartType: "bar",
            },
            {
              label: "Absorption Trend",
              delta: `Absorbed ${formatUnits(absorbed)}`,
              deltaValue: absorbed,
              data: absorptionHasData ? [absorbed ?? 0, delivered ?? 0] : [],
              labels: ["Absorbed", "Delivered"],
              color: "#a853daff",
              chartType: "bar",
            },
            {
              label: "Vacancy Trend (12M)",
              delta: vacancyTrendValue === null ? "N/A" : `${vacancyTrendValue.toFixed(1)} pts`,
              deltaValue: vacancyTrendValue,
              data: vacancySeries,
              labels: vacancySeries.length ? ["Q1", "Q2", "Q3", "Now"] : [],
              color: "#2ED573",
              chartType: "line",
            },
          ];
        }

        return [
          {
            label: "Vacancy Trend (12M)",
            delta: answer.key_trends?.vacancy_trend_12m ?? "",
            data: [],
            color: "#2ED573",
          },
          {
            label: "Rent Growth vs 5-Yr Avg",
            delta: answer.key_trends?.rent_growth_vs_5yr_avg ?? "",
            data: [],
            color: "#21C7D9",
          },
          {
            label: "Absorption Trend",
            delta: answer.key_trends?.absorption_trend ?? "",
            data: [],
            color: "#21C7D9",
          },
        ];
      })()
    : [];

  return buildViewData(
    {
      sub_market_name:
        wrapper?.sub_market_name ??
        answer.header?.sub_market_name ??
        answer.header?.submarket,
      region: wrapper?.region ?? answer.header?.metro,
      pulseLabel: answer.header?.status_tag
        ? answer.header.status_tag.charAt(0).toUpperCase() +
          answer.header.status_tag.slice(1).toLowerCase()
        : undefined,
      pulseKey,
      healthIndicators,
      keyTrends,
      supplyDemand: {
        ratio: answer.supply_demand_balance?.demand_supply_ratio ?? 0,
        insight: answer.supply_demand_balance?.ai_insight ?? "",
      },
      vacancyDynamics: {
        currentVacancy: answer.vacancy_dynamics?.current_vacancy ?? "",
        yoyChange: answer.vacancy_dynamics?.yoy_change ?? "",
        narrative: answer.vacancy_dynamics?.ai_insight ?? "",
      },
      rentPerformance: {
        avgAsking: answer.rent_performance?.avg_asking_rent ?? "",
        growthYoy: answer.rent_performance?.rent_growth_yoy ?? "",
        fiveYearAvg: answer.rent_performance?.rent_growth_5yr_avg ?? "",
        narrative: answer.rent_performance?.ai_insight ?? "",
      },
      supplyPipeline: {
        underConstruction: answer.supply_pipeline_risk?.under_construction_pct_inventory ?? "",
        narrative: answer.supply_pipeline_risk?.ai_insight ?? "",
      },
      capitalMarkets: {
        capRate: answer.capital_markets_health?.cap_rate ?? "",
        spread: answer.capital_markets_health?.cap_rate_spread_vs_metro ?? "",
        salesVolume: answer.capital_markets_health?.sales_volume_12m ?? "",
        fiveYearAvgVolume: answer.capital_markets_health?.sales_volume_5yr_avg ?? "",
        pricePerUnit: answer.capital_markets_health?.price_per_unit ?? "",
        leasedAtSale: answer.capital_markets_health?.pct_leased_at_sale ?? "",
        narrative: answer.capital_markets_health?.ai_insight ?? "",
      },
      aiOutcome: {
        confidence: answer.ai_expected_market_outcome?.confidence_level
          ? `${answer.ai_expected_market_outcome.confidence_level} Confidence`
          : "",
        upside: {
          vacancy: answer.ai_expected_market_outcome?.upside?.vacancy ?? "",
          rentGrowth: answer.ai_expected_market_outcome?.upside?.rent_growth ?? "",
          absorptionDelta: answer.ai_expected_market_outcome?.upside?.absorption_delta ?? "",
        },
        base: {
          vacancy: answer.ai_expected_market_outcome?.base?.vacancy ?? "",
          rentGrowth: answer.ai_expected_market_outcome?.base?.rent_growth ?? "",
          absorptionDelta: answer.ai_expected_market_outcome?.base?.absorption_delta ?? "",
        },
        downside: {
          vacancy: answer.ai_expected_market_outcome?.downside?.vacancy ?? "",
          rentGrowth: answer.ai_expected_market_outcome?.downside?.rent_growth ?? "",
          absorptionDelta: answer.ai_expected_market_outcome?.downside?.absorption_delta ?? "",
        },
      },
      decisionSupport: {
        positives: answer.decision_support?.positives ?? [],
        negatives: answer.decision_support?.negatives ?? [],
        watch: answer.decision_support?.what_to_watch ?? [],
      },
    },
    sub_market_nameParam
  );
};
