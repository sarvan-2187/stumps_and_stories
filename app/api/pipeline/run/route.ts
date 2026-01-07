import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST() {
  try {
    console.log("PIPELINE: started");

    // Fetch RSS
    const rssRes = await fetch(`${process.env.APP_URL}/api/rss/fetch`);
    const rssText = await rssRes.text();
    console.log("RSS RESPONSE:", rssText);

    const rssData = JSON.parse(rssText);

    if (!rssData.success) {
      throw new Error("RSS fetch failed");
    }

    // Summarize with AI
    const aiRes = await fetch(`${process.env.APP_URL}/api/rss/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: rssData.items }),
    });

    const aiText = await aiRes.text();
    console.log("AI RESPONSE:", aiText);

    const aiData = JSON.parse(aiText);

    if (!aiData.content) {
      throw new Error("AI summarization returned empty content");
    }

    // 3️⃣ Store newsletter
    const storeRes = await fetch(`${process.env.APP_URL}/api/newsletter/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Cricket News – Past 72 Hours",
        content: aiData.content,
      }),
    });

    const storeText = await storeRes.text();
    console.log("STORE RESPONSE:", storeText);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PIPELINE ERROR:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
