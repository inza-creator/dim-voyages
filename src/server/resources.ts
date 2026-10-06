import { revalidatePath } from "next/cache";
import type { GalleryCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ResourceKey } from "@/lib/admin-resources";

type Payload = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function flag(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function integer(value: unknown) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

function lines(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
  }
  return [];
}

function required(input: Payload, field: string, label: string) {
  const value = text(input[field]);
  if (value.length < 2) return { error: `${label} est obligatoire.` as const };
  return { value };
}

async function uniqueSlug(
  desired: string,
  currentId: string | undefined,
  find: (slug: string) => Promise<{ id: string } | null>,
) {
  const root = slugify(desired) || "element";
  let slug = root;
  let index = 2;
  while (true) {
    const existing = await find(slug);
    if (!existing || existing.id === currentId) return slug;
    slug = `${root}-${index}`;
    index += 1;
  }
}

function dateOrNull(value: unknown) {
  const raw = text(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function refreshPublic() {
  revalidatePath("/", "layout");
}

export async function listResource(key: ResourceKey) {
  switch (key) {
    case "experiences":
      return prisma.experience.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
    case "services":
      return prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
    case "destinations":
      return prisma.destination.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
    case "offres":
      return prisma.offer.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
    case "actualites":
      return prisma.article.findMany({ orderBy: { createdAt: "desc" } });
    case "temoignages":
      return prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    case "faq":
      return prisma.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { question: "asc" }] });
    case "galerie":
      return prisma.galleryItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  }
}

export async function createResource(key: ResourceKey, input: Payload) {
  const saved = await saveResource(key, input);
  if (!("error" in saved)) refreshPublic();
  return saved;
}

export async function updateResource(key: ResourceKey, id: string, input: Payload) {
  const saved = await saveResource(key, input, id);
  if (!("error" in saved)) refreshPublic();
  return saved;
}

export async function deleteResource(key: ResourceKey, id: string) {
  switch (key) {
    case "experiences":
      await prisma.experience.delete({ where: { id } });
      break;
    case "services":
      await prisma.service.delete({ where: { id } });
      break;
    case "destinations":
      await prisma.destination.delete({ where: { id } });
      break;
    case "offres":
      await prisma.offer.delete({ where: { id } });
      break;
    case "actualites":
      await prisma.article.delete({ where: { id } });
      break;
    case "temoignages":
      await prisma.testimonial.delete({ where: { id } });
      break;
    case "faq":
      await prisma.faq.delete({ where: { id } });
      break;
    case "galerie":
      await prisma.galleryItem.delete({ where: { id } });
      break;
  }
  refreshPublic();
}

async function saveResource(key: ResourceKey, input: Payload, id?: string) {
  switch (key) {
    case "experiences":
      return saveExperience(input, id);
    case "services":
      return saveService(input, id);
    case "destinations":
      return saveDestination(input, id);
    case "offres":
      return saveOffer(input, id);
    case "actualites":
      return saveArticle(input, id);
    case "temoignages":
      return saveTestimonial(input, id);
    case "faq":
      return saveFaq(input, id);
    case "galerie":
      return saveGallery(input, id);
  }
}

