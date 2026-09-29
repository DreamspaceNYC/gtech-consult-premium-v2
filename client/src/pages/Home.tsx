import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BatteryCharging,
  Cctv,
  Check,
  ChevronLeft,
  ChevronRight,
  HousePlus,
  MessageCircle,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  Wrench,
  X,
} from "lucide-react";
import {
  SOLAR_PACKAGES as packages,
  type SolarPackage as Package,
} from "@/content/packages";
import { ASSESSMENT_URL } from "@/content/business";
import { SERVICE_PAGES } from "@/content/services";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SeoHead } from "@/seo/SeoHead";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { InstallationsGallery } from "@/components/InstallationsGallery";
import { SolarPlanner } from "@/components/SolarPlanner";
// Interactive 3D product hero, built by a sibling builder (SSR-safe, lazy).
import { Hero3DSection } from "@/components/Hero3DSection";
// Shop components, built by a sibling builder.
import { PackageCard } from "@/components/packages/PackageCard";
import { PackageFilters } from "@/components/packages/PackageFilters";
// Copied, keyless component sources (Magic UI + React Bits).
import { Marquee } from "@/components/magicui/marquee";
import { ShimmerButton } from "@/components/magicui";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { BlurText } from "@/components/reactbits/blur-text";
import { AnimatedList } from "@/components/reactbits/animated-list";
import "../styles/home-redesign.css";

const WHATSAPP = "https://wa.me/2348167498489";
const categories = ["All", "Solar Installation", "CCTV", "Smart Homes"];
const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

const CATEGORY_ICONS = [Sun, Cctv, HousePlus];

function serviceIcon(path: string) {
  if (path.includes("cctv")) return Cctv;
  if (path.includes("smart-home")) return HousePlus;
  if (path.includes("inverter")) return BatteryCharging;
  if (path.includes("solar")) return Sun;
  return Wrench;
}

