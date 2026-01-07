import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO newsletters (title, content)
      VALUES ($1, $2)
    `;

    await pool.query(query, [
      title || "Cricket News – Past 72 Hours",
      content,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter Store Error:", error);
    return NextResponse.json(
      { error: "Failed to store newsletter" },
      { status: 500 }
    );
  }
}
