import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPaths = ["", "/experiences", "/services", "/destinations", "/offres", "/a-propos", "/galerie", "/actualites", "/faq", "/contact", "/demande"];
  const data = await getSitemapEntries();

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path || "/"}` })),
    ...data.experiences.map((item) => ({ url: `${base}/experiences/${item.slug}`, lastModified: item.updatedAt })),
    ...data.services.map((item) => ({ url: `${base}/services/${item.slug}`, lastModified: item.updatedAt })),
    ...data.destinations.map((item) => ({ url: `${base}/destinations/${item.slug}`, lastModified: item.updatedAt })),
    ...data.offers.map((item) => ({ url: `${base}/offres/${item.slug}`, lastModified: item.updatedAt })),
    ...data.articles.map((item) => ({ url: `${base}/actualites/${item.slug}`, lastModified: item.updatedAt })),
  ];
}
