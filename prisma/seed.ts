import "dotenv/config";
import bcrypt from "bcryptjs";
import { defaultSettings, images } from "../src/lib/constants";
import { prisma } from "../src/lib/prisma";
import { applyEnglish } from "./english";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@dimvoyages.ci";
  const password = process.env.ADMIN_PASSWORD || "DimVoyages2026!";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name: "Admin DIM",
        role: "ADMIN",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
  }

  await prisma.offer.deleteMany();
  await prisma.article.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.service.deleteMany();
  await prisma.destination.deleteMany();

  const junior = await prisma.experience.create({
    data: {
      slug: "dim-junior",
      title: "DIM Junior",
      subtitle: "Des aventures inoubliables pour les jeunes explorateurs",
      excerpt: "Séjours, colonies et sorties éducatives pensés pour les enfants et les adolescents.",
      description:
        "DIM Junior accompagne les jeunes voyageurs, les familles et les établissements. Chaque programme est préparé avec un encadrement clair, un rythme adapté et des activités qui donnent envie de découvrir le monde.",
      highlights: [
        "Programmes adaptés à l'âge",
        "Encadrement et suivi des groupes",
        "Séjours éducatifs et colonies de vacances",
        "Accompagnement des familles",
      ],
      imageUrl: images.junior,
      sortOrder: 1,
    },
  });

  const corporate = await prisma.experience.create({
    data: {
      slug: "dim-corporate",
      title: "DIM Corporate",
      subtitle: "Séminaires, incentives et voyages d'entreprise",
      excerpt: "Une organisation fluide pour les équipes, les institutions et les groupes professionnels.",
      description:
        "DIM Corporate prend en charge les déplacements professionnels : séminaires, team building, incentives et voyages de groupe. Nous coordonnons les vols, l'hébergement et le déroulé pour que vous restiez concentrés sur vos objectifs.",
      highlights: [
        "Séminaires et réunions délocalisées",
        "Team building et incentives",
        "Logistique de groupe",
        "Interlocuteur unique",
      ],
      imageUrl: images.corporate,
      sortOrder: 2,
    },
  });

  const spirituel = await prisma.experience.create({
    data: {
      slug: "voyages-spirituels",
      title: "Voyages spirituels",
      subtitle: "Omrah et Hajj, un accompagnement serein",
      excerpt: "Des formules accompagnées pour vivre Omrah et Hajj dans de bonnes conditions.",
      description:
        "DIM VOYAGES organise des voyages spirituels avec un accompagnement attentif : formalités, hébergement, transports et présence d'une équipe qui connaît le chemin. Chaque départ est préparé pour que les pèlerins voyagent sereinement.",
      highlights: [
        "Formules Omrah et Hajj",
        "Accompagnement avant le départ",
        "Hébergement et transferts",
        "Suivi du groupe",
      ],
      imageUrl: images.mecca,
      sortOrder: 3,
    },
  });

  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        slug: "cote-divoire",
        name: "Côte d'Ivoire",
        region: "Afrique de l'Ouest",
        excerpt: "Plages, lagunes et escapades à partir d'Abidjan.",
        description:
          "La Côte d'Ivoire se découvre aussi près de chez soi : littoral, villes et séjours de détente. DIM VOYAGES compose des escapades simples à organiser depuis Abidjan.",
        imageUrl: images.beach,
        sortOrder: 1,
      },
    }),
    prisma.destination.create({
      data: {
        slug: "afrique",
        name: "Afrique",
        region: "Continent",
        excerpt: "Safaris, capitales et circuits à travers le continent.",
        description:
          "Du Maroc à l'Afrique de l'Est, nous préparons des circuits qui laissent le temps de voir, de rencontrer et de revenir avec des souvenirs précis.",
        imageUrl: images.safari,
        sortOrder: 2,
      },
    }),
    prisma.destination.create({
      data: {
        slug: "europe",
        name: "Europe",
        region: "Continent",
        excerpt: "Capitales, circuits et séjours culturels.",
        description:
          "Visiter l'Europe avec un itinéraire clair : vols, hôtels et rythme de visite ajustés à la durée de votre séjour.",
        imageUrl: images.europe,
        sortOrder: 3,
      },
    }),
    prisma.destination.create({
      data: {
        slug: "moyen-orient",
        name: "Moyen-Orient",
        region: "Région",
        excerpt: "Omrah, villes modernes et voyages en famille.",
        description:
          "Le Moyen-Orient accueille aussi bien les voyages spirituels que les séjours en famille. Nous vous aidons à choisir la formule qui correspond à votre projet.",
        imageUrl: images.dubai,
        sortOrder: 4,
      },
    }),
    prisma.destination.create({
      data: {
        slug: "asie",
        name: "Asie",
        region: "Continent",
        excerpt: "Temples, mégalopoles et plages lointaines.",
        description:
          "L'Asie se prépare à l'avance. DIM VOYAGES vous aide sur les vols, les étapes et les formalités pour un voyage fluide.",
        imageUrl: images.asia,
        sortOrder: 5,
      },
    }),
  ]);

  const [ci, afrique, europe, orient, asie] = destinations;

  await prisma.service.createMany({
    data: [
      {
        slug: "billetterie-aerienne",
        title: "Billetterie aérienne",
        excerpt: "Vols vers toutes destinations, au meilleur rythme pour votre projet.",
        description:
          "Nous recherchons et réservons vos billets d'avion : aller simple, aller-retour, groupes et correspondances. Vous recevez une proposition claire, puis DIM VOYAGES vous contacte pour confirmer.",
        icon: "plane",
        imageUrl: images.plane,
        sortOrder: 1,
      },
      {
        slug: "reservation-hotels",
        title: "Réservation d'hôtels",
        excerpt: "Des hébergements choisis selon votre budget et votre style de voyage.",
        description:
          "Hôtels, résidences et lodges : nous sélectionnons des adresses cohérentes avec votre séjour et nous nous occupons de la réservation.",
        icon: "hotel",
        imageUrl: images.hotel,
        sortOrder: 2,
      },
      {
        slug: "assistance-visa",
        title: "Assistance visa",
        excerpt: "Un accompagnement pour constituer un dossier de visa plus serein.",
        description:
          "Selon la destination, nous vous indiquons les pièces habituellement demandées et nous vous aidons à préparer votre dossier. La décision finale appartient aux autorités.",
        icon: "visa",
        imageUrl: images.visa,
        sortOrder: 3,
      },
      {
        slug: "voyages-organises",
        title: "Voyages organisés",
        excerpt: "Des séjours prêts à vivre, avec un accompagnement de bout en bout.",
        description:
          "Vous choisissez une formule, nous réunissons le transport, l'hébergement et les étapes. Le voyage reste ajustable selon vos dates et le nombre de voyageurs.",
        icon: "route",
        imageUrl: images.resort,
        sortOrder: 4,
      },
      {
        slug: "circuits-excursions",
        title: "Circuits & excursions",
        excerpt: "Des itinéraires pour voir davantage, sans vous perdre dans l'organisation.",
        description:
          "Circuits de plusieurs jours ou excursions plus courtes : nous construisons un fil conducteur, les transferts et les temps forts de votre voyage.",
        icon: "compass",
        imageUrl: images.circuit,
        sortOrder: 5,
      },
    ],
  });

  await prisma.offer.createMany({
    data: [
      {
        title: "Séjour plage — Côte d'Ivoire",
        slug: "sejour-plage-cote-divoire",
        destinationLabel: "Côte d'Ivoire",
        excerpt: "Quelques jours au bord de l'eau, faciles à organiser depuis Abidjan.",
        description:
          "Une escapade balnéaire pour souffler : hébergement, transferts et rythme tranquille. Le tarif annoncé est un point de départ, la proposition finale dépend des dates et du nombre de voyageurs.",
        priceFrom: 450000,
        badge: "-10%",
        imageUrl: images.aerial,
        featured: true,
        sortOrder: 1,
        destinationId: ci.id,
      },
      {
        title: "Week-end lagune — Assinie",
        slug: "weekend-lagune-assinie",
        destinationLabel: "Côte d'Ivoire",
        excerpt: "Deux jours au calme, faciles à rejoindre depuis Abidjan.",
        description:
          "Une courte escapade au bord de la lagune : hébergement et transferts. Le tarif annoncé est un point de départ, la proposition finale dépend des dates et du nombre de voyageurs.",
        priceFrom: 280000,
        badge: "Week-end",
        imageUrl: images.beach,
        sortOrder: 2,
        destinationId: ci.id,
      },
      {
        title: "Escapade Grand-Bassam",
        slug: "escapade-grand-bassam",
        destinationLabel: "Côte d'Ivoire",
        excerpt: "Une nuit sur la côte, entre plage et vieille ville.",
        description:
          "Grand-Bassam le temps d'une escapade : hébergement près de la plage et un rythme libre. DIM VOYAGES confirme le détail selon vos dates.",
        priceFrom: 190000,
        badge: "Court séjour",
        imageUrl: images.resort,
        sortOrder: 3,
        destinationId: ci.id,
      },
      {
        title: "Circuit Europe — 7 jours",
        slug: "circuit-europe-7-jours",
        destinationLabel: "Europe",
        excerpt: "Une semaine pour découvrir une grande ville et ses alentours.",
        description:
          "Vols, hôtel et itinéraire sur sept jours. Nous ajustons les visites selon vos envies : culture, shopping ou temps libre.",
        priceFrom: 1200000,
        badge: "Circuit",
        imageUrl: images.paris,
        featured: true,
        sortOrder: 2,
        destinationId: europe.id,
      },
      {
        title: "Week-end dans une vieille ville",
        slug: "weekend-vieille-ville-europe",
        destinationLabel: "Europe",
        excerpt: "Quelques jours entre ruelles, places et tables en terrasse.",
        description:
          "Un court séjour dans une ville européenne au charme ancien : vol, hôtel et temps libre. Le tarif annoncé est un point de départ, la proposition finale dépend des dates.",
        priceFrom: 890000,
        badge: "Week-end",
        imageUrl: images.europe,
        sortOrder: 8,
        destinationId: europe.id,
      },
      {
        title: "Escapade à Santorin",
        slug: "escapade-santorin",
        destinationLabel: "Europe",
        excerpt: "Mer, villages blancs et un rythme plus lent.",
        description:
          "Une escapade dans les îles : hébergement et transferts. DIM VOYAGES ajuste le départ depuis Abidjan selon vos dates et le nombre de voyageurs.",
        priceFrom: 1650000,
        badge: "Escapade",
        imageUrl: images.santorini,
        sortOrder: 9,
        destinationId: europe.id,
      },
      {
        title: "Omrah — Formule confort",
        slug: "omrah-formule-confort",
        destinationLabel: "Moyen-Orient",
        excerpt: "Une formule accompagnée pour accomplir la Omrah sereinement.",
        description:
          "Hébergement, transferts et accompagnement du groupe. Les disponibilités varient selon la période. DIM VOYAGES vous recontacte pour confirmer les détails.",
        priceFrom: 1450000,
        badge: "-15%",
        imageUrl: images.omrah,
        featured: true,
        sortOrder: 3,
        destinationId: orient.id,
        experienceId: spirituel.id,
      },
      {
        title: "Vacances en famille — Dubaï",
        slug: "vacances-en-famille-dubai",
        destinationLabel: "Dubaï",
        excerpt: "Un séjour familial entre visites, détente et temps libre.",
        description:
          "Une base confortable pour visiter Dubaï en famille. Le programme peut inclure les incontournables ou rester plus libre, selon votre rythme.",
        priceFrom: 1800000,
        badge: "-20%",
        imageUrl: images.family,
        featured: true,
        sortOrder: 4,
        destinationId: orient.id,
      },
      {
        title: "Séjour à Doha — Qatar",
        slug: "sejour-doha-qatar",
        destinationLabel: "Qatar",
        excerpt: "Une ville moderne au bord du golfe, à organiser depuis Abidjan.",
        description:
          "Vol, hôtel et temps libre à Doha. Le programme peut rester souple ou inclure les incontournables. Le tarif annoncé est un point de départ, la proposition finale dépend des dates et du nombre de voyageurs.",
        priceFrom: 1550000,
        badge: "Séjour",
        imageUrl: images.qatar,
        sortOrder: 10,
        destinationId: orient.id,
      },
      {
        title: "Safari — Afrique de l'Est",
        slug: "safari-afrique-est",
        destinationLabel: "Afrique",
        excerpt: "Un circuit nature pour observer la faune et changer d'horizon.",
        description:
          "Étapes, lodges et transferts sont préparés ensemble. Idéal pour un voyage exceptionnel, en couple ou en petit groupe.",
        priceFrom: 2100000,
        badge: "Safari",
        imageUrl: images.africa,
        sortOrder: 5,
        destinationId: afrique.id,
      },
      {
        title: "Villes impériales — Maroc",
        slug: "villes-imperiales-maroc",
        destinationLabel: "Afrique",
        excerpt: "Un circuit culturel entre médinas, palais et jardins.",
        description:
          "Quelques jours pour relier des villes du Maroc : vols, hôtels et visites au rythme du groupe. Le tarif annoncé est un point de départ, la proposition finale dépend des dates.",
        priceFrom: 980000,
        badge: "Circuit",
        imageUrl: images.morocco,
        sortOrder: 6,
        destinationId: afrique.id,
      },
      {
        title: "Nuit dans le désert",
        slug: "nuit-dans-le-desert",
        destinationLabel: "Afrique",
        excerpt: "Une escapade au calme, loin des grandes villes.",
        description:
          "Transfert, campement et une nuit sous les étoiles. DIM VOYAGES ajuste le départ depuis Abidjan selon vos dates et le nombre de voyageurs.",
        priceFrom: 750000,
        badge: "Escapade",
        imageUrl: images.desert,
        sortOrder: 7,
        destinationId: afrique.id,
      },
      {
        title: "Escapade à Tokyo — Japon",
        slug: "escapade-tokyo-japon",
        destinationLabel: "Japon",
        excerpt: "Une grande ville à découvrir la nuit, entre tours et quartiers animés.",
        description:
          "Vol, hôtel et temps libre à Tokyo. Le programme peut rester souple ou suivre quelques incontournables. Le tarif annoncé est un point de départ, la proposition finale dépend des dates et du nombre de voyageurs.",
        priceFrom: 2450000,
        badge: "Escapade",
        imageUrl: images.tokyo,
        sortOrder: 11,
        destinationId: asie.id,
      },
      {
        title: "Séjour à Ubud — Bali",
        slug: "sejour-ubud-bali",
        destinationLabel: "Bali",
        excerpt: "Rizières, temples et un rythme plus calme au cœur de l'île.",
        description:
          "Un séjour à Ubud, avec hébergement et transferts. DIM VOYAGES ajuste le départ depuis Abidjan selon vos dates et le nombre de voyageurs.",
        priceFrom: 1850000,
        badge: "Séjour",
        imageUrl: images.bali,
        sortOrder: 12,
        destinationId: asie.id,
      },
      {
        title: "Plages de Phuket — Thaïlande",
        slug: "plages-phuket-thailande",
        destinationLabel: "Thaïlande",
        excerpt: "Une île au bord d'une eau claire, pour se reposer loin d'Abidjan.",
        description:
          "Vol, hôtel en bord de mer et temps libre à Phuket. Le tarif annoncé est un point de départ, la proposition finale dépend des dates et du nombre de voyageurs.",
        priceFrom: 1650000,
        badge: "Plage",
        imageUrl: images.phuket,
        sortOrder: 13,
        destinationId: asie.id,
      },
    ],
  });

  const publishedAt = (iso: string) => new Date(iso);

  await prisma.article.createMany({
    data: [
      {
        title: "Spécial vacances : -15 % sur nos circuits Afrique",
        slug: "special-vacances-circuits-afrique",
        excerpt: "Une sélection de circuits africains proposée pendant la période de vacances.",
        content:
          "DIM VOYAGES met en avant une sélection de circuits en Afrique. La réduction annoncée s'applique aux formules concernées, selon les dates et les places disponibles.\n\nPour en profiter, envoyez une demande de devis. Un conseiller vous répond par WhatsApp, téléphone ou email avec une proposition adaptée.",
        imageUrl: images.safari,
        published: true,
        publishedAt: publishedAt("2026-04-12"),
      },
      {
        title: "Nouveau programme DIM Junior",
        slug: "nouveau-programme-dim-junior",
        excerpt: "Des séjours pensés pour les jeunes explorateurs et les groupes scolaires.",
        content:
          "Le programme DIM Junior évolue avec de nouvelles idées de séjours : découverte, activités et encadrement.\n\nLes familles et les établissements peuvent déposer une préinscription. DIM VOYAGES recontacte ensuite les responsables pour préciser les dates, l'âge des participants et le niveau d'accompagnement.",
        imageUrl: images.junior,
        published: true,
        publishedAt: publishedAt("2026-04-06"),
      },
      {
        title: "5 repères pour bien préparer votre voyage",
        slug: "preparer-votre-voyage",
        excerpt: "Passeport, délais, budget et demandes : les essentiels avant de partir.",
        content:
          "1. Vérifiez la validité du passeport.\n2. Anticipez le visa lorsque la destination l'exige.\n3. Fixez une période et un budget indicatif.\n4. Dites-nous qui voyage : famille, couple, groupe ou entreprise.\n5. Envoyez votre demande. Nous revenons vers vous pour affiner la proposition.\n\nAucun paiement en ligne n'est demandé à cette étape.",
        imageUrl: images.map,
        published: true,
        publishedAt: publishedAt("2026-03-28"),
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Mariam K.",
        location: "Abidjan",
        content:
          "Une expérience incroyable ! Tout était parfaitement organisé, de la réservation à notre retour. Merci à toute l'équipe de DIM Voyages pour leur professionnalisme et leur bienveillance.",
        rating: 5,
        sortOrder: 1,
      },
      {
        authorName: "Yao S.",
        location: "Abidjan",
        content:
          "Un accompagnement professionnel et une grande disponibilité. Je recommande DIM VOYAGES pour un voyage préparé avec sérieux.",
        rating: 5,
        sortOrder: 2,
      },
      {
        authorName: "Fatou B.",
        location: "Cocody",
        content:
          "Des souvenirs inoubliables pour toute la famille. Merci pour votre écoute et votre excellent service.",
        rating: 5,
        sortOrder: 3,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "Comment faire une demande de voyage ?",
        answer:
          "Remplissez le formulaire de demande en indiquant la destination, les dates souhaitées et le nombre de voyageurs. DIM VOYAGES enregistre votre demande et vous contacte par WhatsApp, téléphone ou email.",
        sortOrder: 1,
      },
      {
        question: "Quels sont les documents nécessaires pour un voyage ?",
        answer:
          "Le passeport est presque toujours indispensable. Selon la destination, un visa et des justificatifs complémentaires peuvent être demandés. Nous vous précisons la liste utile au moment de l'échange.",
        sortOrder: 2,
      },
      {
        question: "Comment s'inscrire à DIM Junior ?",
        answer:
          "Déposez une préinscription avec les coordonnées du responsable, l'âge des participants et le projet de séjour. Notre équipe revient vers vous pour construire le programme.",
        sortOrder: 3,
      },
      {
        question: "Quels sont les délais pour obtenir un visa ?",
        answer:
          "Les délais dépendent du pays et de la période. Plus la demande est anticipée, plus l'accompagnement est confortable. La décision appartient aux autorités compétentes.",
        sortOrder: 4,
      },
      {
        question: "Proposez-vous des voyages sur mesure ?",
        answer:
          "Oui. Les offres du site sont des points de départ. Chaque demande peut être ajustée : dates, budget, nombre de personnes et type d'expérience.",
        sortOrder: 5,
      },
      {
        question: "Comment vous contacter ?",
        answer:
          "Par WhatsApp au 07 00 15 69 81, par téléphone au même numéro, par email à info@dimvoyages.net, ou via le formulaire de contact. L'agence est basée à Abidjan.",
        sortOrder: 6,
      },
      {
        question: "Peut-on payer en ligne ?",
        answer:
          "Pas pour le moment. Vous envoyez votre demande, puis DIM VOYAGES vous contacte pour la suite. Le paiement en ligne pourra être ajouté plus tard.",
        sortOrder: 7,
      },
    ],
  });

  await prisma.galleryItem.createMany({
    data: [
      { title: "Lagon", caption: "Escale au bord de l'eau", category: "PHOTO", imageUrl: images.aerial, sortOrder: 1 },
      { title: "Safari", caption: "Afrique sauvage", category: "PHOTO", imageUrl: images.safari, sortOrder: 2 },
      { title: "Europe", caption: "Villes et lumières", category: "PHOTO", imageUrl: images.europe, sortOrder: 3 },
      { title: "Moyen-Orient", caption: "Voyage spirituel", category: "EVENEMENT", imageUrl: images.omrah, sortOrder: 4 },
      { title: "Asie", caption: "Temples et horizons", category: "PHOTO", imageUrl: images.asia, sortOrder: 5 },
      { title: "DIM Junior", caption: "Jeunes explorateurs", category: "EVENEMENT", imageUrl: images.junior, sortOrder: 6 },
      { title: "Séjour", caption: "Détente et lumière", category: "PHOTO", imageUrl: images.resort, sortOrder: 7 },
      { title: "Envol", caption: "La route commence ici", category: "PHOTO", imageUrl: images.plane, sortOrder: 8 },
      { title: "Maroc", caption: "Couleurs et villes", category: "PHOTO", imageUrl: images.morocco, sortOrder: 9 },
      { title: "Séminaire", caption: "Une salle à l'écoute", category: "EVENEMENT", imageUrl: images.seminar, sortOrder: 10 },
      { title: "Réception", caption: "Une table dressée pour l'occasion", category: "EVENEMENT", imageUrl: images.reception, sortOrder: 11 },
      { title: "Soirée", caption: "Lumières et musique", category: "EVENEMENT", imageUrl: images.show, sortOrder: 12 },
      { title: "Célébration", caption: "Confettis et applaudissements", category: "EVENEMENT", imageUrl: images.celebration, sortOrder: 13 },
      { title: "Santorin", caption: "Villages blancs au bord de la mer", category: "PHOTO", imageUrl: images.santorini, sortOrder: 14 },
      { title: "Désert", caption: "Dunes et horizon", category: "PHOTO", imageUrl: images.desert, sortOrder: 15 },
      { title: "Côte d'Ivoire", caption: "Terre d'hospitalité", category: "VIDEO", imageUrl: "https://www.youtube.com/watch?v=O1-ITxcVeAM", sortOrder: 16 },
      { title: "Dubaï", caption: "Une ville à découvrir", category: "VIDEO", imageUrl: "https://www.youtube.com/watch?v=v12XLp1ED5c", sortOrder: 17 },
      { title: "Safari", caption: "Afrique de l'Est", category: "VIDEO", imageUrl: "https://www.youtube.com/watch?v=pHMfciDU-zI", sortOrder: 18 },
    ],
  });

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  await applyEnglish(prisma);

  void junior;
  void corporate;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
