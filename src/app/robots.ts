import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://snaplinks.vercel.app"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/pricing"],
        disallow: ["/dashboard", "/api", "/auth"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
