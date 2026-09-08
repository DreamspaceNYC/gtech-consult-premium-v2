import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BUSINESS } from "@/content/business";
import App from "@/App";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { INDEXABLE_PATHS, getRouteSeo } from "./routes";

describe("canonical business routing", () => {
  it("generates the approved contact URL and identity", () => {
    expect(BUSINESS.name).toBe("G-Tech Consult");
    expect(BUSINESS.canonicalOrigin).toBe("https://gtechconsult.ng");
    expect(BUSINESS.postalCode).toBe("100967");
    expect(BUSINESS.openingHours).toEqual([
      { days: "Monday–Saturday", opens: "09:00", closes: "18:00" },
    ]);
    expect(getRouteSeo("/contact").canonical).toBe(
      "https://gtechconsult.ng/contact"
    );
  });

  it("keeps every public route unique and indexable", () => {
    expect(INDEXABLE_PATHS).toEqual([
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
    ]);
    expect(new Set(INDEXABLE_PATHS).size).toBe(INDEXABLE_PATHS.length);
    expect(
      INDEXABLE_PATHS.every(path =>
        getRouteSeo(path).robots.startsWith("index")
      )
    ).toBe(true);
  });

  it("normalizes trailing slashes and prevents unknown pages from indexing", () => {
    expect(getRouteSeo("/contact/")).toEqual(getRouteSeo("/contact"));
    expect(getRouteSeo("/missing").robots).toBe("noindex, follow");
    expect(getRouteSeo("/missing").path).toBe("/404");
  });

  it("renders crawlable navigation and canonical contact details", () => {
    const markup = renderToStaticMarkup(
      createElement(
        "div",
        null,
        createElement(SiteHeader),
        createElement(SiteFooter)
      )
    );

    expect(markup).toContain('href="/solar-installation-ondo-city"');
    expect(markup).toContain('href="/projects"');
    expect(markup).toContain('href="/contact"');
    expect(markup).toContain(BUSINESS.fullAddress);
    expect(markup).toContain('href="tel:+2348167498489"');
    expect(markup).toContain(BUSINESS.whatsapp);
  });

  it.each([
    "/solar-installation-ondo-city",
    "/solar-installation-ondo-state",
    "/inverter-lithium-battery-installation",
    "/cctv-installation-ondo",
    "/smart-home-automation",
  ])("server-renders useful service content at %s", path => {
    const html = renderToStaticMarkup(createElement(App, { ssrPath: path }));
    const route = getRouteSeo(path);

    expect(html).toContain("<h1");
    expect(html).toContain(`>${route.h1}</h1>`);
    expect(html).toContain("Our installation process");
    expect(html).toContain("Frequently asked questions");
    expect(html).toContain('href="tel:+2348167498489"');
    expect(html).toContain(BUSINESS.whatsapp);
  });

  it("server-renders a real fallback page for an unknown route", () => {
    const html = renderToStaticMarkup(
      createElement(App, { ssrPath: "/does-not-exist" })
    );
    expect(html).toContain("Page Not Found");
  });

  it("renders all seven packages as crawlable commercial content", () => {
    const html = renderToStaticMarkup(
      createElement(App, { ssrPath: "/solar-packages" })
    );
    expect(html).toContain("Premium Comfort Solar Package");
    expect(html).toContain("I Pass My Neighbour Power Tank");
    expect(html.match(/data-package=/g)).toHaveLength(7);
    expect(html).toContain("₦14,321,800");
  });

  it("renders truthful proof, company and contact pages", () => {
    const projects = renderToStaticMarkup(
      createElement(App, { ssrPath: "/projects" })
    );
    const about = renderToStaticMarkup(
      createElement(App, { ssrPath: "/about" })
    );
    const contact = renderToStaticMarkup(
      createElement(App, { ssrPath: "/contact" })
    );

    expect(projects).toContain("Our Installation Work");
    expect(projects).toContain("work completed by G-Tech Consult");
    expect(about).toContain("About G-Tech Consult");
    expect(about).toContain("Ondo City");
    expect(about).toContain('href="/smart-home-automation"');
    expect(contact).toContain(BUSINESS.fullAddress);
    expect(contact).toContain("Monday–Saturday, 9:00 AM–6:00 PM");
    expect(contact).toContain(BUSINESS.mapsUrl);
  });

  it("positions the homepage for Ondo solar searches and links every service", () => {
    const html = renderToStaticMarkup(createElement(App, { ssrPath: "/" }));

    expect(html).toContain("Solar Installation Company in Ondo City");
    expect(html.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    for (const path of INDEXABLE_PATHS.filter(path => path !== "/")) {
      expect(html).toContain(`href="${path}"`);
    }
    expect(html).toContain(BUSINESS.fullAddress);
    expect(html).toContain("Monday–Saturday, 9:00 AM–6:00 PM");
  });
});