async function saveExperience(input: Payload, id?: string) {
  const title = required(input, "title", "Le titre");
  if ("error" in title) return title;
  const subtitle = required(input, "subtitle", "Le sous-titre");
  if ("error" in subtitle) return subtitle;
  const excerpt = required(input, "excerpt", "Le résumé");
  if ("error" in excerpt) return excerpt;
  const description = required(input, "description", "La description");
  if ("error" in description) return description;
  const slug = await uniqueSlug(text(input.slug) || title.value, id, (value) =>
    prisma.experience.findUnique({ where: { slug: value }, select: { id: true } }),
  );
  const data = {
    title: title.value,
    titleEn: text(input.titleEn),
    slug,
    subtitle: subtitle.value,
    subtitleEn: text(input.subtitleEn),
    excerpt: excerpt.value,
    excerptEn: text(input.excerptEn),
    description: description.value,
    descriptionEn: text(input.descriptionEn),
    highlights: lines(input.highlights),
    highlightsEn: lines(input.highlightsEn),
    imageUrl: text(input.imageUrl),
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id
    ? prisma.experience.update({ where: { id }, data })
    : prisma.experience.create({ data });
}

async function saveService(input: Payload, id?: string) {
  const title = required(input, "title", "Le titre");
  if ("error" in title) return title;
  const excerpt = required(input, "excerpt", "Le résumé");
  if ("error" in excerpt) return excerpt;
  const description = required(input, "description", "La description");
  if ("error" in description) return description;
  const slug = await uniqueSlug(text(input.slug) || title.value, id, (value) =>
    prisma.service.findUnique({ where: { slug: value }, select: { id: true } }),
  );
  const icon = text(input.icon) || "plane";
  const data = {
    title: title.value,
    titleEn: text(input.titleEn),
    slug,
    excerpt: excerpt.value,
    excerptEn: text(input.excerptEn),
    description: description.value,
    descriptionEn: text(input.descriptionEn),
    highlights: lines(input.highlights),
    highlightsEn: lines(input.highlightsEn),
    icon,
    imageUrl: text(input.imageUrl),
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id ? prisma.service.update({ where: { id }, data }) : prisma.service.create({ data });
}

async function saveDestination(input: Payload, id?: string) {
  const name = required(input, "name", "Le nom");
  if ("error" in name) return name;
  const excerpt = required(input, "excerpt", "Le résumé");
  if ("error" in excerpt) return excerpt;
  const description = required(input, "description", "La description");
  if ("error" in description) return description;
  const slug = await uniqueSlug(text(input.slug) || name.value, id, (value) =>
    prisma.destination.findUnique({ where: { slug: value }, select: { id: true } }),
  );
  const data = {
    name: name.value,
    nameEn: text(input.nameEn),
    slug,
    region: text(input.region),
    regionEn: text(input.regionEn),
    excerpt: excerpt.value,
    excerptEn: text(input.excerptEn),
    description: description.value,
    descriptionEn: text(input.descriptionEn),
    imageUrl: text(input.imageUrl),
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id
    ? prisma.destination.update({ where: { id }, data })
    : prisma.destination.create({ data });
}

async function saveOffer(input: Payload, id?: string) {
  const title = required(input, "title", "Le titre");
  if ("error" in title) return title;
  const destinationLabel = required(input, "destinationLabel", "La destination");
  if ("error" in destinationLabel) return destinationLabel;
  const excerpt = required(input, "excerpt", "Le résumé");
  if ("error" in excerpt) return excerpt;
  const description = required(input, "description", "La description");
  if ("error" in description) return description;
  const slug = await uniqueSlug(text(input.slug) || title.value, id, (value) =>
    prisma.offer.findUnique({ where: { slug: value }, select: { id: true } }),
  );
  const data = {
    title: title.value,
    titleEn: text(input.titleEn),
    slug,
    destinationLabel: destinationLabel.value,
    destinationLabelEn: text(input.destinationLabelEn),
    excerpt: excerpt.value,
    excerptEn: text(input.excerptEn),
    description: description.value,
    descriptionEn: text(input.descriptionEn),
    priceFrom: integer(input.priceFrom),
    badge: text(input.badge),
    badgeEn: text(input.badgeEn),
    imageUrl: text(input.imageUrl),
    featured: flag(input.featured, false),
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id ? prisma.offer.update({ where: { id }, data }) : prisma.offer.create({ data });
}

async function saveArticle(input: Payload, id?: string) {
  const title = required(input, "title", "Le titre");
  if ("error" in title) return title;
  const excerpt = required(input, "excerpt", "Le résumé");
  if ("error" in excerpt) return excerpt;
  const content = required(input, "content", "Le contenu");
  if ("error" in content) return content;
  const slug = await uniqueSlug(text(input.slug) || title.value, id, (value) =>
    prisma.article.findUnique({ where: { slug: value }, select: { id: true } }),
  );
  const data = {
    title: title.value,
    titleEn: text(input.titleEn),
    slug,
    excerpt: excerpt.value,
    excerptEn: text(input.excerptEn),
    content: content.value,
    contentEn: text(input.contentEn),
    imageUrl: text(input.imageUrl),
    published: flag(input.published, false),
    publishedAt: dateOrNull(input.publishedAt) ?? (flag(input.published, false) ? new Date() : null),
  };
  return id ? prisma.article.update({ where: { id }, data }) : prisma.article.create({ data });
}

async function saveTestimonial(input: Payload, id?: string) {
  const authorName = required(input, "authorName", "Le nom");
  if ("error" in authorName) return authorName;
  const content = required(input, "content", "Le témoignage");
  if ("error" in content) return content;
  const rating = Math.min(5, Math.max(1, integer(input.rating) ?? 5));
  const data = {
    authorName: authorName.value,
    location: text(input.location),
    content: content.value,
    contentEn: text(input.contentEn),
    rating,
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id
    ? prisma.testimonial.update({ where: { id }, data })
    : prisma.testimonial.create({ data });
}

async function saveFaq(input: Payload, id?: string) {
  const question = required(input, "question", "La question");
  if ("error" in question) return question;
  const answer = required(input, "answer", "La réponse");
  if ("error" in answer) return answer;
  const data = {
    question: question.value,
    questionEn: text(input.questionEn),
    answer: answer.value,
    answerEn: text(input.answerEn),
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id ? prisma.faq.update({ where: { id }, data }) : prisma.faq.create({ data });
}

async function saveGallery(input: Payload, id?: string) {
  const title = required(input, "title", "Le titre");
  if ("error" in title) return title;
  const imageUrl = text(input.imageUrl);
  if (!imageUrl) return { error: "Ajoutez une image ou un lien." };
  const category = text(input.category);
  const allowed: GalleryCategory[] = ["PHOTO", "VIDEO", "EVENEMENT"];
  const data = {
    title: title.value,
    titleEn: text(input.titleEn),
    caption: text(input.caption),
    captionEn: text(input.captionEn),
    category: (allowed.includes(category as GalleryCategory) ? category : "PHOTO") as GalleryCategory,
    imageUrl,
    published: flag(input.published, true),
    sortOrder: integer(input.sortOrder) ?? 0,
  };
  return id
    ? prisma.galleryItem.update({ where: { id }, data })
    : prisma.galleryItem.create({ data });
}
