import { BUSINESS } from "@/content/business";
import { SITE_PAGES } from "@/content/sitePages";

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  robots:
    | "index, follow, max-image-preview:large"
    | "noindex, follow";
  image: string;
};

const image = `${BUSINESS.canonicalOrigin}/images/gtech-logo-reference-cropped_daba8f24.png`;
const indexRobots = "index, follow, max-image-preview:large" as const;

const serviceRoutes: RouteSeo[] = [
  {
    path: "/solar-installation-ondo-city",
    title: "Solar Installation in Ondo City | G-Tech Consult",
    description:
      "Get a properly assessed solar power system for your Ondo City home or business, installed and commissioned by the G-Tech Consult team.",
    h1: "Solar Installation in Ondo City for Homes and Businesses",
  },
  {
    path: "/solar-installation-ondo-state",
    title: "Solar Installation Across Ondo State | G-Tech Consult",
    description:
      "Plan a solar installation for your home or business across Ondo State with site assessment, suitable system sizing and professional commissioning.",
    h1: "Solar Installation Services Across Ondo State",
  },
  {
    path: "/inverter-lithium-battery-installation",
    title: "Inverter & Lithium Battery Installation in Ondo | G-Tech Consult",
    description:
      "Install a correctly sized inverter and lithium battery backup system in Ondo with protected cabling, commissioning and practical user guidance.",
    h1: "Inverter and Lithium Battery Installation in Ondo",
  },
  {
    path: "/cctv-installation-ondo",
    title: "CCTV Installation in Ondo | G-Tech Consult",
    description:
      "Protect your Ondo home or business with surveyed CCTV camera placement, recording setup, protected cabling and practical system handover.",
    h1: "CCTV Installation for Homes and Businesses in Ondo",
  },
  {
    path: "/smart-home-automation",
    title: "Smart Home Automation in Ondo | G-Tech Consult",
    description:
      "Control selected lighting, access, appliances and security features with a smart-home solution assessed and installed by G-Tech Consult in Ondo.",
    h1: "Smart Home Automation in Ondo",
  },
].map(route => ({
  ...route,
  canonical: `${BUSINESS.canonicalOrigin}${route.path}`,
  robots: indexRobots,
  image,
}));

const staticRoutes: RouteSeo[] = Object.values(SITE_PAGES).map(page => ({
  ...page,
  canonical:
    page.path === "/"
      ? `${BUSINESS.canonicalOrigin}/`
      : `${BUSINESS.canonicalOrigin}${page.path}`,
  robots:
    page.path === "/404"
      ? ("noindex, follow" as const)
      : indexRobots,
  image,
}));

const allRoutes = [...staticRoutes, ...serviceRoutes];
const routeMap = new Map(allRoutes.map(route => [route.path, route]));
const notFound = routeMap.get("/404")!;

export const INDEXABLE_PATHS = [
  "/",
  "/solar-installation-ondo-city",
  "/solar-installation-ondo-state",
  "/inverter-lithium-battery-installation",
  "/cctv-installation-ondo",
  "/smart-home-automation",
  "/solar-packages",
  "/projects",
  "/about",
  "/contact",
] as const;

const normalizePath = (pathname: string) => {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "");
};

export function getRouteSeo(pathname: string): RouteSeo {
  return routeMap.get(normalizePath(pathname)) ?? notFound;
}
