/**
 * The twenty solar-sizing questions the planner answers.
 * Shared by the visible FAQ section and the FAQPage JSON-LD schema.
 * Keep answers plain, factual and quotable. Questions are phrased the way
 * Nigerians actually search, so the page earns visibility for each query.
 */
export const PLANNER_FAQS: { question: string; answer: string }[] = [
  {
    question: "How does a solar inverter size calculator work in Nigeria?",
    answer:
      "You list your appliances and how long each runs per day. The calculator converts that into daily energy (kWh), sizes your inverter from your peak simultaneous load plus 25% headroom, and sizes your battery from your night-time usage plus a cloudy-day margin. The planner above does all three and matches you to a real G-Tech package with naira prices.",
  },
  {
    question: "How is commercial solar inverter sizing done in Lagos?",
    answer:
      "Commercial sizing starts with a load audit: every machine, AC, pump and light in the business, with its watts and running hours. The installer checks whether the premises run on single-phase or 3-phase supply, then sizes the inverter for peak simultaneous load and the battery for the hours the business runs without sun. G-Tech Consult does commercial assessments for Lagos businesses — send your equipment list on WhatsApp to start.",
  },
  {
    question: "What solar inverter capacity does a business in Ondo need?",
    answer:
      "It depends entirely on the business. A small shop with lights, a fan and a freezer may run on 3.5kVA, while a hotel or factory with multiple ACs and motors needs 10kVA and above on 3-phase. There is no standard business size — only your load list decides it. Our Ondo City office offers free assessments across Ondo State.",
  },
  {
    question: "How do I calculate what size solar inverter I need?",
    answer:
      "Three steps. First, list everything that can run at the same time and add up the watts — that is your peak load. Second, add 25% headroom for safety and motor starting surges. Third, convert to kVA (divide watts by about 800, since Nigeria rates inverters in kVA). The planner above runs this calculation from your appliance list automatically.",
  },
  {
    question: "kW or kVA — which rating should I use for my inverter size?",
    answer:
      "Nigeria commonly rates inverters in kVA. As a rule of thumb, kW equals kVA multiplied by the power factor (about 0.8 for typical home loads), so a 5kVA inverter delivers roughly 4kW of usable power. When comparing quotes in Lagos or Ondo, always check whether the figure quoted is kVA or kW.",
  },
  {
    question: "Can I get a commercial solar and inverter capacity estimate online?",
    answer:
      "A rough one, yes. The planner above gives solid estimates for homes and small shops. For larger commercial loads — 3-phase supply, heavy motors, daytime factory shifts — an accurate estimate needs a proper load audit, because starting surges and load balancing change the design. Send your equipment list or electricity bill to G-Tech Consult on WhatsApp for a commercial estimate.",
  },
  {
    question: "How do I calculate my business's total electrical load?",
    answer:
      "Write down every electrical item, its watt rating (on the nameplate), and how many hours it runs daily. Your peak load is the highest total watts running at any single moment — that number, plus 25% headroom, sets your inverter size. Watch out for motors: fridges, pumps and ACs draw three to five times their rated watts for a few seconds when starting.",
  },
  {
    question: "Is there a solar inverter sizing guide for Ondo State?",
    answer:
      "This page is one. The method is the same everywhere in Nigeria: list your loads, find your peak, add headroom for the inverter, and size the battery from night-time use. What changes locally is sun hours and support — G-Tech Consult is based in Ondo City, so assessments, installation and after-sales support across Ondo State come from nearby, not from Lagos.",
  },
  {
    question: "Do I need a 3-phase solar inverter for my business?",
    answer:
      "If your premises run on a 3-phase supply — common in commercial buildings, hotels, factories and large estates — then yes, you need a 3-phase inverter (or three single-phase inverters) with loads balanced across the phases. Single-phase inverters suit homes and small shops. A site assessment confirms your supply type before anything is quoted.",
  },
  {
    question: "Can I size my solar system from my electricity bill?",
    answer:
      "Partly. Divide your monthly kWh by 30 to get your average daily usage — that sizes your panels and gives a rough battery figure. But a bill never shows your peak load (the maximum watts at one instant), which is what sizes the inverter. Combine the bill method with an appliance list for a complete answer; the planner above uses your appliances directly.",
  },
  {
    question: "Does this solar sizing work for other West African countries?",
    answer:
      "Yes. The maths — watts, watt-hours, kVA headroom, battery autonomy — is the same across West Africa, and most of the region shares Nigeria's 230V/50Hz supply. Sun hours vary by location, which mainly changes the panel count. G-Tech Consult primarily serves Nigeria; enquire on WhatsApp about projects elsewhere in West Africa.",
  },
  {
    question: "What is a hybrid inverter, and does my business need one?",
    answer:
      "A hybrid inverter combines solar, battery and grid or generator backup in one unit, switching between them automatically. Most Lagos and Ondo businesses choose hybrid because it keeps the office running through grid outages without anyone touching a switch, and it can prioritise free solar power during the day.",
  },
  {
    question: "How is off-grid commercial sizing different?",
    answer:
      "An off-grid system must cover 100% of the business's load, including extra battery capacity for cloudy days — there is no grid to fall back on. A hybrid system with grid or generator backup can be sized leaner. Off-grid therefore costs more upfront for the same load. A load audit and your outage pattern decide which makes sense.",
  },
  {
    question: "What size inverter does a Lagos office or warehouse need?",
    answer:
      "A small office with lighting, computers, printers and one or two ACs often lands around 3.5 to 5kVA, while a warehouse with heavy lighting and machinery on daytime shifts may need 10kVA or more on 3-phase. Warehouses mostly run in daytime, which keeps battery costs down. Only a real load list confirms your figure — estimates from floor area alone are guesswork.",
  },
  {
    question: "What is DC/AC ratio in commercial solar design?",
    answer:
      "It is the total solar panel wattage (DC) divided by the inverter's capacity (AC). Commercial designs often use a ratio around 1.2 — slightly more panel power than the inverter rating — because panels rarely produce their full rated output in real heat and dust. Your installer sets this during design; it is not something you need to calculate yourself.",
  },
  {
    question: "Will solar carry my air conditioner?",
    answer:
      "Yes, if the system is sized for it. A 1.5HP air conditioner draws about 1,200W, so running it from 9pm to 6am uses roughly 11kWh overnight — that is why G-Tech Consult's Two-AC package pairs a 10kVA inverter with 32kWh of battery storage. Use the planner above to size it from your own on and off times.",
  },
  {
    question: "What size inverter and battery do I need?",
    answer:
      "Add up the watts of everything that runs at the same time, then add 25% headroom — that is your inverter size in kVA. Size the battery from what you use at night (6pm to 6am), plus about 30% extra for cloudy days. The planner above does both calculations from your appliance list and usage times.",
  },
  {
    question: "How much does solar installation cost in Nigeria?",
    answer:
      "G-Tech Consult's published packages run from ₦661,000 for the Power Tank to ₦14,321,800 for Premium Comfort, with popular home options like Moderate AC (One AC) at ₦6,672,800. Your final quotation depends on your appliances and property — the planner matches you to the closest package, and a free site assessment confirms the exact figure.",
  },
  {
    question: "Is solar cheaper than running a generator?",
    answer:
      "At ₦1,300 per litre of petrol, spending ₦150,000 a month on fuel is ₦1.8 million a year — before servicing and repairs. Enter your own fuel spending in step 2 of the planner to see your payback time and five-year savings against a real G-Tech package.",
  },
  {
    question: "Can solar power my sewing machine, freezer or pumping machine?",
    answer:
      "Yes. A servo-motor sewing machine draws about 100W while a clutch-motor one draws about 400W; a 1HP pumping machine draws about 750W plus starting demand. Type any appliance into the planner's 'Add your own appliance' box, pick its type, and it is sized like everything else — no guesswork.",
  },
];
