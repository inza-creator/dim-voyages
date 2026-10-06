import type { Locale } from "@/lib/i18n";
import type { PublicSettings } from "@/lib/constants";

export function localize(locale: Locale, french: string, english?: string | null) {
  const value = english?.trim();
  if (locale === "en" && value) return value;
  return french;
}

export function localizeList(locale: Locale, french: string[], english?: string[] | null) {
  if (locale === "en" && english?.some((line) => line.trim())) {
    return english.map((line) => line.trim()).filter(Boolean);
  }
  return french;
}

type ExperienceText = {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  excerpt: string;
  excerptEn: string;
  description: string;
  descriptionEn: string;
  highlights: string[];
  highlightsEn: string[];
};

type ServiceText = {
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  description: string;
  descriptionEn: string;
  highlights: string[];
  highlightsEn: string[];
};

type DestinationText = {
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
  excerpt: string;
  excerptEn: string;
  description: string;
  descriptionEn: string;
  offers?: OfferText[];
};

type OfferText = {
  title: string;
  titleEn: string;
  destinationLabel: string;
  destinationLabelEn: string;
  excerpt: string;
  excerptEn: string;
  description: string;
  descriptionEn: string;
  badge: string;
  badgeEn: string;
};

type ArticleText = {
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
};

type TestimonialText = { content: string; contentEn: string };
type FaqText = { question: string; questionEn: string; answer: string; answerEn: string };
type GalleryText = { title: string; titleEn: string; caption: string; captionEn: string };

export function presentExperience<T extends ExperienceText>(item: T, locale: Locale): T {
  return {
    ...item,
    title: localize(locale, item.title, item.titleEn),
    subtitle: localize(locale, item.subtitle, item.subtitleEn),
    excerpt: localize(locale, item.excerpt, item.excerptEn),
    description: localize(locale, item.description, item.descriptionEn),
    highlights: localizeList(locale, item.highlights, item.highlightsEn),
  } as T;
}

export function presentService<T extends ServiceText>(item: T, locale: Locale): T {
  return {
    ...item,
    title: localize(locale, item.title, item.titleEn),
    excerpt: localize(locale, item.excerpt, item.excerptEn),
    description: localize(locale, item.description, item.descriptionEn),
    highlights: localizeList(locale, item.highlights, item.highlightsEn),
  } as T;
}

export function presentOffer<T extends OfferText>(item: T, locale: Locale): T {
  return {
    ...item,
    title: localize(locale, item.title, item.titleEn),
    destinationLabel: localize(locale, item.destinationLabel, item.destinationLabelEn),
    excerpt: localize(locale, item.excerpt, item.excerptEn),
    description: localize(locale, item.description, item.descriptionEn),
    badge: localize(locale, item.badge, item.badgeEn),
  } as T;
}

export function presentDestination<T extends DestinationText>(item: T, locale: Locale): T {
  return {
    ...item,
    name: localize(locale, item.name, item.nameEn),
    region: localize(locale, item.region, item.regionEn),
    excerpt: localize(locale, item.excerpt, item.excerptEn),
    description: localize(locale, item.description, item.descriptionEn),
    offers: item.offers?.map((offer) => presentOffer(offer, locale)),
  } as T;
}

export function presentArticle<T extends ArticleText>(item: T, locale: Locale): T {
  return {
    ...item,
    title: localize(locale, item.title, item.titleEn),
    excerpt: localize(locale, item.excerpt, item.excerptEn),
    content: localize(locale, item.content, item.contentEn),
  } as T;
}

export function presentTestimonial<T extends TestimonialText>(item: T, locale: Locale): T {
  return { ...item, content: localize(locale, item.content, item.contentEn) } as T;
}

export function presentFaq<T extends FaqText>(item: T, locale: Locale): T {
  return {
    ...item,
    question: localize(locale, item.question, item.questionEn),
    answer: localize(locale, item.answer, item.answerEn),
  } as T;
}

export function presentGallery<T extends GalleryText>(item: T, locale: Locale): T {
  return {
    ...item,
    title: localize(locale, item.title, item.titleEn),
    caption: localize(locale, item.caption, item.captionEn),
  } as T;
}

export function localizeSettings(settings: PublicSettings, locale: Locale): PublicSettings {
  return {
    ...settings,
    address: localize(locale, settings.address, settings.addressEn),
    signature: localize(locale, settings.signature, settings.signatureEn),
    award: localize(locale, settings.award, settings.awardEn),
    aboutText: localize(locale, settings.aboutText, settings.aboutTextEn),
  };
}
