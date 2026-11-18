import "dotenv/config";
import { prisma } from "../src/lib/prisma";

type Kind = "ci" | "abidjan" | "intl" | "ecowas" | "omrah" | "safari";
type Entry = { kind: Kind; fr: string; en: string; days: [string, string][]; extraIn?: [string, string][] };

const lists: Record<Kind, { in: [string, string][]; out: [string, string][] }> = {
  ci: {
    in: [
      ["Transport aller-retour depuis Abidjan", "Return transport from Abidjan"],
      ["Hébergement en hôtel sélectionné", "Accommodation in a selected hotel"],
      ["Petits-déjeuners", "Breakfasts"],
      ["Visites mentionnées au programme", "Visits listed in the itinerary"],
      ["Assistance DIM VOYAGES 7j/7", "DIM VOYAGES assistance 7 days a week"],
    ],
    out: [
      ["Repas non mentionnés", "Meals not mentioned"],
      ["Activités optionnelles", "Optional activities"],
      ["Dépenses personnelles", "Personal expenses"],
    ],
  },
  abidjan: {
    in: [
      ["Hébergement en hôtel sélectionné", "Accommodation in a selected hotel"],
      ["Petits-déjeuners", "Breakfasts"],
      ["Transferts sur place avec chauffeur", "Local transfers with driver"],
      ["Visites mentionnées au programme", "Visits listed in the itinerary"],
      ["Assistance DIM VOYAGES 7j/7", "DIM VOYAGES assistance 7 days a week"],
    ],
    out: [
      ["Billet d'avion jusqu'à Abidjan", "Flight to Abidjan"],
      ["Repas non mentionnés", "Meals not mentioned"],
      ["Dépenses personnelles", "Personal expenses"],
    ],
  },
  intl: {
    in: [
      ["Billet d'avion aller-retour au départ d'Abidjan", "Return flight from Abidjan"],
      ["Hébergement en hôtel sélectionné", "Accommodation in a selected hotel"],
      ["Petits-déjeuners", "Breakfasts"],
      ["Transferts aéroport – hôtel – aéroport", "Airport – hotel – airport transfers"],
      ["Accompagnement pour la demande de visa", "Visa application support"],
      ["Assistance DIM VOYAGES 7j/7", "DIM VOYAGES assistance 7 days a week"],
    ],
    out: [
      ["Frais de visa", "Visa fees"],
      ["Repas non mentionnés", "Meals not mentioned"],
      ["Excursions optionnelles", "Optional excursions"],
      ["Assurance voyage (proposée en option)", "Travel insurance (available as an option)"],
      ["Dépenses personnelles", "Personal expenses"],
    ],
  },
  ecowas: {
    in: [
      ["Billet d'avion aller-retour au départ d'Abidjan", "Return flight from Abidjan"],
      ["Hébergement en hôtel sélectionné", "Accommodation in a selected hotel"],
      ["Petits-déjeuners", "Breakfasts"],
      ["Transferts aéroport – hôtel – aéroport", "Airport – hotel – airport transfers"],
      ["Assistance DIM VOYAGES 7j/7", "DIM VOYAGES assistance 7 days a week"],
    ],
    out: [
      ["Repas non mentionnés", "Meals not mentioned"],
      ["Excursions optionnelles", "Optional excursions"],
      ["Assurance voyage (proposée en option)", "Travel insurance (available as an option)"],
      ["Dépenses personnelles", "Personal expenses"],
    ],
  },
  omrah: {
    in: [
      ["Billet d'avion aller-retour Abidjan – Djeddah", "Return flight Abidjan – Jeddah"],
      ["Visa Omrah", "Umrah visa"],
      ["Hôtels proches des mosquées à La Mecque et Médine", "Hotels close to the mosques in Makkah and Madinah"],
      ["Transferts en bus climatisé", "Air-conditioned coach transfers"],
      ["Encadrement par un guide religieux", "Guidance by a religious guide"],
      ["Ziyarat (visites des lieux saints)", "Ziyarat (visits to holy sites)"],
    ],
    out: [
      ["Repas non mentionnés", "Meals not mentioned"],
      ["Excédent de bagages", "Excess baggage"],
      ["Dépenses personnelles", "Personal expenses"],
    ],
  },
  safari: {
    in: [
      ["Billet d'avion aller-retour au départ d'Abidjan", "Return flight from Abidjan"],
      ["Hébergement en lodge et hôtel", "Lodge and hotel accommodation"],
      ["Pension complète pendant le safari", "Full board during the safari"],
      ["Véhicule 4x4 avec guide-chauffeur", "4x4 vehicle with driver-guide"],
      ["Droits d'entrée dans les parcs", "Park entrance fees"],
      ["Accompagnement pour la demande de visa", "Visa application support"],
    ],
    out: [
      ["Frais de visa", "Visa fees"],
      ["Pourboires", "Tips"],
      ["Assurance voyage (proposée en option)", "Travel insurance (available as an option)"],
      ["Dépenses personnelles", "Personal expenses"],
    ],
  },
};

