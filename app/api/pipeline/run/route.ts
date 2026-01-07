import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    console.log("PIPELINE: started");

    const host = req.headers.get("host");
    if (!host) {
      throw new Error("Host header not found");
    }

    const baseUrl = `https://${host}`;
    console.log("PIPELINE BASE URL:", baseUrl);

    // 1️⃣ Fetch RSS
    const rssRes = await fetch(`${baseUrl}/api/rss/fetch`);
    const rssData = await rssRes.json();

    if (!rssData.success) {
      throw new Error("RSS fetch failed");
    }

    // 2️⃣ Summarize with AI
    const aiRes = await fetch(`${baseUrl}/api/rss/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: rssData.items }),
    });

    const aiData = await aiRes.json();

    if (!aiData.content) {
      throw new Error("AI summarization returned empty content");
    }

    // 3️⃣ Store newsletter
    const storeRes = await fetch(`${baseUrl}/api/newsletter/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Cricket News – Past 72 Hours",
        content: aiData.content,
      }),
    });

    if (!storeRes.ok) {
      const errText = await storeRes.text();
      throw new Error(`Store failed: ${errText}`);
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
