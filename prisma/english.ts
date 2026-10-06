import type { GalleryCategory, PrismaClient } from "@prisma/client";
import { defaultSettings } from "../src/lib/constants";

const experiences = [
  {
    slug: "dim-junior",
    titleEn: "DIM Junior",
    subtitleEn: "Unforgettable adventures for young explorers",
    excerptEn: "Stays, camps and educational outings designed for children and teenagers.",
    descriptionEn:
      "DIM Junior supports young travellers and families. Each programme is prepared with clear supervision, a suitable pace and activities that make you want to discover the world.",
    highlightsEn: ["SIVAL (International Holiday and Leisure Show)", "NOELTOUR", "Support for families"],
  },
  {
    slug: "dim-corporate",
    titleEn: "DIM Corporate",
    subtitleEn: "Seminars, incentives and business trips",
    excerptEn: "Smooth organisation for teams, institutions and professional groups.",
    descriptionEn:
      "DIM Corporate handles business travel: seminars, team building, incentives and group trips. We coordinate flights, accommodation and the schedule so you can stay focused on your goals.",
    highlightsEn: [
      "Seminars and off-site meetings",
      "Team building and incentives",
      "Group logistics",
      "A single point of contact",
    ],
  },
  {
    slug: "voyages-spirituels",
    titleEn: "Spiritual journeys",
    subtitleEn: "Omrah and Hajj, calm support",
    excerptEn: "Accompanied packages to experience Omrah and Hajj in good conditions.",
    descriptionEn:
      "DIM VOYAGES organises spiritual journeys with careful support: formalities, accommodation, transport and a team that knows the way. Each departure is prepared so pilgrims can travel with peace of mind.",
    highlightsEn: ["Omrah and Hajj packages", "Support before departure", "Accommodation and transfers", "Group follow-up"],
  },
];

const services = [
  {
    slug: "voyage",
    titleEn: "Travel",
    excerptEn: "We help you organise your trips.",
    descriptionEn:
      "We organise your trips to every destination: family stays, business travel, holidays or group travel. DIM VOYAGES helps you prepare your trip and offers solutions suited to your needs and your budget.",
    highlightsEn: ["Airline ticketing", "Hotel booking", "Visa assistance", "Package tours"],
  },
  {
    slug: "tourisme",
    titleEn: "Tourism",
    excerptEn: "Discover unique destinations and live unforgettable experiences.",
    descriptionEn:
      "Choose your package and enjoy a tailor-made organised trip, including transport, accommodation and the different stages. Each programme is adapted to your dates, your needs and the number of travellers.",
    highlightsEn: ["Tours and excursions", "Holiday stays", "Discovering Côte d'Ivoire", "Group trips"],
  },
  {
    slug: "billetterie-aerienne",
    titleEn: "Airline ticketing",
    excerptEn: "Flights to every destination, at the right pace for your project.",
    descriptionEn:
      "We search for and book your plane tickets: one way, return, groups and connections. You receive a clear proposal, then DIM VOYAGES contacts you to confirm.",
    highlightsEn: [],
  },
  {
    slug: "reservation-hotels",
    titleEn: "Hotel booking",
    excerptEn: "Accommodation chosen according to your budget and your style of travel.",
    descriptionEn:
      "Hotels, residences and lodges: we select addresses that fit your stay and we take care of the booking.",
    highlightsEn: [],
  },
  {
    slug: "assistance-visa",
    titleEn: "Visa assistance",
    excerptEn: "Support to put together a visa file with more peace of mind.",
    descriptionEn:
      "Depending on the destination, we tell you the documents usually required and we help you prepare your file. The final decision belongs to the authorities.",
    highlightsEn: [],
  },
  {
    slug: "voyages-organises",
    titleEn: "Package tours",
    excerptEn: "Stays ready to enjoy, with support from start to finish.",
    descriptionEn:
      "You choose a package, we bring together transport, accommodation and the stages. The trip can still be adjusted according to your dates and the number of travellers.",
    highlightsEn: [],
  },
  {
    slug: "circuits-excursions",
    titleEn: "Tours and excursions",
    excerptEn: "Itineraries to see more, without getting lost in the organisation.",
    descriptionEn:
      "Multi-day tours or shorter excursions: we build a thread, the transfers and the highlights of your trip.",
    highlightsEn: [],
  },
  {
    slug: "evenementiel",
    titleEn: "Events",
    excerptEn: "Organise your events with support adapted to your needs.",
    descriptionEn:
      "We help you organise your events, from design to delivery, with solutions adapted to your goals, your budget and your requirements.",
    highlightsEn: ["Team building", "Seminars and conferences", "Ceremony organisation"],
  },
];

