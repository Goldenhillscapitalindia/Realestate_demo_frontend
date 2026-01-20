export type RawMarketRadarItem = {
  region?: string;
  submarket?: string;
  submarketname?: string;
  market_pulse?: string;
  marketPulse?: string;
  pulse?: string;
  latitude?: number | string;
  longitude?: number | string;
  lat?: number | string;
  lng?: number | string;
  coordinates?: {
    latitude?: number | string;
    longitude?: number | string;
    lat?: number | string;
    lng?: number | string;
    lattitude?: number | string;
    langitude?: number | string;
  };
};

export type MarketRadarItem = {
  region: string;
  submarket: string;
  marketPulse: string;
  latitude: number;
  longitude: number;
};
