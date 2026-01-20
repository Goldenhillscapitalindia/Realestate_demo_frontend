import type { MarketRadarItem, RawMarketRadarItem } from "./types";

export const normalizePulseKey = (value: string) => value.toLowerCase().trim();

export const normalizeItems = (items: RawMarketRadarItem[]): MarketRadarItem[] =>
  items
    .map((item) => {
      const latitude =
        item.latitude ??
        item.lat ??
        item.coordinates?.latitude ??
        item.coordinates?.lat ??
        item.coordinates?.lattitude;
      const longitude =
        item.longitude ??
        item.lng ??
        item.coordinates?.longitude ??
        item.coordinates?.lng ??
        item.coordinates?.langitude;

      return {
        region: String(item.region ?? "Unknown"),
        submarket: String(item.submarket ?? item.submarketname ?? "Unknown"),
        marketPulse: String(item.market_pulse ?? item.marketPulse ?? item.pulse ?? "Mixed"),
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    })
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
