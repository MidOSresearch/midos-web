import { auth } from "@/auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8420";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/api/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session.user.apiKey
        ? { Authorization: `Bearer ${session.user.apiKey}` }
        : {}),
    },
    body: JSON.stringify({
      user_id: session.user.id,
      processor: body.processor || "paddle",
      interval: body.interval || "monthly",
      plan: body.plan || "dev",
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
