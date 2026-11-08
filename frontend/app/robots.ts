import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/** Paths that must stay out of public and AI crawls. */
const DISALLOW = ["/admin", "/admin/", "/api/", "/health"] as const;

/** AI search / assistant crawlers we explicitly allow (same policy as *). */
const AI_USER_AGENTS = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
] as const;

/** Model-training crawlers are blocked; their crawls count toward Vercel limits. */
const AI_TRAINING_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Bytespider",
  "Google-Extended",
  "Applebot-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  const publicRule = {
    allow: "/",
    disallow: [...DISALLOW],
  };

  return {
    rules: [
      { userAgent: "*", ...publicRule },
      { userAgent: [...AI_USER_AGENTS], ...publicRule },
      { userAgent: [...AI_TRAINING_AGENTS], disallow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
