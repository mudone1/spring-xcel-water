"use client";

import { useState } from "react";
import { IconBell, IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/authStore";
import { ALL_PAGES, canAccess } from "@/lib/permissions";
import { subscribeToPush } from "@/lib/push";

export default function AppShell() {
  const { currentUser, logout } = useAuthStore();
  const [activePage, setActivePage] = useState("sale");
  const [notifStatus, setNotifStatus] = useState<"idle" | "on" | "denied">("idle");

  if (!currentUser) return null;

  const visiblePages = ALL_PAGES.filter((p) => canAccess(currentUser, p.key));
  const roleLabel = currentUser.role === "admin" ? "Owner" : currentUser.role === "manager" ? "Manager" : "Staff";

  async function enableNotifications() {
    const ok = await subscribeToPush(currentUser!.id);
    setNotifStatus(ok ? "on" : "denied");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-txt">
      {/* Sidebar */}
      <aside className="flex w-[220px] flex-shrink-0 flex-col bg-sbBg text-sbText">
        <div className="border-b border-sbBrd px-4 py-4 text-sm font-semibold text-[#d0e8ff]">
          SPRING XCEL WATER
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {visiblePages.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={
                "block w-full px-4 py-2.5 text-left text-[13px] transition " +
                (activePage === p.key ? "bg-sbAct text-white" : "hover:bg-sbSurf")
              }
            >
              {p.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-brd bg-surf px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grnL text-[13px] font-bold text-grn">
              {currentUser.name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-[13px] font-medium">{currentUser.name}</div>
              <div className="text-[10px] uppercase tracking-wide text-txt3">{roleLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={enableNotifications}
              className="flex items-center gap-1.5 rounded-r border border-brd px-3 py-1.5 text-[12px] text-txt2 hover:bg-surf2"
              title="Enable push notifications"
            >
              <IconBell size={15} />
              {notifStatus === "on" ? "Notifications on" : notifStatus === "denied" ? "Blocked" : "Enable alerts"}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-r border border-brd px-3 py-1.5 text-[12px] text-txt2 hover:bg-surf2"
            >
              <IconLogout size={15} /> Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="rounded-rLg border border-dashed border-brd2 bg-surf p-8 text-center text-txt3">
            <div className="mb-1 text-[14px] font-medium text-txt2">
              {ALL_PAGES.find((p) => p.key === activePage)?.label}
            </div>
            <div className="text-[12px]">This module ships in the next build phase.</div>
          </div>
        </main>
      </div>
    </div>
  );
}
