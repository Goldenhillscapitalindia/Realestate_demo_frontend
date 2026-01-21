export type HealthIndicator = {
  label: string;
  score: number;
  color: string;
  direction?: string;
  explanation?: string[];
};

export type TrendCard = {
  label: string;
  delta: string;
  data: number[];
  color: string;
};

export type MarketRadarViewData = {
  sub_market_name: string;
  region: string;
  pulseLabel: string;
  pulseKey: "strong" | "improving" | "mixed" | "weakening";
  healthIndicators: HealthIndicator[];
  keyTrends: TrendCard[];
  supplyDemand: {
    ratio: number | string;
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

export type MarketRadarApiResponse = {
  header?: {
    sub_market_name?: string;
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

export type MarketRadarApiWrapper = {
  sub_market_name?: string;
  region?: string;
  market_radar_resp?: {
    answer?: MarketRadarApiResponse[];
  };
};
