"use client";

import { useAuthStore } from "@/lib/authStore";
import LoginScreen from "@/components/LoginScreen";
import GeofenceOverlay from "@/components/GeofenceOverlay";
import AppShell from "@/components/AppShell";

export default function Home() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <>
      {currentUser ? <AppShell /> : <LoginScreen />}
      <GeofenceOverlay />
    </>
  );
}
