import { auth } from "@/auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8420";
const ADMIN_SECRET = process.env.ADMIN_PROVISION_SECRET || "";

/**
 * POST /api/api-key
 * Body: { action: "generate" | "rotate" }
 *
 * Proxies to backend admin endpoints using server-side ADMIN_PROVISION_SECRET.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Admin provisioning not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const action = body.action || "generate";

  if (action === "generate") {
    // Provision (idempotent — returns existing key if already provisioned)
    const res = await fetch(`${BACKEND_URL}/admin/provision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Secret": ADMIN_SECRET,
      },
      body: JSON.stringify({
        user_id: session.user.id,
        name: session.user.name || session.user.email.split("@")[0],
        email: session.user.email,
        role: "community",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Backend error" }));
      return NextResponse.json(err, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      api_key: data.api_key,
      is_new: data.is_new ?? data.action === "created",
    });
  }

  if (action === "rotate") {
    const res = await fetch(`${BACKEND_URL}/admin/rotate-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Secret": ADMIN_SECRET,
      },
      body: JSON.stringify({
        user_id: session.user.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Backend error" }));
      return NextResponse.json(err, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      api_key: data.api_key,
      rotated: true,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
