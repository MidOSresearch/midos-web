import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const FILE = join(process.cwd(), "sandbox-feedback.json");

export async function GET() {
  try {
    const raw = await readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, rating, comment } = body as {
    slug: string;
    rating: number;
    comment: string;
  };

  let data: Record<string, { rating: number; comment: string; updated: string }> = {};
  try {
    data = JSON.parse(await readFile(FILE, "utf-8"));
  } catch {
    /* first write */
  }

  data[slug] = { rating, comment, updated: new Date().toISOString() };
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
