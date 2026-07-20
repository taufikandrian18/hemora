export type PropertySlug = "lereng" | "sriti";
export type MenuSlug = "stay" | "dining" | "wellness" | "journal";

export type Stat = {
  value: string;
  label: string;
};

export type Offer = {
  name: string;
  meta: string;
  image: string;
  alt: string;
  description: string;
  rate: string;
};

export type PropertySection = {
  slug: MenuSlug;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  secondary?: string;
  image: string;
  alt: string;
  caption: string;
  meta: string;
  details: {
    title: string;
    body: string;
    image?: string;
    alt?: string;
  }[];
};

export type PropertyData = {
  slug: PropertySlug;
  title: string;
  shortTitle: string;
  location: string;
  tone: string;
  heroImage: string;
  heroAlt: string;
  heroKicker: string;
  heroTitle: string;
  heroEmphasis: string;
  intro: string;
  primaryAction: string;
  stats: Stat[];
  marquee: string[];
  philosophyLabel: string;
  philosophyTitle: string;
  philosophyLead: string;
  philosophyBody: string;
  offersTitle: string;
  offersIntro: string;
  offers: Offer[];
  sections: Record<MenuSlug, PropertySection>;
  quote: string;
  quoteSource: string;
  bookingTitle: string;
  bookingLead: string;
  bookingImage: string;
  bookingAlt: string;
  address: string;
  email: string;
  phone: string;
};

export const menuSections: { slug: MenuSlug; label: string }[] = [
  { slug: "stay", label: "Stay" },
  { slug: "dining", label: "Dining" },
  { slug: "wellness", label: "Wellness" },
  { slug: "journal", label: "Journal" },
];