const destinations = [
  {
    slug: "cote-divoire",
    nameEn: "Côte d'Ivoire",
    regionEn: "West Africa",
    excerptEn: "Beaches, lagoons and getaways from Abidjan.",
    descriptionEn:
      "Côte d'Ivoire can also be discovered close to home: the coast, cities and relaxing stays. DIM VOYAGES puts together getaways that are simple to organise from Abidjan.",
  },
  {
    slug: "afrique",
    nameEn: "Africa",
    regionEn: "Continent",
    excerptEn: "Safaris, capitals and tours across the continent.",
    descriptionEn:
      "From Morocco to East Africa, we prepare tours that leave time to see, to meet people and to come home with precise memories.",
  },
  {
    slug: "europe",
    nameEn: "Europe",
    regionEn: "Continent",
    excerptEn: "Capitals, tours and cultural stays.",
    descriptionEn:
      "Visit Europe with a clear itinerary: flights, hotels and a pace of visits adjusted to the length of your stay.",
  },
  {
    slug: "moyen-orient",
    nameEn: "Middle East",
    regionEn: "Region",
    excerptEn: "Omrah, modern cities and family trips.",
    descriptionEn:
      "The Middle East welcomes both spiritual journeys and family stays. We help you choose the package that matches your project.",
  },
  {
    slug: "asie",
    nameEn: "Asia",
    regionEn: "Continent",
    excerptEn: "Temples, megacities and faraway beaches.",
    descriptionEn:
      "Asia is best prepared in advance. DIM VOYAGES helps with flights, stages and formalities so the trip runs smoothly.",
  },
];

