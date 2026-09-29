import { BUSINESS } from "@/content/business";
import { SERVICE_PAGES } from "@/content/services";
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

const serviceRoutes: RouteSeo[] = SERVICE_PAGES.map(route => ({
  ...route,
  canonical: `${BUSINESS.canonicalOrigin}${route.path === "/" ? "/" : `${route.path.replace(/\/+$/, "")}/`}`,
  robots: indexRobots,
  image,
}));

const staticRoutes: RouteSeo[] = Object.values(SITE_PAGES).map(page => ({
  ...page,
  canonical:
    page.path === "/"
      ? `${BUSINESS.canonicalOrigin}/`
      : `${BUSINESS.canonicalOrigin}${page.path.replace(/\/+$/, "")}/`,
  robots:
    page.path === "/404"
      ? ("noindex, follow" as const)
      : indexRobots,
  image,
}));

const allRoutes = [...staticRoutes, ...serviceRoutes];

const normalizePath = (pathname: string) => {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "");
};

const routeMap = new Map(allRoutes.map(route => [normalizePath(route.path), route]));
const notFound = routeMap.get("/404")!;

export const INDEXABLE_PATHS = [
  "/",
  "/solar-installation-ondo-city",
  "/solar-installation-ondo-state",
  "/inverter-lithium-battery-installation",
  "/cctv-installation-ondo",
  "/smart-home-automation",
  "/solar-packages",
  "/solar-planner",
  "/commercial-solar-sizing",
  "/projects",
  "/about",
  "/contact",
] as const;
export function getRouteSeo(pathname: string): RouteSeo {
  return routeMap.get(normalizePath(pathname)) ?? notFound;
}
