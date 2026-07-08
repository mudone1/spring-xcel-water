"use client";

import { useState } from "react";
import { IconArrowRight, IconAlertCircle, IconMapPin } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/authStore";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { attemptLogin, loginError } = useAuthStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await attemptLogin(username, password);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-sbBg"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 55% 60% at 68% 50%, #1a3825 0%, transparent 68%)",
      }}
    >
      <div className="m-4 flex w-full max-w-[860px] overflow-hidden rounded-rXl shadow-[0_28px_90px_rgba(0,0,0,.55)]">
        {/* Brand panel */}
        <div
          className="flex flex-1 flex-col justify-between border-r border-sbBrd p-12"
          style={{ background: "linear-gradient(155deg,#0e2a50 0%,#05101e 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-lg text-white shadow-[0_4px_14px_rgba(0,0,0,.35)]"
              style={{ background: "linear-gradient(135deg,#1a5fcb,#0a2d80)" }}
            >
              SX
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight text-[#d0e8ff]">SPRING XCEL WATER</div>
              <div className="text-[11px] text-sbMuted">Operations Portal</div>
            </div>
          </div>
          <div className="my-auto">
            <h1 className="mb-2.5 text-[30px] font-semibold leading-snug text-[#d0e8ff]">
              Spring Xcel
              <br />
              Water Portal
            </h1>
            <p className="max-w-[240px] text-[13px] leading-[1.75] text-sbText">
              Production, sales, inventory and expenses — protected from staff view.
            </p>
          </div>
          <div className="text-[10px] text-sbMuted">© 2026 Spring Xcel Water</div>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="flex w-[330px] flex-col justify-center bg-surf p-12">
          <h2 className="mb-1 text-[19px] font-semibold text-txt">Sign in</h2>
          <p className="mb-7 text-[13px] text-txt2">Enter your credentials to continue</p>

          {loginError && (
            <div className="mb-3 flex items-center gap-2 rounded-r bg-redL px-3 py-2 text-[12px] text-red">
              {loginError.includes("shift") ? <IconMapPin size={15} /> : <IconAlertCircle size={15} />}
              {loginError}
            </div>
          )}

          <div className="mb-3.5">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-txt3">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your username"
              autoComplete="username"
              className="w-full rounded-r border-[1.5px] border-brd bg-surf2 px-3 py-2.5 text-[13px] text-txt outline-none focus:border-grnM focus:bg-surf"
            />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-txt3">
              PIN
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              autoComplete="current-password"
              className="w-full rounded-r border-[1.5px] border-brd bg-surf2 px-3 py-2.5 text-[13px] text-txt outline-none focus:border-grnM focus:bg-surf"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-1.5 rounded-r bg-grn px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#0a2d80] disabled:opacity-60"
          >
            <IconArrowRight size={16} /> {submitting ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
