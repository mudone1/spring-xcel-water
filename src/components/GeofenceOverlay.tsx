"use client";

import { useEffect } from "react";
import { IconMapPin, IconCircleCheck, IconMapPinOff, IconRefresh, IconArrowLeft } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/authStore";
import { checkGeofence, geoLoadConfig } from "@/lib/geofence";
import { hasGeoBypass } from "@/lib/permissions";

export default function GeofenceOverlay() {
  const {
    geoOverlayOpen,
    geoStep,
    geoMessage,
    geoAllowBypass,
    pendingUser,
    setGeoState,
    cancelGeo,
    bypassGeo,
    finaliseLogin,
  } = useAuthStore();

  async function runCheck() {
    setGeoState("checking", "Please allow location access when prompted…");
    const cfg = geoLoadConfig();
    const result = await checkGeofence(cfg);

    if (result.status === "ok") {
      setGeoState("ok", "You are at the store. Signing you in…");
      setTimeout(() => {
        if (pendingUser) finaliseLogin(pendingUser);
      }, 900);
      return;
    }

    if (result.status === "not-configured") {
      if (pendingUser && hasGeoBypass(pendingUser)) {
        setGeoState("ok", "You are at the store. Signing you in…");
        setTimeout(() => pendingUser && finaliseLogin(pendingUser), 900);
        return;
      }
      setGeoState(
        "fail",
        "The store location has not been configured yet. Please ask your admin to set it up.",
        false
      );
      return;
    }

    if (result.status === "too-far") {
      setGeoState(
        "fail",
        `You are too far from the store (${Math.round(result.distance)} m away). Please move closer to sign in.`,
        true
      );
      return;
    }

    setGeoState("fail", result.message, true);
  }

  useEffect(() => {
    if (geoOverlayOpen && geoStep === "checking" && geoMessage === "Please allow location access when prompted…") {
      runCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoOverlayOpen]);

  if (!geoOverlayOpen) return null;

  const showBypass = geoStep === "fail" && geoAllowBypass && pendingUser && hasGeoBypass(pendingUser);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[320px] rounded-rXl bg-surf p-8 text-center shadow-2xl">
        <div
          className={
            "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl " +
            (geoStep === "ok"
              ? "bg-grnL text-grn"
              : geoStep === "fail"
              ? "bg-redL text-red"
              : "bg-grnXl text-grnM animate-pulse")
          }
        >
          {geoStep === "ok" ? <IconCircleCheck size={32} /> : geoStep === "fail" ? <IconMapPinOff size={32} /> : <IconMapPin size={32} />}
        </div>
        <div className="mb-1 text-[15px] font-semibold text-txt">
          {geoStep === "ok" ? "Location Confirmed ✓" : geoStep === "fail" ? "Location Check Failed" : "Verifying Location"}
        </div>
        <p className="mb-4 text-[13px] text-txt2">{geoMessage}</p>

        {geoStep === "fail" && (
          <>
            <button
              onClick={runCheck}
              className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-r border border-brd bg-surf px-4 py-2 text-[13px] font-medium text-txt hover:bg-surf2"
            >
              <IconRefresh size={16} /> Try Again
            </button>
            <button
              onClick={cancelGeo}
              className="flex w-full items-center justify-center gap-1.5 rounded-r border border-sbBrd px-4 py-2 text-[13px] text-sbText hover:bg-sbAct hover:text-white"
            >
              <IconArrowLeft size={16} /> Back to Login
            </button>
            {showBypass && (
              <div
                onClick={bypassGeo}
                className="mt-3 cursor-pointer text-[11px] text-txt3 underline hover:text-grnM"
              >
                Admin: bypass location check
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
