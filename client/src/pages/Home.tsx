import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  ShoppingCart,
  SlidersHorizontal,
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

const WHATSAPP = "https://wa.me/2348167498489";
const categories = ["All", "Solar Installation", "CCTV", "Smart Homes"];
const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

function ProductCard({
  item,
  onAdd,
  onView,
}: {
  item: Package;
  onAdd: (item: Package) => void;
  onView: (item: Package) => void;
}) {
  return (
    <article className="product-card">
      <button
        className="product-image-wrap"
        onClick={() => onView(item)}
        aria-label={`View details for ${item.title}`}
      >
        <img src={item.image} alt={item.title} className="product-image" />
        {item.badge && <span className="product-badge">{item.badge}</span>}
        <span className="wish-button">
          <Heart size={16} />
        </span>
      </button>
      <div className="product-body">
        <p className="product-category">{item.category}</p>
        <h3>{item.title}</h3>
        <div className="product-rating">
          <span>G-Tech package</span>
        </div>
        <div className="product-price">
          <strong>{formatNaira(item.price)}</strong>
        </div>
        <div className="product-card-actions">
          <button className="add-cart" onClick={() => onAdd(item)}>
            Add to Cart <ShoppingCart size={15} />
          </button>
          <button className="details-button" onClick={() => onView(item)}>
            View details
          </button>
        </div>
      </div>
    </article>
  );
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
    <div className="detail-page">
      <div className="container">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={16} /> Back to packages
        </button>
        <div className="detail-hero">
          <div className="detail-image">
            <img src={item.image} alt={item.title} />
          </div>
          <div className="detail-intro">
            <p className="store-kicker">G-Tech Consult · Solar Installation</p>
            <h1>{item.title}</h1>
            <p className="detail-description">{item.description}</p>
            <div className="detail-price">{formatNaira(item.price)}</div>
            <p className="detail-price-note">
              Complete package price including listed installation items.
            </p>
            <div className="detail-actions">
              <button
                className="store-button green"
                onClick={() => onAdd(item)}
              >
                Add to cart <ShoppingCart size={16} />
              </button>
              <a
                className="store-button outline"
                href={`${WHATSAPP}?text=${encodeURIComponent(`Hello G-Tech Consult, I am interested in the ${item.title} at ${formatNaira(item.price)}. Please help me arrange a technical assessment.`)}`}
              >
                <MessageCircle size={16} /> Request on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="detail-grid">
          <div>
            <section className="detail-section">
              <p className="store-kicker">Designed for</p>
              <h2>What it can power</h2>
              <ul className="power-list">
                {item.powers.map(power => (
                  <li key={power}>
                    ✓ <span>{power}</span>
                  </li>
                ))}
              </ul>
              {item.notes?.map(note => (
                <div className="detail-note" key={note}>
                  <strong>Important usage note</strong>
                  <p>{note}</p>
                </div>
              ))}
            </section>
            <section className="detail-section">
              <p className="store-kicker">Included system</p>
              <h2>Equipment specification</h2>
              <div className="spec-table">
                {item.items.map(entry => (
                  <div className="spec-row" key={entry.name}>
                    <strong>{entry.name}</strong>
                    <span>{entry.spec}</span>
                    <b>{entry.qty}</b>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <aside className="inclusions-card">
            <p className="store-kicker">Package inclusions</p>
            <h2>Ready for installation</h2>
            <ul>
              {item.inclusions.map(entry => (
                <li key={entry}>✓ {entry}</li>
              ))}
            </ul>
            <div className="assessment-box">
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
        <div className="detail-disclaimer">
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
  const addToCart = (item: Package) => {
    setCart(current => [...current, item]);
    setToast(`${item.shortTitle} added to cart`);
    window.setTimeout(() => setToast(""), 2400);
  };
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="storefront">
      <SeoHead path="/" />
      <div className="promo-bar">
        <div className="promo-track">
          <span>
            Book a free technical site assessment for solar & security
            installations
          </span>
          <span>
            Book a free technical site assessment for solar & security
            installations
          </span>
          <span>
            Book a free technical site assessment for solar & security
            installations
          </span>
        </div>
      </div>
      <SiteHeader />
      <div className="container cart-access">
        <button
          className="store-button outline"
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
          <section id="top" className="store-hero">
            <div className="container store-hero-inner">
              <div className="hero-copy-store">
                <p className="store-kicker">G-Tech Consult</p>
                <h1>Reliable Power. Smarter Security. Better Living.</h1>
                <p>
                  Solar, inverter, battery, CCTV and smart-home solutions for
                  homes and businesses. Based in Ondo, with enquiries welcome
                  from Lagos and elsewhere in Nigeria. Service availability is
                  confirmed for your location.
                </p>
                <div className="store-hero-actions">
                  <a href="#shop" className="store-button green">
                    Shop solutions <ChevronRight size={17} />
                  </a>
                  <a href={ASSESSMENT_URL} className="store-button outline">
                    Get a free assessment <MessageCircle size={16} />
                  </a>
                </div>
              </div>
              <div className="hero-product-card">
                <img
                  src="/images/gtech-premium-comfort-packshot_3201fbb7.png"
                  alt="G-Tech Premium Comfort solar package"
                />
                <div>
                  <span>Featured solution</span>
                  <strong>Premium Comfort Package</strong>
                  <b>{formatNaira(14321800)}</b>
                  <button onClick={() => setSelected(packages[0])}>
                    View product <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="category-strip">
            <div className="container category-strip-inner">
              <div>
                <p>Shop by category</p>
                <strong>Find your solution</strong>
              </div>
              {categories.slice(1).map((category, index) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    document
                      .getElementById("shop")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className={`category-icon category-${index}`} />
                  {category}
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </section>
          <section className="home-services">
            <div className="container">
              <div className="section-heading">
                <p className="page-eyebrow">Technical services</p>
                <h2>Power, security and automation built around your needs</h2>
              </div>
              <div className="service-link-grid">
                {SERVICE_PAGES.map(service => (
                  <a href={service.path} key={service.path}>
                    <h3>{service.h1}</h3>
                    <p>{service.description}</p>
                    <span>Explore service →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
          <section id="shop" className="shop-section">
            <div className="container">
              <div className="shop-heading">
                <div>
                  <p className="store-kicker">G-Tech marketplace</p>
                  <h2>
                    Shop our featured <span>solutions</span>
                  </h2>
                </div>
                <div className="shop-heading-right">
                  <button className="filter-button">
                    <SlidersHorizontal size={16} /> Filter
                  </button>
                  <select aria-label="Sort packages" defaultValue="featured">
                    <option value="featured">Sort by: Featured</option>
                    <option value="low">Price: Low to high</option>
                    <option value="high">Price: High to low</option>
                  </select>
                </div>
              </div>
              <div className="shop-meta">
                <span>{filtered.length} packages</span>
                <span>Prices shown in NGN · Installation included</span>
              </div>
              <div className="product-grid">
                {filtered.map(item => (
                  <ProductCard
                    key={item.slug}
                    item={item}
                    onAdd={addToCart}
                    onView={setSelected}
                  />
                ))}
              </div>
              <div className="pagination">
                <button disabled>
                  <ChevronLeft size={17} />
                </button>
                <button className="selected">1</button>
                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>7</button>
                <button>
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>
          <section className="assessment-banner">
            <div className="container assessment-inner">
              <div>
                <p className="store-kicker">Not sure where to start?</p>
                <h2>
                  Book a free technical
                  <br />
                  <span>site assessment.</span>
                </h2>
              </div>
              <a href={ASSESSMENT_URL} className="store-button dark">
                Book on WhatsApp <MessageCircle size={17} />
              </a>
            </div>
          </section>
          <section id="contact" className="contact-store">
            <div className="container contact-grid">
              <div>
                <p className="store-kicker">Stay in the loop</p>
                <h2>
                  Get smart with
                  <br />
                  <span>your power.</span>
                </h2>
                <p className="contact-copy">
                  Follow G-Tech Consult for new installations, practical energy
                  tips, offers and smart security updates.
                </p>
                <div className="social-row">
                  <a href="https://www.instagram.com/gtechconsult/">
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/gtechconsults/">Facebook</a>
                  <a href={ASSESSMENT_URL}>WhatsApp</a>
                </div>
              </div>
              <div className="subscribe-card">
                <p>Sign up for discounts & updates</p>
                <div>
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
      <SiteFooter />
      {toast && (
        <div className="cart-toast" role="status">
          <ShoppingCart size={16} /> {toast}
        </div>
      )}
      {cartOpen && (
        <div
          className="cart-drawer-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={event => event.stopPropagation()}
          >
            <div className="cart-drawer-head">
              <h2>
                Your cart <span>({cart.length})</span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={38} />
                <p>Your cart is empty.</p>
                <span>Add packages to start a quote.</span>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div key={`${item.slug}-${index}`}>
                      <img src={item.image} alt="" />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{formatNaira(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Estimated total</span>
                  <strong>{formatNaira(cartTotal)}</strong>
                </div>
                <a
                  href={`${WHATSAPP}?text=${encodeURIComponent(`Hello G-Tech Consult, I would like to request a quote for: ${cart.map(item => item.title).join(", ")}.`)}`}
                  className="store-button green full"
                >
                  Request quote on WhatsApp <MessageCircle size={16} />
                </a>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

import React from "react";
