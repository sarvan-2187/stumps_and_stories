import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export const revalidate = 0;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({
        content: "No major updates in the past 72 hours.",
      });
    }

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
            "You are a professional cricket news editor. Summarize ONLY the provided facts. Do not add, assume, or invent information.",
        },
        {
          role: "user",
          content: `
Below are VERIFIED cricket headlines from ESPNcricinfo and CricTracker
from the past 72 hours.

${facts}

Create a structured cricket news report.
If a league has no meaningful updates, write: "No major updates."
`,
        },
      ],
      temperature: 0.3,
      max_tokens: 900,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("RSS Summarize Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize RSS data" },
      { status: 500 }
    );
  }
}
