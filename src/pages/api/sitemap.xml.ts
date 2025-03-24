// Importez votre fonction pour récupérer les projets
import { NextApiRequest, NextApiResponse } from "next";

// Fonction pour générer le sitemap
const generateSitemap = (baseUrl: string) => {
  const staticUrls = [
    { loc: "/", lastmod: "2025-01-01", changefreq: "daily", priority: 1.0 },
  ];

  const urls = [...staticUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      ({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return sitemap;
};

// API handler pour servir le sitemap
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Vous pouvez définir cette URL dans votre .env

  const sitemap = generateSitemap(baseUrl);

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}
