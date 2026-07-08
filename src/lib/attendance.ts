import { AttendanceRecord } from "@/types";
import { COLLECTIONS, fsAddDoc, fsCol, fsGetDocs } from "./firebase";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

// Ported from doLogin(): staff (without geo_bypass) are blocked from signing
// in again once they've completed a shift today.
export async function hasCompletedShiftToday(userId: number): Promise<boolean> {
  const snap = await fsGetDocs(fsCol(COLLECTIONS.attendance));
  const today = todayKey();
  let found = false;
  snap.forEach((d) => {
    const r = d.data() as AttendanceRecord;
    if (r.userId === userId && r.date === today && r.signOut) found = true;
  });
  return found;
}

// Ported from attSignIn(): only creates a new record if one isn't already
// open for today (avoids duplicate sign-ins across devices/tabs).
export async function signInAttendance(userId: number): Promise<void> {
  const snap = await fsGetDocs(fsCol(COLLECTIONS.attendance));
  const today = todayKey();
  let alreadyOpen = false;
  snap.forEach((d) => {
    const r = d.data() as AttendanceRecord;
    if (r.userId === userId && r.date === today && !r.signOut) alreadyOpen = true;
  });
  if (alreadyOpen) return;
  await fsAddDoc(fsCol(COLLECTIONS.attendance), {
    userId,
    date: today,
    signIn: new Date().toISOString(),
  });
}
