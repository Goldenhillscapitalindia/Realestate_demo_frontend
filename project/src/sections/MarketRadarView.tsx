import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import type { MarketRadarViewData } from "./market-radar-view/types";
import { PULSE_STYLES } from "./market-radar-view/constants";
import { buildViewData, normalizeApiPayload } from "./market-radar-view/utils";
import AiOutcomeSection from "./market-radar-view/components/AiOutcomeSection";
import CapitalMarketsSection from "./market-radar-view/components/CapitalMarketsSection";
import DecisionSupportSection from "./market-radar-view/components/DecisionSupportSection";
import HealthIndicatorsSection from "./market-radar-view/components/HealthIndicatorsSection";
import KeyTrendsSection from "./market-radar-view/components/KeyTrendsSection";
import MarketRadarViewHeader from "./market-radar-view/components/MarketRadarViewHeader";
import StatusFooter from "./market-radar-view/components/StatusFooter";
import SupplyDemandCard from "./market-radar-view/components/SupplyDemandCard";
import VacancyRentSupplyGrid from "./market-radar-view/components/VacancyRentSupplyGrid";

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
        <MarketRadarViewHeader
          submarket={viewData.submarket}
          region={viewData.region}
          pulseLabel={viewData.pulseLabel}
          pulseDot={pulseStyle.dot}
          onBack={() => navigate(-1)}
        />
        <HealthIndicatorsSection indicators={viewData.healthIndicators} />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <KeyTrendsSection trends={viewData.keyTrends} />
          <SupplyDemandCard
            ratio={viewData.supplyDemand.ratio}
            insight={viewData.supplyDemand.insight}
          />
        </div>
        <VacancyRentSupplyGrid
          vacancy={viewData.vacancyDynamics}
          rent={viewData.rentPerformance}
          supply={viewData.supplyPipeline}
        />
        <CapitalMarketsSection data={viewData.capitalMarkets} />
        <AiOutcomeSection data={viewData.aiOutcome} />
        <DecisionSupportSection data={viewData.decisionSupport} />
        <StatusFooter loading={loading} error={error} />
      </div>
    </section>
  );
};

export default MarketRadarView;