const offers = [
  {
    slug: "sejour-plage-cote-divoire",
    titleEn: "Beach stay — Côte d'Ivoire",
    destinationLabelEn: "Côte d'Ivoire",
    excerptEn: "A few days by the water, easy to organise from Abidjan.",
    descriptionEn:
      "A beach getaway to unwind: accommodation, transfers and a quiet pace. The advertised price is a starting point; the final proposal depends on the dates and the number of travellers.",
    badgeEn: "-10%",
  },
  {
    slug: "weekend-lagune-assinie",
    titleEn: "Lagoon weekend — Assinie",
    destinationLabelEn: "Côte d'Ivoire",
    excerptEn: "Two quiet days, easy to reach from Abidjan.",
    descriptionEn:
      "A short getaway by the lagoon: accommodation and transfers. The advertised price is a starting point; the final proposal depends on the dates and the number of travellers.",
    badgeEn: "Weekend",
  },
  {
    slug: "circuit-europe-7-jours",
    titleEn: "Europe tour — 7 days",
    destinationLabelEn: "Europe",
    excerptEn: "A week to discover a major city and its surroundings.",
    descriptionEn:
      "Flights, hotel and a seven-day itinerary. We adjust the visits to what you want: culture, shopping or free time.",
    badgeEn: "Tour",
  },
  {
    slug: "omrah-formule-confort",
    titleEn: "Omrah — Comfort package",
    destinationLabelEn: "Middle East",
    excerptEn: "An accompanied package to perform Omrah with peace of mind.",
    descriptionEn:
      "Accommodation, transfers and group support. Availability varies by period. DIM VOYAGES contacts you to confirm the details.",
    badgeEn: "-15%",
  },
  {
    slug: "escapade-grand-bassam",
    titleEn: "Grand-Bassam getaway",
    destinationLabelEn: "Côte d'Ivoire",
    excerptEn: "One night on the coast, between the beach and the old town.",
    descriptionEn:
      "Grand-Bassam for a short getaway: accommodation near the beach and a free pace. DIM VOYAGES confirms the details according to your dates.",
    badgeEn: "Short stay",
  },
  {
    slug: "vacances-en-famille-dubai",
    titleEn: "Family holiday — Dubai",
    destinationLabelEn: "Dubai",
    excerptEn: "A family stay between sightseeing, relaxation and free time.",
    descriptionEn:
      "A comfortable base for visiting Dubai as a family. The programme can include the highlights or stay more open, depending on your pace.",
    badgeEn: "-20%",
  },
  {
    slug: "safari-afrique-est",
    titleEn: "Safari — East Africa",
    destinationLabelEn: "Africa",
    excerptEn: "A nature tour to watch wildlife and change scenery.",
    descriptionEn:
      "Stages, lodges and transfers are prepared together. Ideal for an exceptional trip, as a couple or in a small group.",
    badgeEn: "Safari",
  },
  {
    slug: "villes-imperiales-maroc",
    titleEn: "Imperial cities — Morocco",
    destinationLabelEn: "Africa",
    excerptEn: "A cultural tour between medinas, palaces and gardens.",
    descriptionEn:
      "A few days linking cities in Morocco: flights, hotels and visits at the group's pace. The advertised price is a starting point; the final proposal depends on the dates.",
    badgeEn: "Tour",
  },
  {
    slug: "nuit-dans-le-desert",
    titleEn: "A night in the desert",
    destinationLabelEn: "Africa",
    excerptEn: "A quiet getaway, away from the big cities.",
    descriptionEn:
      "Transfer, camp and a night under the stars. DIM VOYAGES adjusts the departure from Abidjan according to your dates and the number of travellers.",
    badgeEn: "Getaway",
  },
  {
    slug: "weekend-vieille-ville-europe",
    titleEn: "Weekend in an old town",
    destinationLabelEn: "Europe",
    excerptEn: "A few days among lanes, squares and terrace tables.",
    descriptionEn:
      "A short stay in a European city with old-world charm: flight, hotel and free time. The advertised price is a starting point; the final proposal depends on the dates.",
    badgeEn: "Weekend",
  },
  {
    slug: "escapade-santorin",
    titleEn: "Santorini getaway",
    destinationLabelEn: "Europe",
    excerptEn: "The sea, white villages and a slower pace.",
    descriptionEn:
      "An island getaway: accommodation and transfers. DIM VOYAGES adjusts the departure from Abidjan according to your dates and the number of travellers.",
    badgeEn: "Getaway",
  },
  {
    slug: "sejour-doha-qatar",
    titleEn: "Stay in Doha — Qatar",
    destinationLabelEn: "Qatar",
    excerptEn: "A modern city on the gulf, organised from Abidjan.",
    descriptionEn:
      "Flight, hotel and free time in Doha. The programme can stay flexible or include the highlights. The advertised price is a starting point; the final proposal depends on the dates and the number of travellers.",
    badgeEn: "Stay",
  },
  {
    slug: "escapade-tokyo-japon",
    titleEn: "Tokyo getaway — Japan",
    destinationLabelEn: "Japan",
    excerptEn: "A great city to discover at night, between towers and lively districts.",
    descriptionEn:
      "Flight, hotel and free time in Tokyo. The programme can stay flexible or follow a few highlights. The advertised price is a starting point; the final proposal depends on the dates and the number of travellers.",
    badgeEn: "Getaway",
  },
  {
    slug: "sejour-ubud-bali",
    titleEn: "Stay in Ubud — Bali",
    destinationLabelEn: "Bali",
    excerptEn: "Rice fields, temples and a calmer pace in the heart of the island.",
    descriptionEn:
      "A stay in Ubud, with accommodation and transfers. DIM VOYAGES adjusts the departure from Abidjan according to your dates and the number of travellers.",
    badgeEn: "Stay",
  },
  {
    slug: "plages-phuket-thailande",
    titleEn: "Phuket beaches — Thailand",
    destinationLabelEn: "Thailand",
    excerptEn: "An island beside clear water, to rest far from Abidjan.",
    descriptionEn:
      "Flight, a seaside hotel and free time in Phuket. The advertised price is a starting point; the final proposal depends on the dates and the number of travellers.",
    badgeEn: "Beach",
  },
];

