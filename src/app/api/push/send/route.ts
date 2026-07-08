import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { fsCol, fsGetDocs } from "@/lib/firebase";
import { query, where } from "firebase/firestore";

const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

if (vapidPublic && vapidPrivate) {
  webpush.setVapidDetails("mailto:admin@springxcelwater.com", vapidPublic, vapidPrivate);
}

interface PushSubDoc {
  userId: number;
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

// Body: { userId?: number, title, body, url? }
// If userId is omitted, sends to every subscribed device (broadcast).
export async function POST(req: NextRequest) {
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: "VAPID keys not configured on the server" }, { status: 500 });
  }

  try {
    const { userId, title, body, url } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ error: "title and body are required" }, { status: 400 });
    }

    const col = fsCol("pushSubscriptions");
    const snap = userId ? await fsGetDocs(query(col, where("userId", "==", userId))) : await fsGetDocs(col);

    const payload = JSON.stringify({ title, body, url });
    const results = await Promise.allSettled(
      snap.docs.map((d) => {
        const sub = d.data() as PushSubDoc;
        return webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        );
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;
    return NextResponse.json({ sent, failed });
  } catch (err) {
    console.error("push send error:", err);
    return NextResponse.json({ error: "Failed to send push" }, { status: 500 });
  }
}
