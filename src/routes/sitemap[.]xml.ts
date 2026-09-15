import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://asa-female.vercel.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>${SITE_URL}/store</loc><changefreq>daily</changefreq><priority>0.9</priority></url></urlset>`,
          { headers: { "Content-Type": "application/xml; charset=utf-8" } },
        ),
    },
  },
});
