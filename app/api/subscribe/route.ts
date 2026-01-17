import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { transporter } from "@/lib/mailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


const generateEmailHtml = (title: string, contentHtml: string, unsubscribeLink: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        @media screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 0 !important; }
          .content { padding: 20px !important; }
        }
      </style>
    </head>
    <body style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #374151; margin: 0; padding: 0;">
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <tr>
                <td style="background-color: #111827; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 1px;">
                    STUMPS & STORIES
                  </h1>
                </td>
              </tr>

              <tr>
                <td class="content" style="padding: 40px 30px;">
                  <h2 style="margin-top: 0; color: #111827; font-size: 20px; line-height: 1.4; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                    ${title}
                  </h2>
                  <div style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    ${contentHtml}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                    You are receiving this because you just subscribed.
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 12px;">
                    <a href="${unsubscribeLink}" style="color: #6b7280; text-decoration: underline;">
                      Unsubscribe
                    </a>
                  </p>
                </td>
              </tr>

            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-top: 20px; color: #9ca3af; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} Stumps & Stories.
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};


export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // 2. Database Operations (Insert User)
    const insertSubscriberQuery = `
      INSERT INTO subscribers (email, is_active) VALUES ($1, true)
      ON CONFLICT (email) DO UPDATE SET is_active = true
      RETURNING id
    `;
    const subscriberResult = await pool.query(insertSubscriberQuery, [email]);
    const subscriberId = subscriberResult.rows[0].id;

    // 3. Database Operations (Handle Token)
    const tokenCheckQuery = `SELECT token FROM unsubscribe_tokens WHERE subscriber_id = $1`;
    const tokenCheckResult = await pool.query(tokenCheckQuery, [subscriberId]);

    let token: string;

    if (tokenCheckResult.rowCount === 0) {
      token = crypto.randomBytes(32).toString("hex");
      await pool.query(
        `INSERT INTO unsubscribe_tokens (subscriber_id, token) VALUES ($1, $2)`,
        [subscriberId, token]
      );
    } else {
      token = tokenCheckResult.rows[0].token;
    }

    const unsubscribeLink = `${process.env.APP_URL}/unsubscribe?token=${token}`;

    // 4. Generate Welcome Email Content
    const welcomeMessage = `
      <p>You are now officially a part of <strong>Stumps & Stories</strong>.</p>
      <p>You’ll receive hand-picked cricket stories, match insights, and history delivered straight to your inbox twice a week.</p>
      <p style="margin-top: 20px;">Sit back, relax, and enjoy the game!</p>
    `;

    const htmlEmail = generateEmailHtml(
      "Welcome to the Club!", 
      welcomeMessage, 
      unsubscribeLink
    );

    // 5. Send Email
    await transporter.sendMail({
      from: `"Stumps & Stories" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Stumps & Stories",
      html: htmlEmail,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Failed to Subscribe!" }, { status: 500 });
  }
}