const articles = [
  {
    slug: "special-vacances-circuits-afrique",
    titleEn: "Holiday special: -15% on our Africa tours",
    excerptEn: "A selection of African tours offered during the holiday period.",
    contentEn:
      "DIM VOYAGES is highlighting a selection of tours in Africa. The advertised discount applies to the packages concerned, depending on the dates and available places.\n\nTo take advantage of it, send a quote request. An advisor replies by WhatsApp, phone or email with a suitable proposal.",
  },
  {
    slug: "preparer-votre-voyage",
    titleEn: "5 landmarks for preparing your trip well",
    excerptEn: "Passport, lead times, budget and requests: the essentials before you leave.",
    contentEn:
      "1. Check that your passport is still valid.\n2. Plan the visa when the destination requires one.\n3. Set a period and an indicative budget.\n4. Tell us who is travelling: family, couple, group or company.\n5. Send your request. We come back to you to refine the proposal.\n\nNo online payment is requested at this stage.",
  },
  {
    slug: "nouveau-programme-dim-junior",
    titleEn: "New DIM Junior programme",
    excerptEn: "Stays designed for young explorers and school groups.",
    contentEn:
      "The DIM Junior programme is evolving with new stay ideas: discovery, activities and supervision.\n\nFamilies and schools can submit a pre-registration. DIM VOYAGES then contacts the people in charge to clarify the dates, the age of the participants and the level of support.",
  },
];

const faqs = [
  {
    question: "Comment faire une demande de voyage ?",
    questionEn: "How do I make a travel request?",
    answerEn:
      "Fill in the request form with the destination, the dates you want and the number of travellers. DIM VOYAGES records your request and contacts you by WhatsApp, phone or email.",
  },
  {
    question: "Quels sont les documents nécessaires pour un voyage ?",
    questionEn: "What documents are needed for a trip?",
    answerEn:
      "A passport is almost always essential. Depending on the destination, a visa and additional documents may be required. We give you the useful list when we talk.",
  },
  {
    question: "Comment s'inscrire à DIM Junior ?",
    questionEn: "How do I register for DIM Junior?",
    answerEn:
      "Submit a pre-registration with the contact details of the person in charge, the age of the participants and the stay you have in mind. Our team comes back to you to build the programme.",
  },
  {
    question: "Quels sont les délais pour obtenir un visa ?",
    questionEn: "How long does it take to obtain a visa?",
    answerEn:
      "Lead times depend on the country and the period. The earlier the request, the more comfortable the support. The decision belongs to the competent authorities.",
  },
  {
    question: "Proposez-vous des voyages sur mesure ?",
    questionEn: "Do you offer tailor-made trips?",
    answerEn:
      "Yes. The offers on the site are starting points. Each request can be adjusted: dates, budget, number of people and type of experience.",
  },
  {
    question: "Comment vous contacter ?",
    questionEn: "How can I contact you?",
    answerEn:
      "By WhatsApp on 07 07 16 81 86, by phone on 07 00 15 69 81, by email at info@dimvoyages.net, or through the contact form. The agency is based in Abidjan.",
  },
  {
    question: "Peut-on payer en ligne ?",
    questionEn: "Can I pay online?",
    answerEn:
      "Not for the moment. You send your request, then DIM VOYAGES contacts you for the next step. Online payment may be added later.",
  },
];

