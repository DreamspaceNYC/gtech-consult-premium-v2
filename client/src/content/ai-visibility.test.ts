import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import App from "@/App";
import { ASSESSMENT_URL } from "./business";
import { SOLAR_PACKAGES } from "./packages";
import { SERVICE_PAGES } from "./services";
import { buildPageSchemas } from "@/seo/schema";

describe("buyer clarity and AI-readable content", () => {
  it("renders all package comparison anchors and inclusions without JavaScript", () => {
    const html = renderToStaticMarkup(
      createElement(App, { ssrPath: "/solar-packages" })
    );
    expect(html).toMatch(/<table\b[^>]*class="comparison-table"/);
    expect(html).toContain('scope="col"');
    for (const item of SOLAR_PACKAGES) {
      expect(html).toContain(`href="#${item.slug}"`);
      expect(html).toContain(`id="${item.slug}"`);
    }
    expect(html.match(/Equipment and installation inclusions/g)).toHaveLength(
      7
    );
    expect(html).toContain("What warranty and support will I receive?");
    expect(html).not.toMatch(
      /until approximately 5:00 AM|until around 6:00 AM/
    );
  });
  it("qualifies location availability instead of claiming unverified branches", () => {
    for (const service of SERVICE_PAGES) {
      expect(service.areaStatement).toContain("Lagos");
      expect(service.areaStatement).toMatch(/confirm/i);
      expect(service.description).not.toMatch(
        /your Ondo|system in Ondo|team in Ondo/
      );
    }
  });
  it("prefills assessment requirements without collecting personal data onsite", () => {
    const url = new URL(ASSESSMENT_URL);
    expect(url.origin + url.pathname).toBe("https://wa.me/2348167498489");
    const message = url.searchParams.get("text");
    expect(message).toContain("Town and state:");
    expect(message).toContain("Appliances or requirements:");
    expect(message).toContain("Required backup hours");
  });
  it("links each structured offer to its visible package section", () => {
    const catalog = buildPageSchemas("/solar-packages").find(
      s => s["@type"] === "OfferCatalog"
    )!;
    expect(
      catalog.itemListElement.map((offer: { url: string }) => offer.url)
    ).toEqual(
      SOLAR_PACKAGES.map(
        item => `https://gtechconsult.ng/solar-packages#${item.slug}`
      )
    );
  });
});
