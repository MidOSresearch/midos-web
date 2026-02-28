import { NextResponse } from "next/server";
import { addFeedback, getFeedback, resolveFeedback, getFeedbackStats } from "@/lib/db";

/* ─── GET /api/sandbox-feedback ───
   Query params:
     ?section=hero       Filter by section
     ?status=open        Filter by status (open|acknowledged|done)
     ?stats=true         Return counts per section instead of rows
*/
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const section = url.searchParams.get("section") ?? undefined;
    const status = url.searchParams.get("status") ?? undefined;
    const stats = url.searchParams.get("stats");

    if (stats === "true") {
      return NextResponse.json(getFeedbackStats());
    }

    const rows = getFeedback({ section, status });
    return NextResponse.json(rows);
  } catch (e) {
    console.error("[sandbox-feedback] GET error:", e);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

/* ─── POST /api/sandbox-feedback ───
   Body: { section, version?, user_email, user_name?, rating?, comment }
   Each POST creates a NEW row (accumulates, never overwrites).
*/
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, version, user_email, user_name, rating, comment } = body as {
      section: string;
      version?: string;
      user_email?: string;
      user_name?: string;
      rating?: number;
      comment?: string;
    };

    if (!section || !comment) {
      return NextResponse.json(
        { error: "section and comment are required" },
        { status: 400 },
      );
    }

    const email = user_email || "anonymous@sandbox";

    const row = addFeedback({
      section,
      version,
      user_email: email,
      user_name,
      rating,
      comment,
    });

    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    console.error("[sandbox-feedback] POST error:", e);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

/* ─── PATCH /api/sandbox-feedback ───
   Body: { id, status: 'acknowledged'|'done', resolution_note? }
   Admin-only: marks feedback as processed.
*/
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, resolution_note } = body as {
      id: number;
      status: "acknowledged" | "done";
      resolution_note?: string;
    };

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 },
      );
    }

    if (!["acknowledged", "done"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'acknowledged' or 'done'" },
        { status: 400 },
      );
    }

    const row = resolveFeedback(id, status, resolution_note);
    if (!row) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    return NextResponse.json(row);
  } catch (e) {
    console.error("[sandbox-feedback] PATCH error:", e);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}
