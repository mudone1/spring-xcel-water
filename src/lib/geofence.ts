import { GeoConfig } from "@/types";

const GEO_CFG_KEY = "xcel_geo_cfg";

export function geoLoadConfig(): GeoConfig {
  if (typeof window === "undefined") return { lat: null, lng: null, radius: 200 };
  try {
    const raw = window.localStorage.getItem(GEO_CFG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt config */
  }
  return { lat: null, lng: null, radius: 200 };
}

export function geoSaveConfig(cfg: GeoConfig) {
  try {
    window.localStorage.setItem(GEO_CFG_KEY, JSON.stringify(cfg));
  } catch {
    /* storage unavailable */
  }
}

// Haversine distance in meters — identical formula to the original app,
// so a "within 200m" check behaves exactly the same for existing staff.
export function geoDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type GeoResult =
  | { status: "ok"; distance: number }
  | { status: "not-configured" }
  | { status: "too-far"; distance: number }
  | { status: "error"; message: string };

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser does not support location services."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 12000,
      maximumAge: 0,
      enableHighAccuracy: true,
    });
  });
}

export async function checkGeofence(cfg: GeoConfig): Promise<GeoResult> {
  if (cfg.lat === null || cfg.lng === null) return { status: "not-configured" };
  try {
    const pos = await getCurrentPosition();
    const dist = geoDistance(pos.coords.latitude, pos.coords.longitude, cfg.lat, cfg.lng);
    if (dist <= (cfg.radius || 200)) return { status: "ok", distance: dist };
    return { status: "too-far", distance: dist };
  } catch (err) {
    const e = err as GeolocationPositionError | Error;
    let message = "Unable to determine your location.";
    if ("code" in e) {
      if (e.code === 1) message = "Location access was denied. Please allow location permission and try again.";
      else if (e.code === 2) message = "Location is unavailable. Check your GPS/network and try again.";
      else if (e.code === 3) message = "Location request timed out. Please try again.";
    } else if (e.message) {
      message = e.message;
    }
    return { status: "error", message };
  }
}
