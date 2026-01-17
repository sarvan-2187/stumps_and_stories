import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { transporter } from "@/lib/mailer";

/* -------------------- CORS CONFIG -------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* -------------------- OPTIONS (CORS PREFLIGHT) -------------------- */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/* -------------------- EMAIL TEMPLATE -------------------- */
const generateEmailHtml = (
  title: string,
  contentHtml: string,
  unsubscribeLink: string
) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { margin:0; padding:0; background:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
.container { max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; }
.header { background:#111827; color:#ffffff; padding:30px; text-align:center; }
.content { padding:40px 30px; color:#374151; font-size:16px; line-height:1.6; }
.footer { padding:30px; text-align:center; background:#f9fafb; font-size:12px; color:#9ca3af; }
a { color:#6b7280; }
</style>
</head>
<body>

<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center">
  <table class="container" cellpadding="0" cellspacing="0">
    <tr>
      <td class="header">
        <h1>STUMPS & STORIES</h1>
      </td>
    </tr>
    <tr>
      <td class="content">
        <h2>${title}</h2>
        ${contentHtml}
      </td>
    </tr>
    <tr>
      <td class="footer">
        You are receiving this because you subscribed.<br/>
        <a href="${unsubscribeLink}">Unsubscribe</a>
      </td>
    </tr>
  </table>
</td></tr>
</table>

</body>
</html>
`;
};

/* -------------------- POST: SUBSCRIBE -------------------- */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    /* ---------- INSERT / UPDATE SUBSCRIBER ---------- */
    const insertSubscriberQuery = `
      INSERT INTO subscribers (email, is_active)
      VALUES ($1, true)
      ON CONFLICT (email)
      DO UPDATE SET is_active = true
      RETURNING id
    `;
    const subscriberResult = await pool.query(insertSubscriberQuery, [email]);
    const subscriberId = subscriberResult.rows[0].id;

    /* ---------- TOKEN HANDLING ---------- */
    const tokenCheck = await pool.query(
      "SELECT token FROM unsubscribe_tokens WHERE subscriber_id = $1",
      [subscriberId]
    );

    let token: string;

    if (tokenCheck.rowCount === 0) {
      token = crypto.randomBytes(32).toString("hex");
      await pool.query(
        "INSERT INTO unsubscribe_tokens (subscriber_id, token) VALUES ($1, $2)",
        [subscriberId, token]
      );
    } else {
      token = tokenCheck.rows[0].token;
    }

    const unsubscribeLink = `${process.env.APP_URL}/unsubscribe?token=${token}`;

    /* ---------- EMAIL CONTENT ---------- */
    const welcomeMessage = `
      <p>You are now officially part of <strong>Stumps & Stories</strong>.</p>
      <p>You’ll receive curated cricket stories, match insights, and history twice a week.</p>
      <p style="margin-top:20px;">Sit back and enjoy the game...</p>
    `;

    const htmlEmail = generateEmailHtml(
      "Welcome to the Club!",
      welcomeMessage,
      unsubscribeLink
    );

    /* ---------- SEND EMAIL ---------- */
    await transporter.sendMail({
      from: `"Stumps & Stories" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Stumps & Stories",
      html: htmlEmail,
    });

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );

  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500, headers: corsHeaders }
    );
  }
}
