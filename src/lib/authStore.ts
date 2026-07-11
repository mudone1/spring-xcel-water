import { create } from "zustand";
import { AppUser } from "@/types";
import { loadUsers } from "./users";
import { defaultPermsForJobRole, fullPermissions, hasGeoBypass, AUTO_SIGNOUT_HOUR } from "./permissions";
import { hasCompletedShiftToday, signInAttendance } from "./attendance";

export type GeoStep = "idle" | "checking" | "ok" | "fail" | "not-configured";

interface AuthState {
  currentUser: AppUser | null;
  pendingUser: AppUser | null;
  loginError: string | null;
  geoOverlayOpen: boolean;
  geoStep: GeoStep;
  geoMessage: string;
  geoAllowBypass: boolean;
  attemptLogin: (username: string, password: string) => Promise<void>;
  cancelGeo: () => void;
  bypassGeo: () => Promise<void>;
  finaliseLogin: (user: AppUser) => Promise<void>;
  setGeoState: (step: GeoStep, message: string, allowBypass?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  pendingUser: null,
  loginError: null,
  geoOverlayOpen: false,
  geoStep: "idle",
  geoMessage: "",
  geoAllowBypass: false,

  setGeoState: (step, message, allowBypass = false) =>
    set({ geoStep: step, geoMessage: message, geoAllowBypass: allowBypass }),

  // Ported from doLogin(): credential check -> already-completed-shift guard
  // -> after-hours bypass -> geofence overlay.
  attemptLogin: async (username, password) => {
    set({ loginError: null });

    let users;
    try {
      users = await loadUsers();
    } catch (err) {
      console.error("Failed to load users from Firestore:", err);
      const msg = err instanceof Error ? err.message : String(err);
      set({
        loginError:
          `Could not reach Firebase (${msg}). Check your .env.local Firebase values, ` +
          `internet connection, and Firestore security rules.`,
      });
      return;
    }

    const u = username.trim().toLowerCase();
    const user = users.find((x) => x.username === u && x.password === password && x.active);

    if (!user) {
      set({ loginError: "Incorrect username or PIN." });
      return;
    }

    set({ pendingUser: user });

    const isAfterHours = new Date().getHours() >= AUTO_SIGNOUT_HOUR;
    const bypass = hasGeoBypass(user);

    if (user.role === "staff" && !bypass) {
      const done = await hasCompletedShiftToday(user.id);
      if (done) {
        set({ loginError: "You have already completed your shift today. Sign-in resumes tomorrow." });
        return;
      }
    }

    if (isAfterHours && bypass) {
      await get().finaliseLogin(user);
      return;
    }

    // Show geofence overlay and run the check.
    set({ geoOverlayOpen: true, geoStep: "checking", geoMessage: "Please allow location access when prompted…" });
  },

  cancelGeo: () => set({ geoOverlayOpen: false, pendingUser: null, geoStep: "idle" }),

  bypassGeo: async () => {
    const { pendingUser } = get();
    set({ geoOverlayOpen: false });
    if (pendingUser) await get().finaliseLogin(pendingUser);
  },

  // Ported from finaliseLogin(): builds permissions, signs the user in.
  finaliseLogin: async (user) => {
    let resolvedUser = user;
    if (user.role === "admin" || user.role === "manager") {
      resolvedUser = { ...user, permissions: fullPermissions() };
    } else if (!user.permissions) {
      resolvedUser = { ...user, permissions: defaultPermsForJobRole(user.jobRole || "sales") };
    }
    set({ currentUser: resolvedUser, pendingUser: null, geoOverlayOpen: false, loginError: null });
    signInAttendance(resolvedUser.id).catch((e) => console.warn("attendance sign-in failed:", e));
  },

  logout: () => set({ currentUser: null, pendingUser: null }),
}));