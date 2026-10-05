export const resourceKeys = [
  "experiences",
  "services",
  "destinations",
  "offres",
  "actualites",
  "temoignages",
  "faq",
  "galerie",
] as const;

export type ResourceKey = (typeof resourceKeys)[number];

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "image"; required?: boolean }
  | { name: string; label: string; type: "number"; required?: boolean }
  | { name: string; label: string; type: "checkbox" }
  | { name: string; label: string; type: "lines"; help?: string }
  | { name: string; label: string; type: "date" }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[] };

export type ResourceConfig = {
  key: ResourceKey;
  title: string;
  singular: string;
  description: string;
  publicPath: string;
  fields: Field[];
  columns: { key: string; label: string }[];
};

const published = { name: "published", label: "Publié", type: "checkbox" } as const;
const sortOrder = { name: "sortOrder", label: "Ordre d'affichage", type: "number" } as const;
const image = { name: "imageUrl", label: "Image", type: "image" } as const;

export const resources: Record<ResourceKey, ResourceConfig> = {
  experiences: {
    key: "experiences",
    title: "Expériences",
    singular: "expérience",
    description: "DIM Junior, DIM Corporate et Voyages spirituels.",
    publicPath: "/experiences",
    columns: [
      { key: "title", label: "Titre" },
      { key: "subtitle", label: "Accroche" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "subtitle", label: "Sous-titre", type: "text", required: true },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "highlights", label: "Points forts", type: "lines", help: "Un point par ligne" },
      image,
      published,
      sortOrder,
    ],
  },
  services: {
    key: "services",
    title: "Services",
    singular: "service",
    description: "Billetterie, hôtels, visa, voyages organisés et circuits.",
    publicPath: "/services",
    columns: [
      { key: "title", label: "Titre" },
      { key: "excerpt", label: "Résumé" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "highlights", label: "Points forts", type: "lines", help: "Un point par ligne" },
      {
        name: "icon",
        label: "Icône",
        type: "select",
        options: [
          { value: "plane", label: "Avion" },
          { value: "hotel", label: "Hôtel" },
          { value: "visa", label: "Visa" },
          { value: "route", label: "Itinéraire" },
          { value: "compass", label: "Boussole" },
        ],
      },
      image,
      published,
      sortOrder,
    ],
  },
  destinations: {
    key: "destinations",
    title: "Destinations",
    singular: "destination",
    description: "Les destinations proposées sur le site.",
    publicPath: "/destinations",
    columns: [
      { key: "name", label: "Nom" },
      { key: "region", label: "Région" },
    ],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "region", label: "Région", type: "text" },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      image,
      published,
      sortOrder,
    ],
  },
  offres: {
    key: "offres",
    title: "Offres",
    singular: "offre",
    description: "Séjours, circuits et formules affichés sur le site.",
    publicPath: "/offres",
    columns: [
      { key: "title", label: "Titre" },
      { key: "destinationLabel", label: "Destination" },
      { key: "priceFrom", label: "Prix dès" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "destinationLabel", label: "Destination affichée", type: "text", required: true },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "priceFrom", label: "Prix à partir de (FCFA)", type: "number" },
      { name: "badge", label: "Badge", type: "text" },
      { name: "featured", label: "Mettre en avant", type: "checkbox" },
      image,
      published,
      sortOrder,
    ],
  },
  actualites: {
    key: "actualites",
    title: "Actualités",
    singular: "actualité",
    description: "Articles et promotions.",
    publicPath: "/actualites",
    columns: [
      { key: "title", label: "Titre" },
      { key: "excerpt", label: "Résumé" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "content", label: "Contenu", type: "textarea", required: true },
      { name: "publishedAt", label: "Date de publication", type: "date" },
      image,
      published,
    ],
  },
  temoignages: {
    key: "temoignages",
    title: "Témoignages",
    singular: "témoignage",
    description: "Avis affichés sur la page d'accueil.",
    publicPath: "/",
    columns: [
      { key: "authorName", label: "Auteur" },
      { key: "location", label: "Ville" },
      { key: "rating", label: "Note" },
    ],
    fields: [
      { name: "authorName", label: "Nom", type: "text", required: true },
      { name: "location", label: "Ville", type: "text" },
      { name: "content", label: "Témoignage", type: "textarea", required: true },
      { name: "rating", label: "Note (1 à 5)", type: "number", required: true },
      published,
      sortOrder,
    ],
  },
  faq: {
    key: "faq",
    title: "FAQ",
    singular: "question",
    description: "Questions fréquentes.",
    publicPath: "/faq",
    columns: [{ key: "question", label: "Question" }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Réponse", type: "textarea", required: true },
      published,
      sortOrder,
    ],
  },
  galerie: {
    key: "galerie",
    title: "Galerie",
    singular: "visuel",
    description: "Photos, vidéos et événements.",
    publicPath: "/galerie",
    columns: [
      { key: "title", label: "Titre" },
      { key: "category", label: "Catégorie" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "caption", label: "Légende", type: "text" },
      {
        name: "category",
        label: "Catégorie",
        type: "select",
        options: [
          { value: "PHOTO", label: "Photo" },
          { value: "VIDEO", label: "Vidéo" },
          { value: "EVENEMENT", label: "Événement" },
        ],
      },
      { name: "imageUrl", label: "Image ou lien vidéo", type: "image", required: true },
      published,
      sortOrder,
    ],
  },
};

export function isResourceKey(value: string): value is ResourceKey {
  return resourceKeys.includes(value as ResourceKey);
}
