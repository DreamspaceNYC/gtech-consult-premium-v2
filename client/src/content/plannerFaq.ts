/**
 * The five solar-sizing questions the planner answers.
 * Shared by the visible FAQ section and the FAQPage JSON-LD schema.
 * Keep answers plain, factual and quotable.
 */
export const PLANNER_FAQS: { question: string; answer: string }[] = [
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
