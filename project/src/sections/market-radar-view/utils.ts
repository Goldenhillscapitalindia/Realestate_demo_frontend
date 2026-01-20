import { EMPTY_VIEW_DATA } from "./constants";
import type {
  HealthIndicator,
  MarketRadarApiResponse,
  MarketRadarViewData,
  TrendCard,
} from "./types";

export const buildViewData = (
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

export const normalizeApiPayload = (
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
        ? payload.header.status_tag.charAt(0).toUpperCase() +
          payload.header.status_tag.slice(1).toLowerCase()
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
