import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/how-it-works", "/security", "/pricing", "/faq"],
      disallow: ["/app/", "/internal/", "/recipient/", "/api/"],
    },
  };
}
