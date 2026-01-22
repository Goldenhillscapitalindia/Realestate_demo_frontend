import type { MarketRadarViewData } from "./types";

export const EMPTY_VIEW_DATA: MarketRadarViewData = {
  sub_market_name: "",
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

export const PULSE_STYLES: Record<
  MarketRadarViewData["pulseKey"],
  { dot: string; glow: string; label: string }
> = {
  strong: { dot: "#2ED573", glow: "rgba(46, 213, 115, 0.45)", label: "Strong" },
  improving: { dot: "#21C7D9", glow: "rgba(33, 199, 217, 0.45)", label: "Improving" },
  mixed: { dot: "#F4B740", glow: "rgba(244, 183, 64, 0.45)", label: "Mixed" },
  weakening: { dot: "#FF5A4A", glow: "rgba(255, 90, 74, 0.45)", label: "Weakening" },
};
