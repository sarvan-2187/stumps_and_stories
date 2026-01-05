import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { transporter } from "@/lib/mailer";
import { marked } from "marked"; // Import the converter

// Helper function to generate the HTML email
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
        
        /* MARKDOWN SPECIFIC STYLES FOR EMAIL */
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { margin-top: 20px; margin-bottom: 10px; color: #111827; }
        .markdown-body p { margin-bottom: 15px; }
        .markdown-body ul, .markdown-body ol { margin-left: 20px; padding-left: 0; margin-bottom: 15px; }
        .markdown-body li { margin-bottom: 5px; }
        .markdown-body strong { font-weight: 700; color: #000; }
        .markdown-body a { color: #2563eb; text-decoration: underline; }

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
                  
                  <div class="markdown-body" style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    ${contentHtml} 
                  </div>

                </td>
              </tr>

              <tr>
                <td style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                    You received this because you are subscribed to Stumps & Stories.
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
    const newsletterRes = await pool.query(
      `SELECT id, title, content FROM newsletters WHERE sent_at IS NULL ORDER BY created_at DESC LIMIT 1`
    );

    if (newsletterRes.rowCount === 0) {
      return NextResponse.json({ skipped: true, reason: "No unsent newsletters" });
    }

    const newsletter = newsletterRes.rows[0];

    // --- CONVERT MARKDOWN TO HTML HERE ---
    // This turns "**Bold**" into "<strong>Bold</strong>" and lists into <ul><li>...
    const contentHtml = await marked.parse(newsletter.content); 

    const subsRes = await pool.query(
      `SELECT s.email, t.token 
       FROM subscribers s 
       JOIN unsubscribe_tokens t ON s.id = t.subscriber_id 
       WHERE s.is_active = true`
    );

    if (subsRes.rowCount === 0) {
      return NextResponse.json({ skipped: true, reason: "No active subscribers" });
    }

    for (const sub of subsRes.rows) {
      const unsubscribeLink = `${process.env.APP_URL}/unsubscribe?token=${sub.token}`;
      
      // Pass the CONVERTED HTML, not the raw markdown
      const htmlEmail = generateEmailHtml(newsletter.title, contentHtml, unsubscribeLink);

      await transporter.sendMail({
        from: `"Stumps & Stories" <${process.env.SMTP_USER}>`,
        to: sub.email,
        subject: newsletter.title,
        html: htmlEmail,
      });
    }

    await pool.query(
      `UPDATE newsletters SET sent_at = NOW() WHERE id = $1`,
      [newsletter.id]
    );

    return NextResponse.json({ success: true, sent_to: subsRes.rowCount });
  } catch (error) {
    console.error("Send Newsletter Error:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}