import { BUSINESS } from "@/content/business";
import { SOLAR_PACKAGES } from "@/content/packages";
import { PLANNER_FAQS } from "@/content/plannerFaq";
import { COMMERCIAL_FAQS } from "@/content/commercialFaq";
import { getServiceByPath, SERVICE_PAGES } from "@/content/services";

const publicPath = (path: string) =>
  path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
import { getRouteSeo, INDEXABLE_PATHS } from "./routes";

export type JsonLd = Record<string, any>;

const logo = `${BUSINESS.canonicalOrigin}/images/gtech-logo-reference-cropped_daba8f24.png`;

export function buildLocalBusinessSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BUSINESS.canonicalOrigin}/#business`,
    name: BUSINESS.name,
    url: `${BUSINESS.canonicalOrigin}/`,
    logo,
    image: logo,
    description:
      "Solar power, inverter and lithium battery, CCTV security and smart-home installation company in Ondo State, Nigeria.",
    telephone: BUSINESS.phone,
    priceRange: "₦₦",
    hasMap: BUSINESS.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: "NG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Ondo City" },
      { "@type": "AdministrativeArea", name: "Ondo State" },
    ],
    sameAs: [BUSINESS.instagram, BUSINESS.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "G-Tech Consult services",
      itemListElement: SERVICE_PAGES.map(service => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.h1,
          url: `${BUSINESS.canonicalOrigin}${publicPath(service.path)}`,
        },
      })),
    },
  };
}

function buildServiceSchema(path: string): JsonLd | undefined {
  const service = getServiceByPath(path);
  if (!service) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BUSINESS.canonicalOrigin}${publicPath(service.path)}#service`,
    name: service.h1,
    description: service.description,
    url: `${BUSINESS.canonicalOrigin}${publicPath(service.path)}`,
    provider: { "@id": `${BUSINESS.canonicalOrigin}/#business` },
    areaServed: [
      { "@type": "City", name: "Ondo City" },
      { "@type": "AdministrativeArea", name: "Ondo State" },
    ],
  };
}

function buildOfferCatalogSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${BUSINESS.canonicalOrigin}/solar-packages#catalog`,
    name: "G-Tech Consult solar packages",
    url: `${BUSINESS.canonicalOrigin}/solar-packages`,
    itemListElement: SOLAR_PACKAGES.map(item => ({
      "@type": "Offer",
      priceCurrency: "NGN",
      price: item.price,
      url: `${BUSINESS.canonicalOrigin}/solar-packages#${item.slug}`,
      itemOffered: {
        "@type": "Product",
        name: item.title,
        description: item.description,
        image: `${BUSINESS.canonicalOrigin}${item.image}`,
      },
    })),
  };
}

function buildBreadcrumbSchema(path: string): JsonLd {
  const route = getRouteSeo(path);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BUSINESS.canonicalOrigin}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.h1,
        item: route.canonical,
      },
    ],
  };
}

const SOLAR_PACKAGES_FAQS: readonly { question: string; answer: string }[] = [
  {
    question: "How much does solar installation cost in Nigeria?",
    answer:
      "The cost depends on the inverter, usable battery capacity, panel array, mounting, cabling and installation work. Compare the published packages as starting points, then request a written quote for your appliances and location. An equipment price alone does not describe the complete installed system.",
  },
  {
    question: "What size solar system can power an air conditioner?",
    answer:
      "Start with the air conditioner's electrical input rating, starting demand and operating hours. Add other appliances that will run at the same time. Inverter power, battery energy and daily solar charging must all suit the load; the number of air conditioners alone is not enough to size a system.",
  },
  {
    question: "Can a solar system run a freezer and pumping machine?",
    answer:
      "A suitable system can support these appliances, but compressor and pump starting demand matters. Share each appliance's rating, operating hours and whether they run together. Our inverter and battery assessment checks simultaneous demand as well as backup energy.",
  },
  {
    question: "What affects battery backup time?",
    answer:
      "Backup time depends on usable battery energy and average connected load. Battery settings, inverter losses, appliance cycling, age and charging conditions also affect the result. Ask for a runtime estimate based on a documented load list instead of a fixed promise of power until a particular time of day.",
  },
  {
    question: "What should my installation quotation include?",
    answer:
      "Request equipment brands and model numbers, quantities, inverter rating, total battery capacity, panel wattage, protection, mounting and cable allowances. Confirm transport, labour, commissioning, any electrical corrections, payment terms and quotation validity. Additional work should be itemised before approval.",
  },
  {
    question: "What warranty and support will I receive?",
    answer:
      "Ask for written equipment warranty terms and installation-workmanship coverage, including who handles a claim, exclusions, transport costs and the support contact. Coverage depends on the selected equipment and agreed installation terms; confirm it in your quotation before payment.",
  },
  {
    question: "Can I request an installation outside your office location?",
    answer:
      "Yes, send your town and state. Our office is in Ondo City, and enquiries are welcome from Lagos and other parts of Nigeria. We confirm assessment availability, travel costs, installation scheduling and ongoing support for each location before booking.",
  },
];

function buildFaqSchema(path: string): JsonLd | undefined {
  const toFaqPage = (
    faqs: readonly { question: string; answer: string }[],
  ): JsonLd => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });

  if (path === "/solar-packages") return toFaqPage(SOLAR_PACKAGES_FAQS);
  if (path === "/solar-planner") return toFaqPage(PLANNER_FAQS);
  if (path === "/commercial-solar-sizing") return toFaqPage(COMMERCIAL_FAQS);
  const service = getServiceByPath(path);
  if (service?.faqs?.length) return toFaqPage(service.faqs);
  return undefined;
}

function buildSoftwareApplicationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BUSINESS.canonicalOrigin}/solar-planner#app`,
    name: "G-Tech Solar Planner",
    url: `${BUSINESS.canonicalOrigin}/solar-planner/`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description:
      "Free solar calculator: size your inverter and battery from your appliances and usage times, match a G-Tech Consult package with real prices, and estimate generator payback.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    provider: { "@id": `${BUSINESS.canonicalOrigin}/#business` },
  };
}

export function buildPageSchemas(path: string): JsonLd[] {
  const route = getRouteSeo(path);
  if (route.path === "/404") return [];

  const schemas: JsonLd[] = [buildLocalBusinessSchema()];
  const service = buildServiceSchema(route.path);
  if (service) schemas.push(service);
  if (route.path === "/solar-packages") schemas.push(buildOfferCatalogSchema());
  if (route.path === "/solar-planner")
    schemas.push(buildSoftwareApplicationSchema());
  const faq = buildFaqSchema(route.path);
  if (faq) schemas.push(faq);
  if (route.path !== "/" && INDEXABLE_PATHS.includes(route.path as any)) {
    schemas.push(buildBreadcrumbSchema(route.path));
  }
  return schemas;
}
