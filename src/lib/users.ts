import { AppUser } from "@/types";
import { COLLECTIONS, fsCol, fsGetDocs } from "./firebase";

let usersPromise: Promise<AppUser[]> | null = null;

// Mirrors the original loadUsersFromFirebase(): fetches every staff account
// so a brand-new user created on another device can sign in immediately.
export function loadUsers(): Promise<AppUser[]> {
  if (usersPromise) return usersPromise;
  usersPromise = (async () => {
    const snap = await fsGetDocs(fsCol(COLLECTIONS.users));
    const users: AppUser[] = [];
    snap.forEach((d) => {
      users.push({ ...(d.data() as AppUser), _fbId: d.id });
    });
    return users;
  })();
  return usersPromise;
}

// Call after creating/editing a user so the next loadUsers() call re-fetches.
export function invalidateUsersCache() {
  usersPromise = null;
}
