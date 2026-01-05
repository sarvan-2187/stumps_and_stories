import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { deduplicateItems, classifyLeague } from "@/lib/rss-utils";

const parser = new Parser();

const RSS_FEEDS = [
  {
    source: "ESPNcricinfo",
    url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
  },
  {
    source: "CricTracker",
    url: "https://www.crictracker.com/feed/",
  },
];

export async function GET() {
  try {
    const now = Date.now();
    const LIMIT = 72 * 60 * 60 * 1000;

    let items: any[] = [];

    for (const feed of RSS_FEEDS) {
      const data = await parser.parseURL(feed.url);

      for (const item of data.items) {
        if (!item.pubDate) continue;

        const published = new Date(item.pubDate).getTime();
        if (now - published > LIMIT) continue;

        items.push({
          source: feed.source,
          title: item.title ?? "No title",
          summary: item.contentSnippet ?? "",
          link: item.link ?? "",
          published_at: item.pubDate,
          league: classifyLeague(item.title ?? ""),
        });
      }
    }

    // 🔹 Deduplicate
    const uniqueItems = deduplicateItems(items);

    return NextResponse.json({
      success: true,
      count: uniqueItems.length,
      items: uniqueItems,
    });
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSS feeds" },
      { status: 500 }
    );
  }
}
