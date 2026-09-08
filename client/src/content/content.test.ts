import { describe, expect, it } from "vitest";
import { SOLAR_PACKAGES } from "./packages";
import { SERVICE_PAGES, getServiceByPath } from "./services";
import { getRouteSeo } from "@/seo/routes";

describe("public service and package content", () => {
  it("provides distinct, useful content for every approved service route", () => {
    expect(SERVICE_PAGES.map(service => service.path)).toEqual([
      "/solar-installation-ondo-city",
      "/solar-installation-ondo-state",
      "/inverter-lithium-battery-installation",
      "/cctv-installation-ondo",
      "/smart-home-automation",
    ]);

    for (const service of SERVICE_PAGES) {
      expect(service.benefits.length).toBeGreaterThanOrEqual(3);
      expect(service.process.length).toBeGreaterThanOrEqual(3);
      expect(service.faqs.length).toBeGreaterThanOrEqual(3);
      expect(service.faqs.every(faq => faq.question && faq.answer)).toBe(true);
      expect(service.cta).toBeTruthy();
      expect(getRouteSeo(service.path)).toMatchObject({
        title: service.title,
        description: service.description,
        h1: service.h1,
      });
      expect(getServiceByPath(service.path + "/")).toEqual(service);
    }

    expect(new Set(SERVICE_PAGES.map(service => service.title)).size).toBe(5);
    expect(new Set(SERVICE_PAGES.map(service => service.h1)).size).toBe(5);
    expect(new Set(SERVICE_PAGES.map(service => service.description)).size).toBe(5);
  });

  it("preserves the seven commercial package records", () => {
    expect(SOLAR_PACKAGES).toHaveLength(7);
    expect(new Set(SOLAR_PACKAGES.map(item => item.slug)).size).toBe(7);
    expect(SOLAR_PACKAGES.every(item => Number.isInteger(item.price) && item.price > 0)).toBe(true);
    expect(SOLAR_PACKAGES.every(item => item.items.length > 0 && item.inclusions.length > 0)).toBe(true);
  });

  it("never publishes the retired domain", () => {
    expect(JSON.stringify({ SERVICE_PAGES, SOLAR_PACKAGES })).not.toContain(
      "gtechconsult.net",
    );
  });
});
