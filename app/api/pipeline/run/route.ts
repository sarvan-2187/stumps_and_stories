import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const isCron = req.headers.get("x-vercel-cron");
    const isManualRun = req.headers.get("x-vercel-deployment-url"); 

    if (isCron !== "1" && !isManualRun) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("PIPELINE: started");

    const host = req.headers.get("host");
    if (!host) {
      throw new Error("Host header not found");
    }

    const baseUrl = `https://${host}`;
    console.log("PIPELINE BASE URL:", baseUrl);

    /* ---------------- RSS FETCH ---------------- */

    const rssRes = await fetch(`${baseUrl}/api/rss/fetch`);
    const rssText = await rssRes.text();

    console.log("PIPELINE: rss/fetch status:", rssRes.status);
    console.log("PIPELINE: rss/fetch preview:", rssText.slice(0, 120));

    if (!rssText.trim().startsWith("{")) {
      throw new Error("rss/fetch returned non-JSON (HTML)");
    }

    const rssData = JSON.parse(rssText);

    if (!rssData.success) {
      throw new Error("rss/fetch success=false");
    }

    /* ---------------- RSS SUMMARIZE ---------------- */

    const aiRes = await fetch(`${baseUrl}/api/rss/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: rssData.items }),
    });

    const aiText = await aiRes.text();

    console.log("PIPELINE: rss/summarize status:", aiRes.status);
    console.log("PIPELINE: rss/summarize preview:", aiText.slice(0, 120));

    if (!aiText.trim().startsWith("{")) {
      throw new Error("rss/summarize returned non-JSON (HTML)");
    }

    const aiData = JSON.parse(aiText);

    if (!aiData.content) {
      throw new Error("rss/summarize returned empty content");
    }

    /* ---------------- STORE NEWSLETTER ---------------- */

    const storeRes = await fetch(`${baseUrl}/api/newsletter/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Cricket News – Past 72 Hours",
        content: aiData.content,
      }),
    });

    const storeText = await storeRes.text();

    console.log("PIPELINE: newsletter/store status:", storeRes.status);
    console.log("PIPELINE: newsletter/store preview:", storeText.slice(0, 120));

    if (!storeRes.ok) {
      throw new Error(`newsletter/store failed`);
    }

    console.log("PIPELINE: completed successfully");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PIPELINE ERROR:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
