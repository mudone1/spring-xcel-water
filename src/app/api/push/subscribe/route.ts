import { NextRequest, NextResponse } from "next/server";
import { fsCol, fsAddDoc, fsGetDocs } from "@/lib/firebase";
import { query, where, deleteDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { userId, subscription } = await req.json();
    if (!userId || !subscription?.endpoint) {
      return NextResponse.json({ error: "Missing userId or subscription" }, { status: 400 });
    }

    const col = fsCol("pushSubscriptions");
    // Replace any existing subscription for this exact endpoint (device) so
    // re-subscribing doesn't create duplicate rows and duplicate pushes.
    const existing = await fsGetDocs(query(col, where("endpoint", "==", subscription.endpoint)));
    await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)));

    await fsAddDoc(col, {
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("push subscribe error:", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