const testimonials = [
  {
    authorName: "Mariam K.",
    contentEn:
      "An incredible experience! Everything was perfectly organised, from the booking to our return. Thank you to the whole DIM Voyages team for their professionalism and their kindness.",
  },
  {
    authorName: "Fatou B.",
    contentEn: "Unforgettable memories for the whole family. Thank you for listening and for your excellent service.",
  },
];

const gallery: { title: string; category: GalleryCategory; titleEn: string; captionEn: string }[] = [
  { title: "Lagon", category: "PHOTO", titleEn: "Lagoon", captionEn: "A stop by the water" },
  { title: "Safari", category: "PHOTO", titleEn: "Safari", captionEn: "Wild Africa" },
  { title: "Europe", category: "PHOTO", titleEn: "Europe", captionEn: "Cities and lights" },
  { title: "Moyen-Orient", category: "EVENEMENT", titleEn: "Middle East", captionEn: "Spiritual journey" },
  { title: "Asie", category: "PHOTO", titleEn: "Asia", captionEn: "Temples and horizons" },
  { title: "DIM Junior", category: "EVENEMENT", titleEn: "DIM Junior", captionEn: "Young explorers" },
  { title: "Séjour", category: "PHOTO", titleEn: "Stay", captionEn: "Relaxation and light" },
  { title: "Envol", category: "PHOTO", titleEn: "Takeoff", captionEn: "The road starts here" },
  { title: "Maroc", category: "PHOTO", titleEn: "Morocco", captionEn: "Colours and cities" },
  { title: "Séminaire", category: "EVENEMENT", titleEn: "Seminar", captionEn: "A room listening" },
  { title: "Réception", category: "EVENEMENT", titleEn: "Reception", captionEn: "A table set for the occasion" },
  { title: "Soirée", category: "EVENEMENT", titleEn: "Evening", captionEn: "Lights and music" },
  { title: "Célébration", category: "EVENEMENT", titleEn: "Celebration", captionEn: "Confetti and applause" },
  { title: "Santorin", category: "PHOTO", titleEn: "Santorini", captionEn: "White villages by the sea" },
  { title: "Désert", category: "PHOTO", titleEn: "Desert", captionEn: "Dunes and horizon" },
];

export async function applyEnglish(db: PrismaClient) {
  for (const item of experiences) {
    const { slug, ...data } = item;
    await db.experience.updateMany({ where: { slug }, data });
  }
  for (const item of services) {
    const { slug, ...data } = item;
    await db.service.updateMany({ where: { slug }, data });
  }
  for (const item of destinations) {
    const { slug, ...data } = item;
    await db.destination.updateMany({ where: { slug }, data });
  }
  for (const item of offers) {
    const { slug, ...data } = item;
    await db.offer.updateMany({ where: { slug }, data });
  }
  for (const item of articles) {
    const { slug, ...data } = item;
    await db.article.updateMany({ where: { slug }, data });
  }
  for (const item of faqs) {
    await db.faq.updateMany({
      where: { question: item.question },
      data: { questionEn: item.questionEn, answerEn: item.answerEn },
    });
  }
  for (const item of testimonials) {
    await db.testimonial.updateMany({
      where: { authorName: item.authorName },
      data: { contentEn: item.contentEn },
    });
  }
  for (const item of gallery) {
    await db.galleryItem.updateMany({
      where: { title: item.title, category: item.category },
      data: { titleEn: item.titleEn, captionEn: item.captionEn },
    });
  }

  const englishSettings = {
    addressEn: defaultSettings.addressEn,
    signatureEn: defaultSettings.signatureEn,
    awardEn: defaultSettings.awardEn,
    aboutTextEn: defaultSettings.aboutTextEn,
  };
  for (const [key, value] of Object.entries(englishSettings)) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
