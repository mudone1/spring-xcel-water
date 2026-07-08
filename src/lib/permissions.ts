import { ActionDef, AppUser, JobRole, PageDef, Permissions } from "@/types";

export const AUTO_SIGNOUT_HOUR = 21; // 9pm, 24h clock

export const ALL_PAGES: PageDef[] = [
  { key: "sale", label: "Record sale", icon: "IconShoppingCart" },
  { key: "prod", label: "Log production", icon: "IconPackages" },
  { key: "rawmat", label: "Raw material inv.", icon: "IconBoxSeam" },
  { key: "exp", label: "Log expense", icon: "IconReceipt2" },
  { key: "mysales", label: "My sales", icon: "IconClockHour4" },
  { key: "prodcalc", label: "Prod Calculator", icon: "IconCalculator" },
  { key: "dash", label: "Dashboard", icon: "IconLayoutDashboard" },
  { key: "asales", label: "All sales", icon: "IconTable" },
  { key: "aprod", label: "All production", icon: "IconBuildingFactory2" },
  { key: "aexp", label: "All expenses", icon: "IconReportMoney" },
  { key: "users", label: "Manage staff", icon: "IconUsers" },
  { key: "att-admin", label: "Attendance log", icon: "IconCalendarStats" },
  { key: "geo-settings", label: "Store location", icon: "IconMapPinCog" },
  { key: "reset", label: "Reset system data", icon: "IconDatabaseX" },
];

export const ALL_ACTIONS: ActionDef[] = [
  { key: "void_sale", label: "Void / restore sales", icon: "IconBan" },
  { key: "delete_rec", label: "Delete records", icon: "IconTrash" },
  { key: "geo_bypass", label: "Bypass geofence", icon: "IconMapPinOff" },
  { key: "add_exp_cat", label: "Add expense categories", icon: "IconTag" },
  { key: "export_csv", label: "Export CSV", icon: "IconDownload" },
];

export const JOB_ROLE_DEFAULTS: Record<
  JobRole,
  { label: string; pages: string[]; actions: string[] }
> = {
  supervisor: {
    label: "Supervisor",
    pages: ["sale", "prod", "rawmat", "exp", "mysales", "dash", "asales", "aprod", "aexp", "att-admin"],
    actions: ["void_sale", "delete_rec", "export_csv", "add_exp_cat"],
  },
  manager: {
    label: "Manager",
    pages: [
      "sale", "prod", "rawmat", "exp", "mysales", "dash", "asales",
      "aprod", "aexp", "users", "att-admin", "geo-settings", "reset",
    ],
    actions: ["void_sale", "delete_rec", "geo_bypass", "add_exp_cat", "export_csv"],
  },
  driver: { label: "Driver", pages: ["sale", "mysales"], actions: [] },
  operator: { label: "Operator", pages: ["prod", "rawmat", "mysales"], actions: [] },
  sales: { label: "Sales Personnel", pages: ["sale", "exp", "mysales"], actions: ["export_csv"] },
};

export function defaultPermsForJobRole(jobRole: JobRole | string): Permissions {
  const def = JOB_ROLE_DEFAULTS[jobRole as JobRole] || JOB_ROLE_DEFAULTS.sales;
  const pages: Record<string, boolean> = {};
  ALL_PAGES.forEach((p) => (pages[p.key] = def.pages.includes(p.key)));
  const actions: Record<string, boolean> = {};
  ALL_ACTIONS.forEach((a) => (actions[a.key] = def.actions.includes(a.key)));
  return { pages, actions };
}

export function fullPermissions(): Permissions {
  const pages: Record<string, boolean> = {};
  ALL_PAGES.forEach((p) => (pages[p.key] = true));
  const actions: Record<string, boolean> = {};
  ALL_ACTIONS.forEach((a) => (actions[a.key] = true));
  return { pages, actions };
}

export function canAccess(user: AppUser | null, pageKey: string): boolean {
  return !!(user?.role === "admin" || user?.permissions?.pages?.[pageKey]);
}

export function canDo(user: AppUser | null, actionKey: string): boolean {
  return !!(user?.role === "admin" || user?.permissions?.actions?.[actionKey]);
}

export function hasGeoBypass(user: AppUser | null): boolean {
  return !!(user && (user.role !== "staff" || user.permissions?.actions?.["geo_bypass"]));
}
