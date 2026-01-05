export function deduplicateItems(items: any[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .slice(0, 80);

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function classifyLeague(title: string) {
  const t = title.toLowerCase();

  if (t.includes("icc") || t.includes("ranking")) return "ICC";
  if (t.includes("ipl")) return "IPL";
  if (t.includes("wpl")) return "WPL";
  if (t.includes("bbl") || t.includes("big bash")) return "BBL";
  if (t.includes("ilt20")) return "ILT20";
  if (t.includes("sa20")) return "SA20";

  return "OTHER";
}
