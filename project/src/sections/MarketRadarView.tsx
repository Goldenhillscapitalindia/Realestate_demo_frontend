import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import VacancyRentSupplyGrid from "./market-radar-view/components/VacancyRentSupplyGrid";

const MarketRadarView: React.FC = () => {
  const { sub_market_name = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const region = (location.state as { region?: string } | null)?.region ?? "";
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
        const response = await axios.post(`${API_URL}/api/get_market_radar_data/`, {
          sub_market_name,
          region,
          fetch: "specific" ,

        });
        const payload = response.data?.data ?? response.data;
        if (!active) return;
        setData(normalizeApiPayload(payload, sub_market_name));
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
  }, [API_URL, sub_market_name, region]);

  const viewData = useMemo(
    () => buildViewData(data, sub_market_name),
    [data, sub_market_name]
  );

  const pulseStyle = PULSE_STYLES[viewData.pulseKey];

  return (
    <section
      className="min-h-screen px-6 py-10 text-slate-900"
      style={{
        background:
          "linear-gradient(180deg, rgba(248,250,255,1) 0%, rgba(240,244,255,1) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <MarketRadarViewHeader
          sub_market_name={viewData.sub_market_name}
          region={viewData.region}
          pulseLabel={viewData.pulseLabel}
          pulseDot={pulseStyle.dot}
          onBack={() => navigate(-1)}
        />
        <HealthIndicatorsSection indicators={viewData.healthIndicators} />
        <KeyTrendsSection trends={viewData.keyTrends} />
        <VacancyRentSupplyGrid
          supplyDemand={viewData.supplyDemand}
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
