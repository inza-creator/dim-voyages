import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { defaultSettings, type PublicSettings } from "@/lib/constants";

export const getSettings = cache(async (): Promise<PublicSettings> => {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  const merged: PublicSettings = { ...defaultSettings };

  (Object.keys(defaultSettings) as (keyof PublicSettings)[]).forEach((key) => {
    const value = map[key];
    if (value === undefined) return;
    if (key === "heroImageUrl" && value === "") return;
    merged[key] = value;
  });

  return merged;
});

export async function getHomeData() {
  const [settings, experiences, services, destinations, offers, testimonials, articles] =
    await Promise.all([
      getSettings(),
      prisma.experience.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
      prisma.service.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
      prisma.destination.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.offer.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        take: 4,
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 3,
      }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 3,
      }),
    ]);

  return { settings, experiences, services, destinations, offers, testimonials, articles };
}

export async function getPublishedExperiences() {
  return prisma.experience.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getExperience(slug: string) {
  return prisma.experience.findFirst({ where: { slug, published: true } });
}

export async function getPublishedServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getService(slug: string) {
  return prisma.service.findFirst({ where: { slug, published: true } });
}

export async function getPublishedDestinations() {
  return prisma.destination.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getDestination(slug: string) {
  return prisma.destination.findFirst({
    where: { slug, published: true },
    include: {
      offers: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getPublishedOffers() {
  return prisma.offer.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
}

export async function getOffer(slug: string) {
  return prisma.offer.findFirst({
    where: { slug, published: true },
    include: { destination: true, experience: true },
  });
}

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getArticle(slug: string) {
  return prisma.article.findFirst({ where: { slug, published: true } });
}

export async function getPublishedFaqs() {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { question: "asc" }],
  });
}

export async function getPublishedGallery() {
  return prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function searchPublic(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const [offers, destinations, articles, experiences, services] = await Promise.all([
    prisma.offer.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { destinationLabel: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    prisma.destination.findMany({
      where: { published: true, name: { contains: q, mode: "insensitive" } },
      take: 5,
    }),
    prisma.article.findMany({
      where: { published: true, title: { contains: q, mode: "insensitive" } },
      take: 5,
    }),
    prisma.experience.findMany({
      where: { published: true, title: { contains: q, mode: "insensitive" } },
      take: 4,
    }),
    prisma.service.findMany({
      where: { published: true, title: { contains: q, mode: "insensitive" } },
      take: 4,
    }),
  ]);

  return [
    ...experiences.map((item) => ({ type: "Expérience", title: item.title, href: `/experiences/${item.slug}` })),
    ...services.map((item) => ({ type: "Service", title: item.title, href: `/services/${item.slug}` })),
    ...destinations.map((item) => ({ type: "Destination", title: item.name, href: `/destinations/${item.slug}` })),
    ...offers.map((item) => ({ type: "Offre", title: item.title, href: `/offres/${item.slug}` })),
    ...articles.map((item) => ({ type: "Actualité", title: item.title, href: `/actualites/${item.slug}` })),
  ];
}

export async function getSitemapEntries() {
  const [experiences, services, destinations, offers, articles] = await Promise.all([
    prisma.experience.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.destination.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.offer.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  return { experiences, services, destinations, offers, articles };
}
