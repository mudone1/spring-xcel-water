import { AppUser } from "@/types";
import { COLLECTIONS, fsCol, fsGetDocs } from "./firebase";

let usersPromise: Promise<AppUser[]> | null = null;

// Pulls every staff account from Firestore's `users` collection. Throws on
// failure (bad config, network, or Firestore security rules blocking the
// read) instead of silently returning an empty list — that way a connection
// problem surfaces as a clear error, not a confusing "wrong password."
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
  usersPromise.catch(() => {
    usersPromise = null; // don't cache a failed fetch — let the next attempt retry
  });
  return usersPromise;
}

// Call after creating/editing a user so the next loadUsers() call re-fetches.
export function invalidateUsersCache() {
  usersPromise = null;
}