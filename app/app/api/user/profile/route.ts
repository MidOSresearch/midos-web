import { auth } from "@/auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8420";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Backend offline — return session data as fallback
    return NextResponse.json({
      user_id: session.user.id || "",
      email: session.user.email,
      name: session.user.name || "",
      tier: session.user.tier || "community",
      api_key: session.user.apiKey || "",
      subscription: {},
      created_at: "",
      atoms_contributed: 0,
    });
  }
}