export const properties: Record<PropertySlug, PropertyData> = {
  lereng: {
    slug: "lereng",
    title: "Lereng Senja, Ciwidey",
    shortTitle: "Lereng Senja",
    location: "Ciwidey, West Java",
    tone: "Highland Retreat",
    heroImage: "/assets/hemora/lereng/hero.png",
    heroAlt: "Lereng Senja resort surrounded by tea slopes and morning mist",
    heroKicker: "Ciwidey, West Java · 1,450m above sea level",
    heroTitle: "Highland rooms",
    heroEmphasis: "held by the mist.",
    intro:
      "Lereng Senja is shaped around cool air, tea-slope mornings, warm timber rooms, and slow dining that follows the weather rather than the clock.",
    primaryAction: "Reserve the Highland Stay",
    stats: [
      { value: "48", label: "Suites & Villas" },
      { value: "1,450m", label: "Highland Air" },
      { value: "4.9", label: "Guest Rating" },
      { value: "1", label: "Tea Valley" },
    ],
    marquee: ["Tea-slope mornings", "Warm timber rooms", "Family facilities", "Fog over Ciwidey", "Breakfast by the garden"],
    philosophyLabel: "§ 01 — Philosophy",
    philosophyTitle: "A retreat composed around cool air and unhurried mornings.",
    philosophyLead:
      "The highlands set the pace here. Mornings begin softly, afternoons gather around warm lounges, and evenings return guests to rooms that feel sheltered from the valley weather.",
    philosophyBody:
      "The page keeps the reference draft's generous rhythm: a full cinematic hero, editorial intro, horizontal offers, alternating image blocks, guest note, direct booking cue, and a footer built for practical contact.",
    offersTitle: "Reasons to arrive sooner rather than later.",
    offersIntro: "Each offer is built around the weather: mist, warm meals, family time, and a slower Ciwidey morning.",
    offers: [
      {
        name: "The Mist Weekend",
        meta: "03 nights · Fri-Sun",
        image: "/assets/hemora/lereng/room.png",
        alt: "Warm timber room at Lereng Senja",
        description: "A room, breakfast, and a late checkout for guests who want the highlands without rushing back.",
        rate: "From IDR 1.850K",
      },
      {
        name: "Family Above the Slopes",
        meta: "02 nights · Family",
        image: "/assets/hemora/lereng/family.png",
        alt: "Family play area at Lereng Senja",
        description: "Flexible rooms, playground access, and a breakfast table held for slower family mornings.",
        rate: "From IDR 2.950K",
      },
      {
        name: "Work From the Valley",
        meta: "04 nights · Weekday",
        image: "/assets/hemora/lereng/table.png",
        alt: "Private meeting table at Lereng Senja",
        description: "A quieter weekday stay with work tables, warm drinks, and tea-slope walks between calls.",
        rate: "From IDR 2.450K",
      },
    ],
    sections: {
      stay: {
        slug: "stay",
        label: "Stay",
        eyebrow: "§ 02 — Stay",
        title: "Rooms that keep the mountain air close.",
        body:
          "The rooms use timber, soft textiles, and wide openings to make the highland temperature feel considered rather than cold.",
        secondary: "Choose a room close to the garden, the covered corridors, or the quieter lounge edge.",
        image: "/assets/hemora/lereng/room.png",
        alt: "Lereng Senja guest room with warm timber finishes",
        caption: "Suite Senja · tea-view room",
        meta: "Rooms from 36-78 m2",
        details: [
          {
            title: "Terrace Suite",
            body: "A calm room for slow mornings with layered bedding, a private terrace, and a warm drink station.",
            image: "/assets/hemora/lereng/room.png",
            alt: "Terrace Suite at Lereng Senja",
          },
          {
            title: "Corridor Room",
            body: "A protected room along the covered walkways, close to dining and sheltered from sudden mountain rain.",
            image: "/assets/hemora/lereng/corridor.png",
            alt: "Covered corridor at Lereng Senja",
          },
          {
            title: "Family Suite",
            body: "A larger room plan with lounge access and easy movement to the family play area.",
            image: "/assets/hemora/lereng/family.png",
            alt: "Family facilities at Lereng Senja",
          },
        ],
      },
      dining: {
        slug: "dining",
        label: "Dining",
        eyebrow: "§ 03 — Dining",
        title: "A breakfast room that follows the weather.",
        body:
          "Dining starts with the light over the tea slopes: warm bread, local fruit, highland vegetables, and tables arranged for unhurried starts.",
        secondary: "The menu stays simple because Ciwidey mornings already do most of the work.",
        image: "/assets/hemora/lereng/dining.png",
        alt: "Breakfast buffet at Lereng Senja",
        caption: "Breakfast room · morning service",
        meta: "Daily breakfast and group tables",
        details: [
          {
            title: "Morning spread",
            body: "Fresh bread, fruit, warm staples, and coffee served near the garden light.",
            image: "/assets/hemora/lereng/dining.png",
            alt: "Breakfast spread at Lereng Senja",
          },
          {
            title: "Garden tables",
            body: "A calmer dining setup for families and longer conversations after breakfast.",
            image: "/assets/hemora/lereng/garden-dining.png",
            alt: "Garden dining at Lereng Senja",
          },
          {
            title: "Private table",
            body: "A more enclosed room for small groups, planning sessions, or weather-led dinners.",
            image: "/assets/hemora/lereng/table.png",
            alt: "Private dining table at Lereng Senja",
          },
        ],
      },
      wellness: {
        slug: "wellness",
        label: "Wellness",
        eyebrow: "§ 04 — Wellness",
        title: "A long pause after the rain moves through.",
        body:
          "Wellness at Lereng is practical: warm lounges, open-air corners, slow walks, and spaces that let families reset without scheduling too much.",
        secondary: "No complicated program. Just cooler air, soft seating, and a property planned around slower movement.",
        image: "/assets/hemora/lereng/lounge.png",
        alt: "Open-air lounge at Lereng Senja",
        caption: "Lounge edge · after-rain hour",
        meta: "Warm drinks, garden walks, family corners",
        details: [
          {
            title: "After-rain lounge",
            body: "A sheltered place for hot drinks while the fog moves across the valley.",
            image: "/assets/hemora/lereng/lounge.png",
            alt: "Lounge seating at Lereng Senja",
          },
          {
            title: "Family reset",
            body: "A bright play area close enough to shared spaces that parents can keep the day easy.",
            image: "/assets/hemora/lereng/family.png",
            alt: "Family play area at Lereng Senja",
          },
          {
            title: "Pantry comfort",
            body: "Simple in-room support for guests who prefer a warm drink and a quiet night in.",
            image: "/assets/hemora/lereng/pantry.png",
            alt: "In-room pantry at Lereng Senja",
          },
        ],
      },
      journal: {
        slug: "journal",
        label: "Journal",
        eyebrow: "§ 05 — Journal",
        title: "Notes from the slope, the corridor, and the table.",
        body:
          "The Lereng journal is a practical guide to the highland stay: what to pack, when to walk, where to sit, and how the weather changes the day.",
        secondary: "Use it before arrival, then ignore it once the mist starts doing the planning for you.",
        image: "/assets/hemora/lereng/arrival.png",
        alt: "Arrival bridge at Lereng Senja",
        caption: "Arrival bridge · late afternoon",
        meta: "Weather notes, family tips, dining rhythm",
        details: [
          {
            title: "The first hour",
            body: "Arrive before sunset, cross the timber bridge, and let the property introduce itself slowly.",
            image: "/assets/hemora/lereng/arrival.png",
            alt: "Lereng Senja arrival bridge",
          },
          {
            title: "Where to sit",
            body: "Use the covered corridor and lounge edges when the mountain rain changes the plan.",
            image: "/assets/hemora/lereng/corridor.png",
            alt: "Covered corridor at Lereng Senja",
          },
          {
            title: "Breakfast timing",
            body: "The best table is usually early, when the room is quiet and the fog is still visible.",
            image: "/assets/hemora/lereng/garden-dining.png",
            alt: "Dining area at Lereng Senja",
          },
        ],
      },
    },
    quote:
      "Lereng Senja works because it lets the mountain lead. Nothing feels rushed, and the rooms keep the highland quiet close.",
    quoteSource: "Guest note · Ciwidey stay",
    bookingTitle: "Your highland room is waiting.",
    bookingLead:
      "Write to the host team with your dates and preferred room. We will answer with availability and the simplest booking path.",
    bookingImage: "/assets/hemora/lereng/hero.png",
    bookingAlt: "Misted highland terraces around Lereng Senja",
    address: "Ciwidey, Bandung Regency, West Java",
    email: "hello@hemora.co",
    phone: "+62 812 3456 7890",
  },
  sriti: {
    slug: "sriti",
    title: "Sriti Palu",
    shortTitle: "Sriti Palu",
    location: "Palu, Central Sulawesi",
    tone: "City Hospitality",
    heroImage: "/assets/hemora/sriti/hero.png",
    heroAlt: "Sriti Palu sculptural staircase and atrium lounge",
    heroKicker: "Palu, Central Sulawesi · City hospitality",
    heroTitle: "A warmer city",
    heroEmphasis: "with an atrium heart.",
    intro:
      "Sriti Palu turns a city stay into a calmer ritual: arched corridors, warm rooms, generous dining, and a clear sense of arrival.",
    primaryAction: "Reserve the City Stay",
    stats: [
      { value: "18", label: "Signature Rooms" },
      { value: "1", label: "Atrium Heart" },
      { value: "4.8", label: "Guest Rating" },
      { value: "24h", label: "Host Desk" },
    ],
    marquee: ["Atrium arrivals", "Warm city rooms", "Soft dining light", "Arched corridors", "Palu at a slower pace"],
    philosophyLabel: "§ 01 — Philosophy",
    philosophyTitle: "A city hotel with a slower pulse and a clear sense of arrival.",
    philosophyLead:
      "Sriti Palu is built around the feeling of stepping in from the city and immediately slowing down. The atrium gives the page its center; the rooms give guests their quiet.",
    philosophyBody:
      "The reference layout becomes a hospitality page here, but the palette stays HEMORA: deep forest, ivory, wood, umber, and restrained gold instead of a new cream-and-terracotta scheme.",
    offersTitle: "Ways to make a Palu stay feel easier.",
    offersIntro: "Direct arrival, warmer rooms, and dining that works for meetings, family visits, and late returns.",
    offers: [
      {
        name: "Atrium Arrival",
        meta: "01 night · City",
        image: "/assets/hemora/sriti/hero.png",
        alt: "Sriti Palu atrium staircase",
        description: "A room, early coffee, and a calm arrival sequence for short city stays.",
        rate: "From IDR 950K",
      },
      {
        name: "Meeting Morning",
        meta: "02 nights · Business",
        image: "/assets/hemora/sriti/dining.png",
        alt: "Sriti Palu breakfast and dining room",
        description: "Breakfast table support, direct check-out, and a quieter room after meetings.",
        rate: "From IDR 1.350K",
      },
      {
        name: "Family Visit",
        meta: "03 nights · Family",
        image: "/assets/hemora/sriti/suite.png",
        alt: "Sriti Palu suite lounge",
        description: "A softer suite setup for guests using Palu as a family base.",
        rate: "From IDR 1.650K",
      },
    ],
    sections: {
      stay: {
        slug: "stay",
        label: "Stay",
        eyebrow: "§ 02 — Stay",
        title: "Rooms that soften the return from the city.",
        body:
          "The rooms are compact, polished, and warm, with enough room to work, rest, and return without feeling rushed.",
        secondary: "Choose atrium access for convenience or corridor rooms for a quieter edge.",
        image: "/assets/hemora/sriti/room.png",
        alt: "Sriti Palu guest room",
        caption: "Signature room · city view",
        meta: "Rooms from 34-48 m2",
        details: [
          {
            title: "Atrium Room",
            body: "A compact city room with soft light, polished details, and easy access to dining.",
            image: "/assets/hemora/sriti/room.png",
            alt: "Atrium room at Sriti Palu",
          },
          {
            title: "Corridor Suite",
            body: "A calmer room set along the arched corridor for business stays and longer family visits.",
            image: "/assets/hemora/sriti/corridor.png",
            alt: "Corridor at Sriti Palu",
          },
          {
            title: "Lounge Suite",
            body: "More room to settle in, receive family, or decompress between city errands.",
            image: "/assets/hemora/sriti/suite.png",
            alt: "Suite lounge at Sriti Palu",
          },
        ],
      },
      dining: {
        slug: "dining",
        label: "Dining",
        eyebrow: "§ 03 — Dining",
        title: "A dining room for breakfast, meetings, and late returns.",
        body:
          "Sriti's dining spaces are bright in the morning and warmer at night, built for guests moving between work, family, and the city.",
        secondary: "The strongest table is the one that lets the day continue without friction.",
        image: "/assets/hemora/sriti/dining.png",
        alt: "Sriti Palu breakfast buffet",
        caption: "Dining room · morning service",
        meta: "Breakfast, meeting tables, late meals",
        details: [
          {
            title: "Breakfast service",
            body: "A generous morning spread for guests leaving early or hosting a simple meeting.",
            image: "/assets/hemora/sriti/dining.png",
            alt: "Breakfast buffet at Sriti Palu",
          },
          {
            title: "Restaurant room",
            body: "Warm light, curved ceilings, and enough formality for a calm working lunch.",
            image: "/assets/hemora/sriti/restaurant.png",
            alt: "Restaurant at Sriti Palu",
          },
          {
            title: "Coffee counter",
            body: "A quick stop for arrivals, early departures, and guests moving through Palu on schedule.",
            image: "/assets/hemora/sriti/chandelier.png",
            alt: "Chandelier detail at Sriti Palu",
          },
        ],
      },
      wellness: {
        slug: "wellness",
        label: "Wellness",
        eyebrow: "§ 04 — Wellness",
        title: "City reset, kept simple.",
        body:
          "Wellness at Sriti is about reducing the city pace: a quieter corridor, a better room reset, and the small rituals that make a business trip easier.",
        secondary: "No oversized spa promise. The useful thing is a stay that helps you sleep before tomorrow.",
        image: "/assets/hemora/sriti/corridor-shadow.png",
        alt: "Sunlit arched corridor at Sriti Palu",
        caption: "Arched corridor · quiet hour",
        meta: "Room reset, quiet floors, warm lighting",
        details: [
          {
            title: "Quiet hour",
            body: "Soft corridor lighting and slower transitions back to the room after a full day.",
            image: "/assets/hemora/sriti/corridor-shadow.png",
            alt: "Sriti Palu corridor shadows",
          },
          {
            title: "Room reset",
            body: "A practical evening refresh for guests returning late from city appointments.",
            image: "/assets/hemora/sriti/room.png",
            alt: "Sriti Palu guest room",
          },
          {
            title: "Atrium pause",
            body: "A brief arrival ritual in the central space before the next appointment.",
            image: "/assets/hemora/sriti/hero.png",
            alt: "Sriti Palu atrium stair",
          },
        ],
      },
      journal: {
        slug: "journal",
        label: "Journal",
        eyebrow: "§ 05 — Journal",
        title: "Notes for a calmer Palu stay.",
        body:
          "The Sriti journal is built for practical movement: arrival timing, meeting mornings, quiet corridor rooms, and where to sit when the city day runs long.",
        secondary: "Read it before arrival so the hotel can do less explaining when you get here.",
        image: "/assets/hemora/sriti/corridor.png",
        alt: "Long corridor at Sriti Palu",
        caption: "Corridor route · afternoon light",
        meta: "Arrival notes, meeting tips, quiet rooms",
        details: [
          {
            title: "The arrival path",
            body: "Start in the atrium, orient quickly, then let the route to your room feel obvious.",
            image: "/assets/hemora/sriti/hero.png",
            alt: "Sriti Palu atrium",
          },
          {
            title: "Meeting mornings",
            body: "Use breakfast tables for informal meetings before the city schedule begins.",
            image: "/assets/hemora/sriti/dining.png",
            alt: "Sriti Palu dining",
          },
          {
            title: "The quiet side",
            body: "Ask for corridor rooms when privacy matters more than the shortest walk to the atrium.",
            image: "/assets/hemora/sriti/corridor.png",
            alt: "Sriti Palu corridor",
          },
        ],
      },
    },
    quote:
      "Sriti Palu feels composed. It is close to the city, but the atrium and rooms make the pace easier to hold.",
    quoteSource: "Guest note · Palu stay",
    bookingTitle: "Your city room is waiting.",
    bookingLead:
      "Send the host team your dates, guest count, and arrival time. We will confirm the most practical room and dining plan.",
    bookingImage: "/assets/hemora/sriti/hero.png",
    bookingAlt: "Sriti Palu atrium staircase",
    address: "Palu, Central Sulawesi",
    email: "hello@hemora.co",
    phone: "+62 812 3456 7890",
  },
};

export const propertySlugs = Object.keys(properties) as PropertySlug[];

export function getProperty(slug: string) {
  return properties[slug as PropertySlug];
}

export function getPropertySection(property: PropertyData, section: string) {
  return property.sections[section as MenuSlug];
}
