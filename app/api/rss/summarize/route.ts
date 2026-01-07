import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export const revalidate = 0;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  console.log("RSS_SUMMARIZE: started");

  try {
    const bodyText = await req.text();

    if (!bodyText.trim().startsWith("{")) {
      console.error("RSS_SUMMARIZE: non-JSON request body", bodyText.slice(0, 100));
      return NextResponse.json({
        content: "No major updates in the past 72 hours.",
        debug: "non-json-request",
      });
    }

    const { items } = JSON.parse(bodyText);

    if (!items || items.length === 0) {
      console.log("RSS_SUMMARIZE: no items");
      return NextResponse.json({
        content: "No major updates in the past 72 hours.",
        debug: "empty-items",
      });
    }

    console.log(`RSS_SUMMARIZE: summarizing ${items.length} items`);

    const facts = items
      .map(
        (item: any, index: number) =>
          `${index + 1}. [${item.league}] ${item.title} (${item.published_at})`
      )
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a professional cricket news editor. Summarize ONLY the provided facts.",
        },
        {
          role: "user",
          content: facts,
        },
      ],
      temperature: 0.3,
      max_tokens: 900,
    });

    console.log("RSS_SUMMARIZE: completed");

    return NextResponse.json({
      content: completion.choices[0].message.content,
      source: "rss/summarize",
    });
  } catch (error) {
    console.error("RSS_SUMMARIZE: error", error);
    return NextResponse.json({
      content: "No major updates in the past 72 hours.",
      source: "rss/summarize",
      debug: "exception",
    });
  }
}
