import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    // Find subscriber linked to this token
    const tokenResult = await pool.query(
      `
      SELECT subscriber_id
      FROM unsubscribe_tokens
      WHERE token = $1
      `,
      [token]
    );

    if (tokenResult.rowCount === 0) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const subscriberId = tokenResult.rows[0].subscriber_id;

    // Mark subscriber as inactive
    await pool.query(
      `
      UPDATE subscribers
      SET is_active = false
      WHERE id = $1
      `,
      [subscriberId]
    );

    return NextResponse.json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    console.error("Unsubscribe API error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
