import { buildPageSchemas } from "./schema";
import { getRouteSeo } from "./routes";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const tag = (name: string, attributes: Record<string, string>) => {
  const serialized = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");
  return `<${name} data-seo-managed="true" ${serialized}>`;
};

export function renderSeoHead(path: string): string {
  const route = getRouteSeo(path);
  const schemaTags = buildPageSchemas(route.path).map(schema => {
    const json = JSON.stringify(schema).replaceAll("<", "\\u003c");
    return `<script data-seo-managed="true" type="application/ld+json">${json}</script>`;
  });

  return [
    `<title>${escapeHtml(route.title)}</title>`,
    tag("meta", { name: "description", content: route.description }),
    tag("meta", { name: "robots", content: route.robots }),
    tag("link", { rel: "canonical", href: route.canonical }),
    tag("meta", { property: "og:locale", content: "en_NG" }),
    tag("meta", { property: "og:site_name", content: "G-Tech Consult" }),
    tag("meta", { property: "og:title", content: route.title }),
    tag("meta", { property: "og:description", content: route.description }),
    tag("meta", { property: "og:type", content: "website" }),
    tag("meta", { property: "og:url", content: route.canonical }),
    tag("meta", { property: "og:image", content: route.image }),
    tag("meta", { property: "og:image:alt", content: "G-Tech Consult" }),
    tag("meta", { name: "twitter:card", content: "summary_large_image" }),
    tag("meta", { name: "twitter:title", content: route.title }),
    tag("meta", { name: "twitter:description", content: route.description }),
    tag("meta", { name: "twitter:image", content: route.image }),
    ...schemaTags,
  ].join("\n    ");
}
