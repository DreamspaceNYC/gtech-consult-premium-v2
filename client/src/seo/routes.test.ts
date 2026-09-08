import { describe, expect, it } from "vitest";
import { BUSINESS } from "@/content/business";
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
      "https://gtechconsult.ng/contact",
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
    expect(INDEXABLE_PATHS.every(path => getRouteSeo(path).robots.startsWith("index"))).toBe(true);
  });

  it("normalizes trailing slashes and prevents unknown pages from indexing", () => {
    expect(getRouteSeo("/contact/")).toEqual(getRouteSeo("/contact"));
    expect(getRouteSeo("/missing").robots).toBe("noindex, follow");
    expect(getRouteSeo("/missing").path).toBe("/404");
  });
});
