import { describe, expect, it } from "vitest";
import { renderSeoHead } from "./head";
import { buildLocalBusinessSchema, buildPageSchemas } from "./schema";

describe("structured local business data", () => {
  it("publishes the approved physical identity and opening hours", () => {
    const schema = buildLocalBusinessSchema();

    expect(schema["@id"]).toBe("https://gtechconsult.ng/#business");
    expect(schema.name).toBe("G-Tech Consult");
    expect(schema.telephone).toBe("+2348167498489");
    expect(schema.address).toMatchObject({
      postalCode: "100967",
      addressLocality: "Ondo City",
      addressRegion: "Ondo State",
      addressCountry: "NG",
    });
    expect(schema.openingHoursSpecification[0]).toMatchObject({
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
    });
  });

  it("uses only schema types supported by visible page content", () => {
    expect(buildPageSchemas("/").map(schema => schema["@type"])).toContain(
      "LocalBusiness"
    );
    expect(
      buildPageSchemas("/solar-installation-ondo-city").map(
        schema => schema["@type"]
      )
    ).toEqual(["LocalBusiness", "Service", "BreadcrumbList"]);
    expect(
      buildPageSchemas("/solar-packages").map(schema => schema["@type"])
    ).toEqual(["LocalBusiness", "OfferCatalog", "BreadcrumbList"]);

    const serialized = JSON.stringify([
      buildPageSchemas("/"),
      buildPageSchemas("/solar-installation-ondo-city"),
      buildPageSchemas("/solar-packages"),
    ]);
    expect(serialized).not.toContain("aggregateRating");
    expect(serialized).not.toContain('"Review"');
    expect(serialized).not.toContain("gtechconsult.net");
  });

  it("serializes one safe canonical head for each route", () => {
    const head = renderSeoHead("/contact");

    expect(head).toContain(
      '<title data-seo-managed="true">Contact G-Tech Consult in Ondo City</title>'
    );
    expect(head).toContain(
      '<link data-seo-managed="true" rel="canonical" href="https://gtechconsult.ng/contact">'
    );
    expect(head.match(/name="description"/g)).toHaveLength(1);
    expect(head).not.toContain("gtechconsult.net");
    expect(head).not.toContain("<script>alert");
  });
});
