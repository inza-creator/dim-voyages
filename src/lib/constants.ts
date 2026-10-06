export const photo = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const images = {
  hero: photo("photo-1540202404-a2f29016b523"),
  beach: photo("photo-1507525428034-b723cf961d3e"),
  aerial: photo("photo-1506929562872-bb421503ef21"),
  safari: photo("photo-1516426122078-c23e76319801"),
  africa: photo("photo-1523805009345-7448845a9e53"),
  europe: photo("photo-1467269204594-9661b134dd2b"),
  dubai: photo("photo-1512453979798-5ea266f8880c"),
  qatar: photo("photo-1596986343464-332d54fa5702"),
  asia: photo("photo-1528183429752-a97d0bf99b5a"),
  tokyo: photo("photo-1599173704727-28abef7425e1"),
  bali: photo("photo-1557093793-d149a38a1be8"),
  phuket: photo("photo-1540544660406-6a69dacb2804"),
  mecca: photo("photo-1591604129939-f1efa4d9f7fa"),
  junior: "/images/dim-junior.jpg",
  corporate: "/images/dim-corporate.jpg",
  plane: photo("photo-1436491865332-7a61a109cc05"),
  hotel: photo("photo-1566073771259-6a8506099945"),
  visa: photo("photo-1521295121783-8a321d551ad2"),
  circuit: photo("photo-1469854523086-cc02fe5d8800"),
  family: photo("photo-1518684079-3c830dcef090"),
  omrah: photo("photo-1564769625905-50e93615e769"),
  santorini: photo("photo-1570077188670-e3a8d69ac5ff"),
  resort: photo("photo-1540541338287-41700207dee6"),
  friends: photo("photo-1539635278303-d4002c07eae3"),
  morocco: photo("photo-1489749798305-4fea3ae63d43"),
  paris: photo("photo-1502602898657-3e91760cbb34"),
  map: photo("photo-1488646953014-85cb44e25828"),
  desert: photo("photo-1509316785289-025f5b846b35"),
  seminar: photo("photo-1540575467063-178a50c2df87"),
  reception: photo("photo-1511795409834-ef04bbd61622"),
  show: photo("photo-1501281668745-f7f57925c3b4"),
  celebration: photo("photo-1492684223066-81342ee5ff30"),
};

export const defaultSettings = {
  phone: "+225 07 00 15 69 81",
  whatsapp: "2250700156981",
  email: "info@dimvoyages.net",
  address: "Abidjan, Côte d'Ivoire",
  heroImageUrl: images.hero,
  facebook: "",
  instagram: "",
  linkedin: "",
  statYears: "+10",
  statTravelers: "1000+",
  statDestinations: "50+",
  signature: "DIM VOYAGES vous accompagne partout !!!",
  award: "Prix National d'Excellence de Côte d'Ivoire 2021",
  aboutText:
    "DIM VOYAGES est une agence de voyage et de tourisme basée à Abidjan. Nous concevons des expériences sur mesure pour les particuliers, les familles, les entreprises, les institutions et les groupes. De la billetterie à l'accompagnement sur place, nous restons présents avant, pendant et après le voyage.",
};

export type PublicSettings = typeof defaultSettings;

export const requestTypeLabels: Record<string, string> = {
  VOYAGE: "Demande de voyage",
  DEVIS: "Demande de devis",
  JUNIOR: "Préinscription DIM Junior",
  CORPORATE: "Demande DIM Corporate",
  SPIRITUEL: "Demande de voyage spirituel",
  CONTACT: "Contact",
};

export const requestStatusLabels: Record<string, string> = {
  NOUVELLE: "Nouvelle",
  EN_COURS: "En cours",
  CLIENT_CONTACTE: "Client contacté",
  TRAITEE: "Traitée",
  ANNULEE: "Annulée",
};

export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/experiences", label: "Nos expériences" },
  { href: "/services", label: "Nos services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/offres", label: "Offres" },
  { href: "/a-propos", label: "À propos" },
  { href: "/galerie", label: "Galerie" },
  { href: "/actualites", label: "Actualités" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const experienceRequestType: Record<string, string> = {
  "dim-junior": "JUNIOR",
  "dim-corporate": "CORPORATE",
  "voyages-spirituels": "SPIRITUEL",
};
