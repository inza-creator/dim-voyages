import { cache } from "react";
import type { Article, Destination, Experience, Offer, Service, Testimonial } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { defaultSettings, type PublicSettings } from "@/lib/constants";
import { getLocale } from "@/lib/locale";
import {
  localizeSettings,
  presentArticle,
  presentDestination,
  presentExperience,
  presentFaq,
  presentGallery,
  presentOffer,
  presentService,
  presentTestimonial,
} from "@/lib/localize";

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

export async function getHomeData(): Promise<{
  settings: PublicSettings;
  experiences: Experience[];
  services: Service[];
  destinations: Destination[];
  offers: Offer[];
  testimonials: Testimonial[];
  articles: Article[];
}> {
  const locale = await getLocale();
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

  return {
    settings: localizeSettings(settings, locale),
    experiences: experiences.map((item) => presentExperience(item, locale)),
    services: services.map((item) => presentService(item, locale)),
    destinations: destinations.map((item) => presentDestination(item, locale)),
    offers: offers.map((item) => presentOffer(item, locale)),
    testimonials: testimonials.map((item) => presentTestimonial(item, locale)),
    articles: articles.map((item) => presentArticle(item, locale)),
  };
}

export async function getPublishedExperiences() {
  const locale = await getLocale();
  const items = await prisma.experience.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  return items.map((item) => presentExperience(item, locale));
}

export async function getExperience(slug: string) {
  const locale = await getLocale();
  const item = await prisma.experience.findFirst({ where: { slug, published: true } });
  return item ? presentExperience(item, locale) : null;
}

export async function getPublishedServices() {
  const locale = await getLocale();
  const items = await prisma.service.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  return items.map((item) => presentService(item, locale));
}

export async function getService(slug: string) {
  const locale = await getLocale();
  const item = await prisma.service.findFirst({ where: { slug, published: true } });
  return item ? presentService(item, locale) : null;
}

export async function getPublishedDestinations() {
  const locale = await getLocale();
  const items = await prisma.destination.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return items.map((item) => presentDestination(item, locale));
}

export async function getDestination(slug: string) {
  const locale = await getLocale();
  const item = await prisma.destination.findFirst({
    where: { slug, published: true },
    include: {
      offers: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return item ? presentDestination(item, locale) : null;
}

export async function getPublishedOffers() {
  const locale = await getLocale();
  const items = await prisma.offer.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  return items.map((item) => presentOffer(item, locale));
}

export async function getOffer(slug: string) {
  const locale = await getLocale();
  const item = await prisma.offer.findFirst({
    where: { slug, published: true },
    include: { destination: true, experience: true },
  });
  if (!item) return null;
  return {
    ...presentOffer(item, locale),
    destination: item.destination ? presentDestination(item.destination, locale) : null,
    experience: item.experience ? presentExperience(item.experience, locale) : null,
  };
}

export async function getPublishedArticles() {
  const locale = await getLocale();
  const items = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return items.map((item) => presentArticle(item, locale));
}

export async function getArticle(slug: string) {
  const locale = await getLocale();
  const item = await prisma.article.findFirst({ where: { slug, published: true } });
  return item ? presentArticle(item, locale) : null;
}

export async function getPublishedFaqs() {
  const locale = await getLocale();
  const items = await prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { question: "asc" }],
  });
  return items.map((item) => presentFaq(item, locale));
}

export async function getPublishedGallery() {
  const locale = await getLocale();
  const items = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return items.map((item) => presentGallery(item, locale));
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
