import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return [
    "",
    "/how-it-works",
    "/security",
    "/pricing",
    "/faq",
    "/legal/privacy",
    "/legal/terms",
    "/legal/acceptable-use",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
  }));
}