const d = (n: number) => [`${n} jours / ${n - 1} nuits`, `${n} days / ${n - 1} nights`] as const;
const arrive: [string, string] = ["Vol depuis Abidjan, accueil à l'arrivée et installation à l'hôtel", "Flight from Abidjan, welcome on arrival and hotel check-in"];
const back: [string, string] = ["Temps libre, transfert à l'aéroport et vol retour vers Abidjan", "Free time, airport transfer and return flight to Abidjan"];
const free: [string, string] = ["Journée libre pour se reposer ou faire du shopping", "Free day to rest or go shopping"];

function e(kind: Kind, n: number, days: [string, string][], extraIn?: [string, string][]): Entry {
  const [fr, en] = d(n);
  return { kind, fr, en, days, extraIn };
}

const data: Record<string, Entry> = {
  abidjan: e("abidjan", 3, [
    ["Arrivée, installation et balade au Plateau puis au bord de la lagune Ébrié", "Arrival, check-in and a walk around Le Plateau and along the Ébrié lagoon"],
    ["Cocody, marché de Treichville et soirée à la Zone 4", "Cocody, Treichville market and an evening in Zone 4"],
    ["Matinée au parc national du Banco, puis départ", "Morning at Banco National Park, then departure"],
  ]),
  "circuit-europe-7-jours": e("intl", 7, [
    arrive,
    ["Tour de ville : grands monuments et croisière sur le fleuve", "City tour: main landmarks and a river cruise"],
    ["Musées et quartiers historiques", "Museums and historic districts"],
    ["Excursion à la journée dans les environs (château ou village typique)", "Day trip to the surroundings (castle or typical village)"],
    free,
    ["Promenade dans un quartier animé et dîner d'au revoir", "Stroll through a lively district and farewell dinner"],
    back,
  ]),
  "weekend-lagune-assinie": e("ci", 2, [
    ["Départ d'Abidjan le matin, installation au bord de la lagune et après-midi plage", "Morning departure from Abidjan, check-in by the lagoon and an afternoon at the beach"],
    ["Balade en pirogue sur la lagune, déjeuner puis retour à Abidjan", "Pirogue ride on the lagoon, lunch, then return to Abidjan"],
  ]),
  "omrah-formule-confort": e("omrah", 8, [
    ["Vol Abidjan – Djeddah, transfert à La Mecque et accomplissement de la Omrah", "Flight Abidjan – Jeddah, transfer to Makkah and performing Umrah"],
    ["Prières au Masjid al-Haram", "Prayers at Masjid al-Haram"],
    ["Ziyarat des lieux saints de La Mecque", "Ziyarat of the holy sites of Makkah"],
    ["Journée consacrée aux prières et au recueillement", "Day dedicated to prayer and reflection"],
    ["Transfert en bus vers Médine et installation", "Coach transfer to Madinah and check-in"],
    ["Prières à la Mosquée du Prophète", "Prayers at the Prophet's Mosque"],
    ["Ziyarat de Médine : mosquée de Quba et mont Uhud", "Ziyarat of Madinah: Quba Mosque and Mount Uhud"],
    ["Transfert à l'aéroport et vol retour vers Abidjan", "Airport transfer and return flight to Abidjan"],
  ]),
  "escapade-grand-bassam": e("ci", 2, [
    ["Départ d'Abidjan, visite du quartier historique classé à l'UNESCO et après-midi plage", "Departure from Abidjan, visit of the UNESCO-listed historic quarter and an afternoon at the beach"],
    ["Marché artisanal, temps libre puis retour à Abidjan", "Craft market, free time, then return to Abidjan"],
  ]),
  "vacances-en-famille-dubai": e("intl", 6, [
    arrive,
    ["Burj Khalifa, Dubai Mall et spectacle des fontaines", "Burj Khalifa, Dubai Mall and the fountain show"],
    ["Journée en famille dans un parc à thème ou un parc aquatique", "Family day at a theme park or water park"],
    ["Safari dans le désert avec dîner sous les étoiles", "Desert safari with dinner under the stars"],
    ["Croisière en dhow, souks et temps à la plage", "Dhow cruise, souks and beach time"],
    back,
  ], [["Safari dans le désert", "Desert safari"]]),
  man: e("ci", 3, [
    ["Route Abidjan – Man et installation", "Road trip Abidjan – Man and check-in"],
    ["Cascade de Man, randonnée vers la Dent de Man et pont de lianes", "Man waterfall, hike towards the Dent de Man and liana bridge"],
    ["Visite d'un village artisan puis retour à Abidjan", "Visit of a craft village, then return to Abidjan"],
  ]),
  "safari-afrique-est": e("safari", 7, [
    ["Vol depuis Abidjan vers Nairobi et installation", "Flight from Abidjan to Nairobi and check-in"],
    ["Route vers la réserve et premier safari en fin de journée", "Drive to the reserve and first game drive in the late afternoon"],
    ["Journée complète de safari à la recherche des « Big Five »", "Full-day safari in search of the Big Five"],
    ["Safari au lever du jour et visite d'un village masaï", "Sunrise game drive and visit of a Maasai village"],
    ["Route vers un lac de la vallée du Rift", "Drive to a Rift Valley lake"],
    ["Retour à Nairobi et soirée libre", "Return to Nairobi and free evening"],
    back,
  ]),
  yamoussoukro: e("ci", 2, [
    ["Route vers Yamoussoukro, basilique Notre-Dame de la Paix et lac aux caïmans", "Drive to Yamoussoukro, Basilica of Our Lady of Peace and the crocodile lake"],
    ["Fondation Félix Houphouët-Boigny, puis retour à Abidjan", "Félix Houphouët-Boigny Foundation, then return to Abidjan"],
  ]),
  "casablanca-maroc": e("intl", 5, [
    arrive,
    ["Mosquée Hassan II et corniche d'Aïn Diab", "Hassan II Mosque and the Aïn Diab corniche"],
    ["Ancienne médina, quartier des Habous et centre-ville Art déco", "Old medina, Habous quarter and the Art Deco city centre"],
    ["Excursion à la journée à Rabat", "Day trip to Rabat"],
    back,
  ]),
  "korhogo-mont-korhogo": e("ci", 3, [
    ["Voyage vers Korhogo et installation", "Travel to Korhogo and check-in"],
    ["Montée au mont Korhogo, tisserands de Waraniéné et toiles de Fakaha", "Climb of Mount Korhogo, Waraniéné weavers and Fakaha painted cloths"],
    ["Marché de Korhogo puis retour à Abidjan", "Korhogo market, then return to Abidjan"],
  ]),
  bondoukou: e("ci", 3, [
    ["Route vers Bondoukou et installation", "Drive to Bondoukou and check-in"],
    ["Mosquées anciennes, vieux quartier et marché ; visite des singes sacrés de Soko", "Ancient mosques, old town and market; visit of the sacred monkeys of Soko"],
    ["Temps libre puis retour à Abidjan", "Free time, then return to Abidjan"],
  ]),
  "nuit-dans-le-desert": e("intl", 4, [
    ["Vol depuis Abidjan vers le Maroc ou l'Égypte et installation", "Flight from Abidjan to Morocco or Egypt and check-in"],
    ["Route vers le désert et nuit en bivouac sous les étoiles", "Drive to the desert and a night in a bivouac under the stars"],
    ["Lever de soleil sur les dunes, balade à dos de dromadaire puis retour en ville", "Sunrise over the dunes, camel ride, then return to the city"],
    back,
  ], [["Nuit en bivouac avec dîner", "Bivouac night with dinner"]]),
  "san-pedro": e("ci", 4, [
    ["Voyage vers San Pedro et installation", "Travel to San Pedro and check-in"],
    ["Plages et baies autour de San Pedro", "Beaches and bays around San Pedro"],
    ["Excursion à Monogaga", "Excursion to Monogaga"],
    ["Escapade à Grand-Béréby puis retour à Abidjan", "Trip to Grand-Béréby, then return to Abidjan"],
  ]),
  "weekend-vieille-ville-europe": e("intl", 4, [
    arrive,
    ["Visite guidée du centre historique", "Guided tour of the historic centre"],
    ["Marchés, ruelles et terrasses à votre rythme", "Markets, alleys and terraces at your own pace"],
    back,
  ]),
  jacqueville: e("ci", 2, [
    ["Route vers Jacqueville, installation et après-midi plage", "Drive to Jacqueville, check-in and an afternoon at the beach"],
    ["Balade en pirogue sur la lagune, village de pêcheurs puis retour à Abidjan", "Pirogue ride on the lagoon, fishing village, then return to Abidjan"],
  ]),
  "escapade-santorin": e("intl", 6, [
    ["Vol depuis Abidjan via Athènes et installation à Santorin", "Flight from Abidjan via Athens and check-in in Santorini"],
    ["Fira, puis coucher de soleil à Oia", "Fira, then sunset in Oia"],
    ["Croisière dans la caldeira", "Caldera cruise"],
    ["Plages de sable noir de Kamari et Perissa", "Black sand beaches of Kamari and Perissa"],
    free,
    back,
  ]),
  "sejour-doha-qatar": e("intl", 5, [
    arrive,
    ["Corniche, musée d'Art islamique et Souq Waqif", "Corniche, Museum of Islamic Art and Souq Waqif"],
    ["The Pearl et village culturel de Katara", "The Pearl and Katara Cultural Village"],
    ["Safari dans le désert et mer intérieure", "Desert safari and the Inland Sea"],
    back,
  ]),
  "venise-italie": e("intl", 5, [
    arrive,
    ["Place Saint-Marc et palais des Doges", "St Mark's Square and the Doge's Palace"],
    ["Pont du Rialto et balade en gondole", "Rialto Bridge and a gondola ride"],
    ["Îles de Murano et Burano", "Murano and Burano islands"],
    back,
  ]),
  "amsterdam-pays-bas": e("intl", 5, [
    arrive,
    ["Croisière sur les canaux et Rijksmuseum", "Canal cruise and the Rijksmuseum"],
    ["Maison d'Anne Frank et quartier du Jordaan", "Anne Frank House and the Jordaan district"],
    ["Moulins de Zaanse Schans", "Zaanse Schans windmills"],
    back,
  ]),
  "escapade-tokyo-japon": e("intl", 7, [
    arrive,
    ["Shinjuku et le carrefour de Shibuya", "Shinjuku and the Shibuya crossing"],
    ["Asakusa et le temple Senso-ji", "Asakusa and Senso-ji temple"],
    ["Excursion au mont Fuji et à Hakone", "Excursion to Mount Fuji and Hakone"],
    ["Akihabara et Ginza", "Akihabara and Ginza"],
    free,
    back,
  ]),
  "sejour-ubud-bali": e("intl", 7, [
    ["Vol depuis Abidjan vers Denpasar et transfert à Ubud", "Flight from Abidjan to Denpasar and transfer to Ubud"],
    ["Rizières de Tegallalang et forêt des singes", "Tegallalang rice terraces and the Monkey Forest"],
    ["Temple de Tirta Empul et village artisanal", "Tirta Empul temple and a craft village"],
    ["Lever de soleil au mont Batur", "Sunrise at Mount Batur"],
    ["Cours de cuisine balinaise", "Balinese cooking class"],
    ["Journée détente et spa", "Relaxation day and spa"],
    back,
  ]),
  "londres-royaume-uni": e("intl", 5, [
    arrive,
    ["Westminster, Big Ben et Buckingham Palace", "Westminster, Big Ben and Buckingham Palace"],
    ["British Museum et Covent Garden", "British Museum and Covent Garden"],
    ["Tour de Londres, Tower Bridge et croisière sur la Tamise", "Tower of London, Tower Bridge and a Thames cruise"],
    back,
  ]),
  senegal: e("ecowas", 5, [
    ["Vol Abidjan – Dakar et installation", "Flight Abidjan – Dakar and check-in"],
    ["Île de Gorée et centre-ville de Dakar", "Gorée Island and Dakar city centre"],
    ["Excursion au lac Rose", "Excursion to the Pink Lake"],
    ["Journée plage à Saly", "Beach day in Saly"],
    back,
  ]),
  "plages-phuket-thailande": e("intl", 7, [
    arrive,
    ["Plages de Patong et Kata", "Patong and Kata beaches"],
    ["Excursion en bateau aux îles Phi Phi", "Boat trip to the Phi Phi Islands"],
    ["Baie de Phang Nga", "Phang Nga Bay"],
    ["Big Buddha et vieille ville de Phuket", "Big Buddha and Phuket Old Town"],
    free,
    back,
  ]),
  "nairobi-kenya": e("intl", 5, [
    arrive,
    ["Safari au parc national de Nairobi", "Game drive in Nairobi National Park"],
    ["Centre des girafes et orphelinat d'éléphants", "Giraffe Centre and elephant orphanage"],
    ["Musée Karen Blixen et marché masaï", "Karen Blixen Museum and Maasai market"],
    back,
  ]),
  seychelles: e("intl", 7, [
    ["Vol depuis Abidjan vers Mahé et installation", "Flight from Abidjan to Mahé and check-in"],
    ["Victoria et plages de Mahé", "Victoria and Mahé beaches"],
    ["Praslin et la vallée de Mai", "Praslin and the Vallée de Mai"],
    ["La Digue et l'anse Source d'Argent", "La Digue and Anse Source d'Argent"],
    ["Snorkeling et détente à la plage", "Snorkelling and beach time"],
    free,
    back,
  ]),
  "ile-de-qeshm-iran": e("intl", 6, [
    ["Vol depuis Abidjan vers Qeshm et installation", "Flight from Abidjan to Qeshm and check-in"],
    ["Vallée des Étoiles et canyon de Chahkooh", "Valley of the Stars and Chahkooh canyon"],
    ["Forêt de mangroves de Hara en bateau", "Hara mangrove forest by boat"],
    ["Île de Hengam et observation des dauphins", "Hengam Island and dolphin watching"],
    free,
    back,
  ]),
  "riyad-arabie-saoudite": e("intl", 5, [
    arrive,
    ["Kingdom Centre et Musée national", "Kingdom Centre and the National Museum"],
    ["Site historique de Diriyah", "Historic site of Diriyah"],
    ["Excursion au « Bout du monde » (Edge of the World)", "Excursion to the Edge of the World"],
    back,
  ]),
  "mer-rouge-arabie-saoudite": e("intl", 6, [
    ["Vol depuis Abidjan vers Djeddah et installation", "Flight from Abidjan to Jeddah and check-in"],
    ["Vieille ville d'Al-Balad et corniche de Djeddah", "Al-Balad old town and the Jeddah corniche"],
    ["Transfert vers un hôtel du littoral", "Transfer to a seaside hotel"],
    ["Snorkeling sur les récifs de la mer Rouge", "Snorkelling on the Red Sea reefs"],
    free,
    back,
  ]),
  "seoul-coree-du-sud": e("intl", 7, [
    arrive,
    ["Palais Gyeongbokgung et village de Bukchon", "Gyeongbokgung Palace and Bukchon village"],
    ["Myeongdong et N Seoul Tower", "Myeongdong and N Seoul Tower"],
    ["Excursion à la zone démilitarisée (DMZ)", "Excursion to the Demilitarized Zone (DMZ)"],
    ["Gangnam et Lotte World", "Gangnam and Lotte World"],
    free,
    back,
  ]),
  singapour: e("intl", 5, [
    arrive,
    ["Marina Bay et Gardens by the Bay", "Marina Bay and Gardens by the Bay"],
    ["Chinatown et Little India", "Chinatown and Little India"],
    ["Journée sur l'île de Sentosa", "Day on Sentosa Island"],
    back,
  ]),
  "hanoi-vietnam": e("intl", 6, [
    arrive,
    ["Lac Hoan Kiem et vieux quartier", "Hoan Kiem Lake and the Old Quarter"],
    ["Temple de la Littérature et spectacle de marionnettes sur l'eau", "Temple of Literature and a water puppet show"],
    ["Croisière dans la baie d'Ha Long avec nuit à bord", "Ha Long Bay cruise with a night on board"],
    ["Retour à Hanoï et soirée libre", "Return to Hanoi and free evening"],
    back,
  ]),
  "new-york-manhattan": e("intl", 6, [
    arrive,
    ["Times Square et Central Park", "Times Square and Central Park"],
    ["Statue de la Liberté et Wall Street", "Statue of Liberty and Wall Street"],
    ["Empire State Building et 5e Avenue", "Empire State Building and Fifth Avenue"],
    ["Pont de Brooklyn et temps libre", "Brooklyn Bridge and free time"],
    back,
  ]),
  miami: e("intl", 6, [
    arrive,
    ["South Beach et quartier Art déco", "South Beach and the Art Deco district"],
    ["Little Havana et Wynwood", "Little Havana and Wynwood"],
    ["Excursion dans les Everglades", "Everglades excursion"],
    free,
    back,
  ]),
  toronto: e("intl", 6, [
    arrive,
    ["CN Tower et Harbourfront", "CN Tower and Harbourfront"],
    ["Distillery District et Kensington Market", "Distillery District and Kensington Market"],
    ["Excursion aux chutes du Niagara", "Excursion to Niagara Falls"],
    free,
    back,
  ]),
  "rio-de-janeiro": e("intl", 7, [
    arrive,
    ["Christ Rédempteur au sommet du Corcovado", "Christ the Redeemer on Corcovado"],
    ["Pain de Sucre et plage de Copacabana", "Sugarloaf Mountain and Copacabana beach"],
    ["Santa Teresa et Lapa", "Santa Teresa and Lapa"],
    ["Plage d'Ipanema", "Ipanema beach"],
    free,
    back,
  ]),
  cancun: e("intl", 6, [
    arrive,
    ["Journée plage sur la zone hôtelière", "Beach day in the hotel zone"],
    ["Excursion au site maya de Chichén Itzá", "Excursion to the Mayan site of Chichén Itzá"],
    ["Isla Mujeres en bateau", "Isla Mujeres by boat"],
    ["Cénotes et ruines de Tulum", "Cenotes and the ruins of Tulum"],
    back,
  ]),
  "los-angeles": e("intl", 6, [
    arrive,
    ["Hollywood et le Walk of Fame", "Hollywood and the Walk of Fame"],
    ["Santa Monica et Venice Beach", "Santa Monica and Venice Beach"],
    ["Visite d'un studio de cinéma", "Film studio tour"],
    ["Beverly Hills et observatoire Griffith", "Beverly Hills and Griffith Observatory"],
    back,
  ]),
};

async function main() {
  let count = 0;
  for (const [slug, entry] of Object.entries(data)) {
    const list = lists[entry.kind];
    const included = [...list.in, ...(entry.extraIn ?? [])];
    await prisma.offer.updateMany({
      where: { slug },
      data: {
        duration: entry.fr,
        durationEn: entry.en,
        program: entry.days.map(([fr], i) => `Jour ${i + 1} : ${fr}`),
        programEn: entry.days.map(([, en], i) => `Day ${i + 1}: ${en}`),
        included: included.map(([fr]) => fr),
        includedEn: included.map(([, en]) => en),
        excluded: list.out.map(([fr]) => fr),
        excludedEn: list.out.map(([, en]) => en),
      },
    });
    count++;
  }
  console.log(`updated ${count}`);
  await prisma.$disconnect();
  process.exit(0);
}
main();
