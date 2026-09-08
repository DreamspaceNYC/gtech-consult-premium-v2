export type OpeningHours = {
  days: "Monday–Saturday";
  opens: "09:00";
  closes: "18:00";
};

export type BusinessDetails = {
  name: "G-Tech Consult";
  canonicalOrigin: "https://gtechconsult.ng";
  phone: "+2348167498489";
  displayPhone: "0816 749 8489";
  secondaryPhone: "+2349157000010";
  displaySecondaryPhone: "0915 700 0010";
  whatsapp: "https://wa.me/2348167498489";
  mapsUrl: "https://maps.app.goo.gl/FK4QEWGyVbmGxz3K6";
  streetAddress: "KM 140 Ondo–Ore Road, Adesuper Junction";
  locality: "Ondo City";
  region: "Ondo State";
  postalCode: "100967";
  country: "Nigeria";
  fullAddress: string;
  openingHours: readonly OpeningHours[];
  instagram: "https://www.instagram.com/gtechconsult/";
  facebook: "https://www.facebook.com/gtechconsults/";
};

export const BUSINESS: BusinessDetails = Object.freeze({
  name: "G-Tech Consult",
  canonicalOrigin: "https://gtechconsult.ng",
  phone: "+2348167498489",
  displayPhone: "0816 749 8489",
  secondaryPhone: "+2349157000010",
  displaySecondaryPhone: "0915 700 0010",
  whatsapp: "https://wa.me/2348167498489",
  mapsUrl: "https://maps.app.goo.gl/FK4QEWGyVbmGxz3K6",
  streetAddress: "KM 140 Ondo–Ore Road, Adesuper Junction",
  locality: "Ondo City",
  region: "Ondo State",
  postalCode: "100967",
  country: "Nigeria",
  fullAddress:
    "KM 140 Ondo–Ore Road, Adesuper Junction, Ondo City, Ondo State 100967, Nigeria",
  openingHours: [
    { days: "Monday–Saturday", opens: "09:00", closes: "18:00" },
  ] as const,
  instagram: "https://www.instagram.com/gtechconsult/",
  facebook: "https://www.facebook.com/gtechconsults/",
});

export const formatPublicHours = () =>
  BUSINESS.openingHours
    .map(({ days, opens, closes }) => {
      const format = (value: string) => {
        const [hour, minute] = value.split(":");
        const numericHour = Number(hour);
        const suffix = numericHour >= 12 ? "PM" : "AM";
        const twelveHour = numericHour % 12 || 12;
        return minute === "00"
          ? `${twelveHour}:00 ${suffix}`
          : `${twelveHour}:${minute} ${suffix}`;
      };
      return `${days}, ${format(opens)}–${format(closes)}`;
    })
    .join("; ");
