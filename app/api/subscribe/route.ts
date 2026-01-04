import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    // Extract email
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    // Insert or re-activate subscriber
    const insertSubscriberQuery = `
      INSERT INTO subscribers (email, is_active)
      VALUES ($1, true)
      ON CONFLICT (email)
      DO UPDATE SET is_active = true
      RETURNING id
    `;

    const subscriberResult = await pool.query(
      insertSubscriberQuery,
      [email]
    );

    const subscriberId = subscriberResult.rows[0].id;

    // Check if unsubscribe token already exists
    const tokenCheckQuery = `
      SELECT token
      FROM unsubscribe_tokens
      WHERE subscriber_id = $1
    `;

    const tokenCheckResult = await pool.query(
      tokenCheckQuery,
      [subscriberId]
    );

    let token: string;

    if (tokenCheckResult.rowCount === 0) {
      // Generate token
      token = crypto.randomBytes(32).toString("hex");

      const insertTokenQuery = `
        INSERT INTO unsubscribe_tokens (subscriber_id, token)
        VALUES ($1, $2)
      `;

      await pool.query(insertTokenQuery, [subscriberId, token]);
    } else {
      token = tokenCheckResult.rows[0].token;
    }

    // Build unsubscribe link
    const unsubscribeLink =
      `${process.env.APP_URL}/unsubscribe?token=${token}`;

    // Send welcome email
    await transporter.sendMail({
      from: `"Stumps & Stories" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Stumps & Stories 🏏",
      html: `
        <p>You are now a part of <strong>Stumps & Stories</strong>.</p>

        <p>
          You’ll receive hand-picked cricket stories twice a week.
        </p>

        <p>
          If you don’t want these emails, you can
          <a href="${unsubscribeLink}">unsubscribe here</a>.
        </p>
      `,
    });

    // Success response
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json(
      { error: "Failed to Subscribe!" },
      { status: 500 }
    );
  }
}
