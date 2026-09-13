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
      "Plan solar installation for your home or business with G-Tech Consult: load assessment, system sizing, installation and commissioning.",
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
      "Our office is at Adesuper Junction, Ondo City. We serve local properties and welcome enquiries from Lagos and other parts of Nigeria. Assessment availability, travel costs and installation dates are confirmed for your location before booking.",
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
      "Request a custom solar installation quotation for your property. Share your location in Ondo, Lagos or elsewhere in Nigeria to confirm availability.",
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
      "For projects in Ondo State, Lagos or elsewhere in Nigeria, send your town, property type and power requirements. We confirm whether we can serve your location, including travel arrangements and after-installation support, before you book.",
    faqs: [
      {
        question: "Do you install solar systems outside Ondo City?",
        answer:
          "Yes, we schedule work in serviceable locations across Ondo State. For Lagos and other states, share the exact location and project scope so we can confirm availability, travel logistics and support before booking.",
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
      "Choose inverter and lithium battery backup matched to your appliances, with compatibility checks, installation, commissioning and user guidance.",
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
      "Our team is based in Ondo City. For inverter and battery installation in Ondo State, Lagos or another location, request confirmation of assessment availability, travel costs and support arrangements.",
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
      "Plan CCTV installation for your home or business with camera placement, recording storage, remote-viewing checks and practical system handover.",
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
      "We assess homes, shops and offices from our Ondo City base. Share your location in Ondo State, Lagos or elsewhere in Nigeria so we can confirm CCTV survey availability and installation logistics.",
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
      "Explore smart-home automation for lighting, access, appliances and security, with compatibility assessment, installation and manual fallback planning.",
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
      "Smart-home enquiries are welcome from Ondo State, Lagos and other parts of Nigeria. Our Ondo City team confirms service availability, required site visits and support arrangements for each project.",
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
