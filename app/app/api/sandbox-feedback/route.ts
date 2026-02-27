import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";

const FILE = join(process.cwd(), "sandbox-feedback.json");

interface FeedbackEntry {
  rating: number;
  comment: string;
  updated: string;
  user_email?: string;
  user_name?: string;
}

export async function GET() {
  try {
    const raw = await readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, rating, comment } = body as {
    slug: string;
    rating: number;
    comment: string;
  };

  let data: Record<string, FeedbackEntry> = {};
  try {
    data = JSON.parse(await readFile(FILE, "utf-8"));
  } catch {
    /* first write */
  }

  data[slug] = {
    rating,
    comment,
    updated: new Date().toISOString(),
    user_email: session.user.email ?? undefined,
    user_name: session.user.name ?? undefined,
  };
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