function DetailPage({
  item,
  onBack,
  onAdd,
}: {
  item: Package;
  onBack: () => void;
  onAdd: (item: Package) => void;
}) {
  return (
    <div className="gtr-detail">
      <div className="container">
        <button className="gtr-back-link" onClick={onBack}>
          <ArrowLeft size={16} /> Back to packages
        </button>
        <div className="gtr-detail-hero">
          <div className="gtr-detail-image">
            <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
          </div>
          <div className="gtr-detail-intro">
            <p className="gtr-kicker">G-Tech Consult · Solar Installation</p>
            <h1>{item.title}</h1>
            <p className="gtr-detail-desc">{item.description}</p>
            <div className="gtr-detail-price">{formatNaira(item.price)}</div>
            <p className="gtr-detail-price-note">
              Complete package price including listed installation items.
            </p>
            <div className="gtr-detail-actions">
              <button className="gtr-btn gtr-btn--green" onClick={() => onAdd(item)}>
                Add to cart <ShoppingCart size={16} />
              </button>
              <a
                className="gtr-btn gtr-btn--outline"
                href={`${WHATSAPP}?text=${encodeURIComponent(`Hello G-Tech Consult, I am interested in the ${item.title} at ${formatNaira(item.price)}. Please help me arrange a technical assessment.`)}`}
              >
                <MessageCircle size={16} /> Request on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="gtr-detail-grid">
          <div>
            <section className="gtr-detail-section">
              <p className="gtr-kicker">Designed for</p>
              <h2>What it can power</h2>
              <ul className="gtr-power-list">
                {item.powers.map(power => (
                  <li key={power}>
                    <span className="gtr-check" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>{power}</span>
                  </li>
                ))}
              </ul>
              {item.notes?.map(note => (
                <div className="gtr-detail-note" key={note}>
                  <strong>Important usage note</strong>
                  <p>{note}</p>
                </div>
              ))}
            </section>
            <section className="gtr-detail-section">
              <p className="gtr-kicker">Included system</p>
              <h2>Equipment specification</h2>
              <div className="gtr-spec-table">
                {item.items.map(entry => (
                  <div className="gtr-spec-row" key={entry.name}>
                    <strong>{entry.name}</strong>
                    <span>{entry.spec}</span>
                    <b>{entry.qty}</b>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <aside className="gtr-inclusions">
            <p className="gtr-kicker">Package inclusions</p>
            <h2>Ready for installation</h2>
            <ul>
              {item.inclusions.map(entry => (
                <li key={entry}>
                  <span className="gtr-check" aria-hidden="true">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {entry}
                </li>
              ))}
            </ul>
            <div className="gtr-assessment-box">
              <strong>Need help choosing?</strong>
              <span>
                Final sizing is confirmed through a technical site assessment.
              </span>
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(`Hello G-Tech Consult, I need help choosing a package. My town/state: __. Appliances: __. Required backup hours: __.`)}`}
              >
                Chat with G-Tech <MessageCircle size={15} />
              </a>
            </div>
          </aside>
        </div>
        <div className="gtr-disclaimer">
          System performance depends on actual appliance ratings, usage
          patterns, weather, battery condition and installation environment.
          G-Tech Consult will confirm the final recommendation during
          assessment.
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<Package | null>(null);
  const [cart, setCart] = useState<Package[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? packages
        : packages.filter(item => item.category === activeCategory),
    [activeCategory]
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: packages.length };
    for (const category of categories.slice(1)) {
      result[category] = packages.filter(
        item => item.category === category,
      ).length;
    }
    return result;
  }, []);

  const addToCart = (item: Package) => {
    setCart(current => [...current, item]);
    setToast(`${item.shortTitle} added to cart`);
    window.setTimeout(() => setToast(""), 2400);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const scrollToShop = (category: string) => {
    setActiveCategory(category);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="gtr-home">
      <SeoHead path="/" />

      {/* (1) promo bar — marquee */}
      <div className="gtr-promo" role="note" aria-label="Current promotion">
        <Marquee repeat={4}>
          <span className="gtr-promo__item">
            Book a free technical site assessment for solar &amp; security
            installations
            <span className="gtr-promo__dot" aria-hidden="true" />
          </span>
        </Marquee>
      </div>

      {/* (2) site header */}
      <SiteHeader />

      <div className="container gtr-cart-access">
        <button
          className="gtr-btn gtr-btn--outline"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart (${cart.length} items)`}
        >
          <ShoppingCart size={17} /> Cart ({cart.length})
        </button>
      </div>

      {selected ? (
        <main id="main-content">
          <DetailPage
            item={selected}
            onBack={() => setSelected(null)}
            onAdd={addToCart}
          />
        </main>
      ) : (
        <main id="main-content">
          {/* (3) hero */}
          <section id="top" className="gtr-hero">
            <GridPattern
              className="gtr-grid-pattern"
              maxOpacity={0.12}
              numSquares={40}
            />
            <div className="container gtr-hero-inner">
              <div className="gtr-hero-copy">
                <p className="gtr-kicker">G-Tech Consult</p>
                <BlurText
                  as="h1"
                  text="Reliable Power. Smarter Security. Better Living."
                  animateBy="words"
                  delay={90}
                  direction="top"
                />
                <p className="gtr-hero-lead">
                  Solar, inverter, battery, CCTV and smart-home solutions for
                  homes and businesses. Based in Ondo, with enquiries welcome
                  from Lagos and elsewhere in Nigeria. Service availability is
                  confirmed for your location.
                </p>
                <div className="gtr-hero-actions">
                  <ShimmerButton
                    background="linear-gradient(135deg, #20a653, #118541)"
                    shimmerColor="#eafff2"
                    shimmerDuration="3.5s"
                    onClick={() =>
                      document
                        .getElementById("shop")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Shop solutions <ChevronRight size={17} />
                  </ShimmerButton>
                  <a
                    href={ASSESSMENT_URL}
                    className="gtr-hero-cta gtr-hero-cta--ghost"
                  >
                    Get a free assessment <MessageCircle size={16} />
                  </a>
                </div>
                <div className="gtr-featured">
                  <img
                    src="/images/gtech-premium-comfort-packshot_3201fbb7.webp"
                    alt="G-Tech Premium Comfort solar package"
                  />
                  <div className="gtr-featured__body">
                    <span className="gtr-featured__label">
                      Featured solution
                    </span>
                    <strong>Premium Comfort Package</strong>
                    <b>{formatNaira(14321800)}</b>
                  </div>
                  <button
                    className="gtr-featured__link"
                    onClick={() => setSelected(packages[0])}
                  >
                    View product <ChevronRight size={15} />
                  </button>
                </div>
              </div>
              <div className="gtr-hero-visual">
                <Hero3DSection />
              </div>
            </div>
            <HeroSlideshow />
          </section>

          {/* (4) category strip */}
          <section className="gtr-categories" aria-label="Shop by category">
            <div className="container">
              <AnimatedList
                className="gtr-categories-inner"
                stagger={0.08}
                duration={0.45}
              >
                <div className="gtr-categories__intro">
                  <p>Shop by category</p>
                  <strong>Find your solution</strong>
                </div>
                {categories.slice(1).map((category, index) => {
                  const Icon = CATEGORY_ICONS[index] ?? Sun;
                  return (
                    <button
                      key={category}
                      className="gtr-category-card"
                      onClick={() => scrollToShop(category)}
                    >
                      <span className="gtr-category-icon">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      {category}
                      <ChevronRight size={15} aria-hidden="true" />
                    </button>
                  );
                })}
              </AnimatedList>
            </div>
          </section>

          {/* (5) services grid */}
          <section className="gtr-section gtr-services" aria-label="Technical services">
            <div className="container">
              <div className="gtr-heading">
                <p className="gtr-kicker">Technical services</p>
                <h2>Power, security and automation built around your needs</h2>
              </div>
              <BentoGrid>
                {SERVICE_PAGES.map((service, i) => (
                  <BentoCard
                    key={service.path}
                    name={service.h1}
                    description={service.description}
                    href={`${service.path}/`}
                    cta="Explore service"
                    Icon={serviceIcon(service.path)}
                    background={
                      <div
                        aria-hidden="true"
                        style={{
                          width: "100%",
                          height: "100%",
                          background:
                            i % 2 === 0
                              ? "radial-gradient(320px 180px at 80% 0%, rgba(32,166,83,0.22), transparent 70%), linear-gradient(180deg, #f4faf5, #ffffff)"
                              : "radial-gradient(320px 180px at 20% 0%, rgba(242,169,0,0.20), transparent 70%), linear-gradient(180deg, #fbf8ef, #ffffff)",
                        }}
                      />
                    }
                  />
                ))}
              </BentoGrid>
            </div>
          </section>

          {/* (6) shop */}
          <section id="shop" className="gtr-shop gtr-section" aria-label="Shop packages">
            <div className="container">
              <div className="gtr-shop-head">
                <div>
                  <p className="gtr-kicker">G-Tech marketplace</p>
                  <h2>
                    Shop our featured <span>solutions</span>
                  </h2>
                </div>
                <div className="gtr-shop-tools">
                  <span className="gtr-filter-chip-btn">
                    <SlidersHorizontal size={16} aria-hidden="true" /> Filter
                  </span>
                  <select className="gtr-sort" aria-label="Sort packages" defaultValue="featured">
                    <option value="featured">Sort by: Featured</option>
                    <option value="low">Price: Low to high</option>
                    <option value="high">Price: High to low</option>
                  </select>
                </div>
              </div>
              <PackageFilters
                filters={categories.map(id => ({ id, label: id }))}
                activeId={activeCategory}
                onChange={setActiveCategory}
                counts={counts}
              />
              <div className="gtr-shop-meta">
                <span>
                  <strong>{filtered.length}</strong> packages
                </span>
                <span>Prices shown in NGN · Installation included</span>
              </div>
              <AnimatedList
                className="gtr-package-grid"
                stagger={0.07}
                duration={0.45}
              >
                {filtered.map(item => (
                  <PackageCard
                    key={item.slug}
                    item={item}
                    onAdd={addToCart}
                    onView={setSelected}
                  />
                ))}
              </AnimatedList>
              <div className="gtr-pagination" aria-label="Pagination">
                <button disabled aria-label="Previous page">
                  <ChevronLeft size={17} />
                </button>
                <button className="is-active" aria-current="page">
                  1
                </button>
                <button>2</button>
                <button>3</button>
                <span aria-hidden="true">...</span>
                <button>7</button>
                <button aria-label="Next page">
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* (7) installations gallery */}
          <InstallationsGallery />

          {/* (8) embedded solar planner */}
          <SolarPlanner />

          {/* (9) assessment banner */}
          <section className="gtr-assessment" aria-label="Book a free assessment">
            <div className="container gtr-assessment-inner">
              <div>
                <p className="gtr-kicker">Not sure where to start?</p>
                <h2>
                  Book a free technical <span>site assessment.</span>
                </h2>
              </div>
              <a href={ASSESSMENT_URL} className="gtr-assessment-cta">
                Book on WhatsApp <MessageCircle size={17} />
              </a>
            </div>
          </section>

          {/* (10) contact / newsletter */}
          <section id="contact" className="gtr-section gtr-contact" aria-label="Contact and newsletter">
            <div className="container gtr-contact-grid">
              <div>
                <p className="gtr-kicker">Stay in the loop</p>
                <h2>
                  Get smart with <span>your power.</span>
                </h2>
                <p className="gtr-contact-copy">
                  Follow G-Tech Consult for new installations, practical energy
                  tips, offers and smart security updates.
                </p>
                <div className="gtr-social-row">
                  <a href="https://www.instagram.com/gtechconsult/">
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/gtechconsults/">Facebook</a>
                  <a href={ASSESSMENT_URL}>WhatsApp</a>
                </div>
              </div>
              <div className="gtr-subscribe">
                <p>Sign up for discounts &amp; updates</p>
                <div className="gtr-subscribe__row">
                  <input
                    placeholder="Your email address"
                    type="email"
                    aria-label="Email address"
                  />
                  <button>Subscribe</button>
                </div>
                <small>
                  By subscribing, you agree to receive updates from G-Tech
                  Consult.
                </small>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* (11) footer */}
      <SiteFooter />

      {toast && (
        <div className="gtr-toast" role="status">
          <ShoppingCart size={16} /> {toast}
        </div>
      )}

      {cartOpen && (
        <div className="gtr-cart-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="gtr-cart-drawer"
            onClick={event => event.stopPropagation()}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="gtr-cart-head">
              <h2>
                Your cart <span>({cart.length})</span>
              </h2>
              <button
                className="gtr-icon-btn"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="gtr-cart-empty">
                <ShoppingCart size={38} aria-hidden="true" />
                <p>Your cart is empty.</p>
                <span>Add packages to start a quote.</span>
              </div>
            ) : (
              <>
                <div className="gtr-cart-items">
                  {cart.map((item, index) => (
                    <div className="gtr-cart-item" key={`${item.slug}-${index}`}>
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{formatNaira(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="gtr-cart-foot">
                  <div className="gtr-cart-total">
                    <span>Estimated total</span>
                    <strong>{formatNaira(cartTotal)}</strong>
                  </div>
                  <a
                    href={`${WHATSAPP}?text=${encodeURIComponent(`Hello G-Tech Consult, I would like to request a quote for: ${cart.map(item => item.title).join(", ")}.`)}`}
                    className="gtr-quote-btn"
                  >
                    Request quote on WhatsApp <MessageCircle size={16} />
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
