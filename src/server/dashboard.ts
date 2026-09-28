import { prisma } from "@/lib/prisma";

export async function getDashboard() {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [
    requests,
    newCount,
    inProgress,
    doneCount,
    experiences,
    services,
    destinations,
    offers,
    articles,
    testimonials,
    faqs,
    gallery,
    subscribers,
    latestRequests,
    latestTestimonial,
    recentArticles,
    recentOffers,
  ] = await Promise.all([
    prisma.travelRequest.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, type: true },
    }),
    prisma.travelRequest.count({ where: { status: "NOUVELLE" } }),
    prisma.travelRequest.count({ where: { status: { in: ["EN_COURS", "CLIENT_CONTACTE"] } } }),
    prisma.travelRequest.count({ where: { status: "TRAITEE" } }),
    prisma.experience.count(),
    prisma.service.count(),
    prisma.destination.count(),
    prisma.offer.count(),
    prisma.article.count(),
    prisma.testimonial.count(),
    prisma.faq.count(),
    prisma.galleryItem.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.travelRequest.findMany({ orderBy: { createdAt: "desc" }, take: 7 }),
    prisma.testimonial.findFirst({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.article.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
    prisma.offer.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
  ]);

  const total = await prisma.travelRequest.count();
  const byType = await prisma.travelRequest.groupBy({
    by: ["type"],
    _count: { type: true },
  });

  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const count = requests.filter((item) => item.createdAt.toISOString().slice(0, 10) === key).length;
    return { key, count };
  });

  return {
    total,
    newCount,
    inProgress,
    doneCount,
    counts: { experiences, services, destinations, offers, articles, testimonials, faqs, gallery, subscribers },
    days,
    byType,
    latestRequests,
    latestTestimonial,
    activity: [
      ...recentArticles.map((item) => ({
        id: item.id,
        label: item.title,
        meta: "Actualité",
        href: "/admin/actualites",
        at: item.updatedAt,
      })),
      ...recentOffers.map((item) => ({
        id: item.id,
        label: item.title,
        meta: "Offre",
        href: "/admin/offres",
        at: item.updatedAt,
      })),
    ].sort((a, b) => b.at.getTime() - a.at.getTime()),
  };
}
