import { BUSINESS } from "@/content/business";
import { SOLAR_PACKAGES } from "@/content/packages";
import { getServiceByPath, SERVICE_PAGES } from "@/content/services";
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
          url: `${BUSINESS.canonicalOrigin}${service.path}`,
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
    "@id": `${BUSINESS.canonicalOrigin}${service.path}#service`,
    name: service.h1,
    description: service.description,
    url: `${BUSINESS.canonicalOrigin}${service.path}`,
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

export function buildPageSchemas(path: string): JsonLd[] {
  const route = getRouteSeo(path);
  if (route.path === "/404") return [];

  const schemas: JsonLd[] = [buildLocalBusinessSchema()];
  const service = buildServiceSchema(route.path);
  if (service) schemas.push(service);
  if (route.path === "/solar-packages") schemas.push(buildOfferCatalogSchema());
  if (route.path !== "/" && INDEXABLE_PATHS.includes(route.path as any)) {
    schemas.push(buildBreadcrumbSchema(route.path));
  }
  return schemas;
}
