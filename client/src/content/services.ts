export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceStep = {
  title: string;
  description: string;
};

export type ServicePageContent = {
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  introduction: string;
  benefits: readonly string[];
  process: readonly ServiceStep[];
  areaStatement: string;
  faqs: readonly ServiceFaq[];
  cta: string;
};

export const SERVICE_PAGES: readonly ServicePageContent[] = [
  {
    path: "/solar-installation-ondo-city",
    title: "Solar Installation for Homes & Businesses | G-Tech Consult",
    description:
      "Get a properly assessed solar power system for your Ondo City home or business, installed and commissioned by the G-Tech Consult team.",
    h1: "Solar Installation for Homes and Businesses",
    eyebrow: "Solar power solutions",
    introduction:
      "A dependable solar system starts with the appliances you need to power, when you use them and the backup time you expect. We assess those needs before recommending the inverter, battery, panels, protection and cabling.",
    benefits: [
      "System sizing based on your real appliances and usage pattern",
      "Protected cabling, isolation and changeover planning",
      "Commissioning, user guidance and local after-installation support",
    ],
    process: [
      {
        title: "Assess",
        description:
          "We inspect the property, list intended loads and discuss your daytime and overnight priorities.",
      },
      {
        title: "Design and quote",
        description:
          "We size the core equipment and present a clear recommendation with the included installation materials.",
      },
      {
        title: "Install and commission",
        description:
          "Our team installs, protects and tests the system, then explains safe everyday operation.",
      },
    ],
    areaStatement:
      "This service is delivered from our customer-facing location at Adesuper Junction and covers homes and businesses across Ondo City.",
    faqs: [
      {
        question: "How do you know what size of solar system I need?",
        answer:
          "We calculate from the wattage, quantity and expected running time of your appliances. A site assessment also helps us check wiring, installation space and panel placement.",
      },
      {
        question: "Can you give a final price before seeing the property?",
        answer:
          "Our published packages provide a useful starting point, but the final scope depends on the load, cable distances, mounting conditions and any required electrical corrections.",
      },
      {
        question: "How long will the battery last?",
        answer:
          "Runtime depends on usable battery capacity, connected load, appliance duty cycles, battery settings and charging conditions. We provide an estimate after measuring the intended loads.",
      },
    ],
    cta: "Request a solar site assessment",
  },
  {
    path: "/solar-installation-ondo-state",
    title: "Custom Solar Installation Services | G-Tech Consult",
    description:
      "Plan a solar installation for your home or business across Ondo State with site assessment, suitable system sizing and professional commissioning.",
    h1: "Custom Solar Installation Services",
    eyebrow: "Tailored solar solutions",
    introduction:
      "Customers outside Ondo City can arrange a scheduled solar assessment. We confirm the location, travel requirements, electrical condition and installation scope before finalizing equipment and logistics.",
    benefits: [
      "Residential and commercial systems sized around actual demand",
      "Planned logistics for equipment, mounting and installation materials",
      "Clear confirmation of service availability before a final quotation",
    ],
    process: [
      {
        title: "Confirm the location",
        description:
          "Share the town, property type, contact details and the appliances the system should support.",
      },
      {
        title: "Schedule assessment",
        description:
          "We confirm service availability, travel arrangements and a suitable assessment date.",
      },
      {
        title: "Deliver the agreed scope",
        description:
          "Following approval, we coordinate equipment, installation, testing and customer handover.",
      },
    ],
    areaStatement:
      "Scheduled work is available in serviceable locations across Ondo State. Availability, logistics and timing are confirmed before a site visit.",
    faqs: [
      {
        question: "Do you install solar systems outside Ondo City?",
        answer:
          "Yes, we schedule work in serviceable locations across Ondo State after confirming the exact town, project scope and travel logistics.",
      },
      {
        question: "Is transportation included in every advertised package?",
        answer:
          "Package inclusions apply to the stated installation assumptions. Travel and unusual logistics outside the normal operating area are confirmed in the final quotation.",
      },
      {
        question: "Can a business request a larger custom system?",
        answer:
          "Yes. Commercial requirements are assessed from operating hours, critical loads, starting currents, available space and the required level of backup.",
      },
    ],
    cta: "Check solar installation availability at your location",
  },
  {
    path: "/inverter-lithium-battery-installation",
    title: "Inverter & Lithium Battery Installation | G-Tech Consult",
    description:
      "Install a correctly sized inverter and lithium battery backup system in Ondo with protected cabling, commissioning and practical user guidance.",
    h1: "Inverter and Lithium Battery Installation",
    eyebrow: "Backup power systems",
    introduction:
      "An inverter and lithium battery should be matched to the connected load, charging source and desired backup period. We assess compatibility and installation conditions before recommending a system.",
    benefits: [
      "Inverter and battery capacity matched to intended loads",
      "Suitable protection, cable sizing, ventilation and changeover planning",
      "Commissioning settings and practical guidance for battery care",
    ],
    process: [
      {
        title: "Measure the load",
        description:
          "We identify essential and optional appliances, their power demand and expected hours of use.",
      },
      {
        title: "Check compatibility",
        description:
          "We match voltage, battery capacity, inverter charging limits, protection and available installation space.",
      },
      {
        title: "Install and test",
        description:
          "The system is connected, configured and tested under an agreed load before handover.",
      },
    ],
    areaStatement:
      "Inverter and lithium battery assessment and installation are available in Ondo City and scheduled serviceable locations in Ondo State.",
    faqs: [
      {
        question: "Can I add a lithium battery to my present inverter?",
        answer:
          "Sometimes. We first check the inverter voltage, charging profile, communication requirements, condition and manufacturer compatibility.",
      },
      {
        question: "Will a bigger battery run every appliance?",
        answer:
          "Battery capacity affects runtime, while the inverter determines the power that can be supplied at once. Both must be sized for the connected appliances.",
      },
      {
        question: "Can the system charge from both solar and public power?",
        answer:
          "That depends on the selected inverter and system design. We confirm the available charging inputs and configure them around the customer's priorities.",
      },
    ],
    cta: "Request an inverter and lithium battery assessment",
  },
  {
    path: "/cctv-installation-ondo",
    title: "CCTV Installation | G-Tech Consult",
    description:
      "Protect your Ondo home or business with surveyed CCTV camera placement, recording setup, protected cabling and practical system handover.",
    h1: "CCTV Installation for Homes and Businesses",
    eyebrow: "Security camera installation",
    introduction:
      "Useful CCTV coverage depends on camera position, lighting, image detail, recording time and the areas that matter most. We survey the property before agreeing the camera and recorder layout.",
    benefits: [
      "Camera positions planned around entrances and priority areas",
      "Recording and storage selected for the required retention period",
      "Protected cabling, tested viewing and customer handover",
    ],
    process: [
      {
        title: "Survey",
        description:
          "We inspect viewing angles, lighting, cable routes, recorder location and internet availability.",
      },
      {
        title: "Specify",
        description:
          "We recommend cameras, storage and supporting equipment for the agreed coverage objectives.",
      },
      {
        title: "Install and hand over",
        description:
          "We mount, connect and test the system, then explain recording, playback and available remote viewing.",
      },
    ],
    areaStatement:
      "CCTV surveys and installations are available for homes, shops, offices and other suitable properties in Ondo and scheduled nearby locations.",
    faqs: [
      {
        question: "Can I view my CCTV cameras on my phone?",
        answer:
          "Remote viewing is available with compatible equipment, a suitable app and reliable internet at the recorder and on the viewing phone.",
      },
      {
        question: "How many days of recording will I get?",
        answer:
          "Retention depends on storage size, camera count, resolution, frame rate and recording mode. We size storage after confirming those choices.",
      },
      {
        question: "Will the cameras see clearly at night?",
        answer:
          "Night performance depends on the camera, distance, scene lighting, reflective surfaces and placement. The survey helps us choose and position cameras for the area.",
      },
    ],
    cta: "Book a CCTV survey",
  },
  {
    path: "/smart-home-automation",
    title: "Smart Home Automation | G-Tech Consult",
    description:
      "Control selected lighting, access, appliances and security features with a smart-home solution assessed and installed by G-Tech Consult in Ondo.",
    h1: "Smart Home Automation",
    eyebrow: "Practical connected living",
    introduction:
      "Smart-home automation should make daily routines simpler without removing practical manual control. We scope the devices, connectivity, electrical work and security considerations before installation.",
    benefits: [
      "Selected lighting, access, appliance and security integration",
      "Controls planned around the household or business routine",
      "Manual fallback and user handover included in the design",
    ],
    process: [
      {
        title: "Choose the routines",
        description:
          "We identify what should be monitored or controlled and who needs access.",
      },
      {
        title: "Check the environment",
        description:
          "We assess wiring, network coverage, device compatibility and sensible manual fallback.",
      },
      {
        title: "Configure and explain",
        description:
          "We install agreed devices, test routines and show authorized users how to operate them.",
      },
    ],
    areaStatement:
      "Smart-home assessments begin from our Ondo City location, with scheduled installations across serviceable parts of Ondo State.",
    faqs: [
      {
        question: "Can I automate an existing home?",
        answer:
          "Often, yes. The available options depend on existing wiring, device compatibility, network coverage and the features you want to control.",
      },
      {
        question: "Will normal switches still work?",
        answer:
          "Where the selected solution supports it, we plan manual control so essential functions are not dependent on one app or routine.",
      },
      {
        question: "Does every smart-home feature require internet?",
        answer:
          "Some functions can operate locally while remote access normally needs internet. We explain the dependency of each agreed feature before installation.",
      },
    ],
    cta: "Discuss a smart-home assessment",
  },
];

export function getServiceByPath(
  pathname: string
): ServicePageContent | undefined {
  const normalized =
    pathname === "/" ? "/" : pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return SERVICE_PAGES.find(service => service.path === normalized);
}
