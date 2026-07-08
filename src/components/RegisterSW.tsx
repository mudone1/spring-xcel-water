"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/push";

export default function RegisterSW() {
  useEffect(() => {
    registerServiceWorker().catch((e) => console.warn("SW registration failed:", e));
  }, []);
  return null;
}
