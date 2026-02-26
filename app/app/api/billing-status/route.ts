import { auth } from "@/auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8420";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/api/billing/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session.user.apiKey
        ? { Authorization: `Bearer ${session.user.apiKey}` }
        : {}),
    },
    body: JSON.stringify({ user_id: session.user.id }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
