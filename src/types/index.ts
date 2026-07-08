export type Role = "admin" | "manager" | "staff";
export type JobRole = "supervisor" | "manager" | "driver" | "operator" | "sales";

export interface Permissions {
  pages: Record<string, boolean>;
  actions: Record<string, boolean>;
}

export interface AppUser {
  id: number;
  _fbId?: string;
  username: string;
  password: string;
  name: string;
  role: Role;
  jobRole?: JobRole;
  active: boolean;
  permissions?: Permissions;
}

export interface AttendanceRecord {
  id: number;
  _fbId?: string;
  userId: number;
  date: string; // YYYY-MM-DD
  signIn: string; // ISO
  signOut?: string; // ISO
}

export interface PageDef {
  key: string;
  label: string;
  icon: string;
}

export interface ActionDef {
  key: string;
  label: string;
  icon: string;
}

export interface GeoConfig {
  lat: number | null;
  lng: number | null;
  radius: number;
}
