import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { deduplicateItems, classifyLeague } from "@/lib/rss-utils";

export const revalidate = 0;

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
  console.log("RSS_FETCH: started");

  try {
    const now = Date.now();
    const LIMIT = 72 * 60 * 60 * 1000;
    let items: any[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        console.log(`RSS_FETCH: fetching ${feed.source}`);
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
      } catch (feedErr) {
        console.error(`RSS_FETCH: FAILED for ${feed.source}`, feedErr);
      }
    }

    const uniqueItems = deduplicateItems(items);

    console.log("RSS_FETCH: completed", {
      count: uniqueItems.length,
    });

    return NextResponse.json({
      success: true,
      source: "rss/fetch",
      count: uniqueItems.length,
      items: uniqueItems,
    });
  } catch (error) {
    console.error("RSS_FETCH: fatal error", error);
    return NextResponse.json(
      {
        success: false,
        source: "rss/fetch",
        error: "RSS fetch failed",
      },
      { status: 500 }
    );
  }
}
