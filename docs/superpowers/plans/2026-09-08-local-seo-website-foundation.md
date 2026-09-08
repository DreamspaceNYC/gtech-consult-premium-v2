# Local SEO Website Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build crawlable, pre-rendered, locally relevant pages on gtechconsult.ng while preserving the current React storefront and WhatsApp sales flow.

**Architecture:** Keep React 19, Vite 7, Wouter, and the existing visual system. Centralize canonical business data, route metadata, services, and packages in typed modules; render those modules through reusable pages; then use a two-pass Vite build and a small Node pre-renderer to produce complete HTML for every canonical route.

**Tech Stack:** React 19, TypeScript 5.6, Vite 7, Wouter 3, Vitest 2, React DOM server rendering, Node.js file APIs, Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-09-08-local-seo-design.md`

## Global Constraints

- The public name is exactly **G-Tech Consult**.
- The only canonical origin is `https://gtechconsult.ng`.
- The approved address is **KM 140 Ondo–Ore Road, Adesuper Junction, Ondo City, Ondo State 100967, Nigeria**.
- Public opening hours are **Monday–Saturday, 9:00 AM–6:00 PM**.
- The location is a staffed, customer-facing business.
- The primary phone is `+2348167498489`; verify it with the owner at the pre-deployment gate.
- Do not publish or link to `gtechconsult.net`.
- Preserve the current product catalogue, styling, responsive behavior, telephone links, WhatsApp flow, and Google Maps link.
- Do not add fabricated reviews, ratings, clients, certifications, project outcomes, warranties, or service-area offices.
- Do not deploy to production until the website tests, rendered-output audit, visual review, and owner review pass.

---

## File Structure

### New source files

- `client/src/content/business.ts` — canonical name, NAP, hours, social URLs, map URL, and contact URLs.
- `client/src/content/services.ts` — typed service-page content for four service routes.
- `client/src/content/packages.ts` — the existing seven package records extracted from `Home.tsx`.
- `client/src/content/sitePages.ts` — metadata and page content for home, packages, projects, about, contact, and 404.
- `client/src/seo/routes.ts` — canonical route registry and route lookup.
- `client/src/seo/schema.ts` — pure JSON-LD builders.
- `client/src/seo/head.ts` — pure HTML-head serializer used by pre-rendering.
- `client/src/seo/SeoHead.tsx` — browser navigation head synchronization.
- `client/src/components/site/SiteHeader.tsx` — accessible cross-page navigation.
- `client/src/components/site/SiteFooter.tsx` — canonical business details and service links.
- `client/src/components/site/PageHero.tsx` — reusable page title, introduction, and CTA.
- `client/src/components/site/Breadcrumbs.tsx` — visible linked breadcrumbs.
- `client/src/components/site/ContactCta.tsx` — reusable call/WhatsApp/site-assessment CTA.
- `client/src/pages/ServicePage.tsx` — typed service-detail page.
- `client/src/pages/SolarPackages.tsx` — crawlable package listing.
- `client/src/pages/Projects.tsx` — evidence-oriented projects page without invented case studies.
- `client/src/pages/About.tsx` — company, approach, and service-area page.
- `client/src/pages/Contact.tsx` — canonical NAP, hours, map, call, and WhatsApp page.
- `client/src/entry-server.tsx` — server-render entry returning body markup and route head.
- `scripts/prerender.mjs` — writes route-specific `index.html` files and `404.html`.
- `scripts/audit-seo-output.mjs` — verifies built routes, metadata, canonicals, NAP, links, and forbidden-domain absence.
- `client/src/seo/routes.test.ts` — route registry and metadata tests.
- `client/src/seo/schema.test.ts` — structured-data tests.
- `client/src/content/content.test.ts` — NAP, service, package, and uniqueness tests.

### Modified files

- `package.json` — add test, client build, SSR build, pre-render, and output-audit scripts.
- `vite.config.ts` — emit the client build without erasing the SSR output and preserve the current plugins.
- `client/index.html` — reduce to safe default metadata, add replaceable SEO markers, and remove the unresolved analytics URL.
- `client/src/main.tsx` — hydrate pre-rendered HTML and fall back to client rendering in development.
- `client/src/App.tsx` — register all routes and support an SSR path.
- `client/src/pages/Home.tsx` — consume centralized data, use a locally relevant H1, and add crawlable service/proof links.
- `client/src/pages/NotFound.tsx` — use site styling and a normal anchor to the homepage.
- `client/src/index.css` — add shared page, breadcrumb, service, proof, NAP, and responsive styles.
- `client/public/robots.txt` — retain open crawling and the canonical sitemap reference.
- `client/public/sitemap.xml` — list every canonical indexable route with the release date.

## Canonical Route and Metadata Contract

| Path | Title | H1 |
|---|---|---|
| `/` | Solar Installation Company in Ondo City | G-Tech Consult | Solar Installation Company in Ondo City |
| `/solar-installation-ondo-city` | Solar Installation in Ondo City | G-Tech Consult | Solar Installation in Ondo City for Homes and Businesses |
| `/solar-installation-ondo-state` | Solar Installation Across Ondo State | G-Tech Consult | Solar Installation Services Across Ondo State |
| `/inverter-lithium-battery-installation` | Inverter & Lithium Battery Installation in Ondo | G-Tech Consult | Inverter and Lithium Battery Installation in Ondo |
| `/cctv-installation-ondo` | CCTV Installation in Ondo | G-Tech Consult | CCTV Installation for Homes and Businesses in Ondo |
| `/smart-home-automation` | Smart Home Automation in Ondo | G-Tech Consult | Smart Home Automation in Ondo |
| `/solar-packages` | Solar Packages and Prices in Ondo | G-Tech Consult | Solar Packages for Different Power Needs |
| `/projects` | Solar, CCTV and Automation Projects | G-Tech Consult | Our Installation Work |
| `/about` | About G-Tech Consult | Ondo Energy & Security Specialists | About G-Tech Consult |
| `/contact` | Contact G-Tech Consult in Ondo City | Contact G-Tech Consult |
| `/404` | Page Not Found | G-Tech Consult | Page Not Found |

The `/404` route is excluded from the sitemap and carries `noindex, follow`.

### Task 1: Canonical business and route data

**Files:**
- Create: `client/src/content/business.ts`
- Create: `client/src/content/sitePages.ts`
- Create: `client/src/seo/routes.ts`
- Create: `client/src/seo/routes.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `BUSINESS: BusinessDetails`, `SITE_PAGES: Record<StaticPageSlug, SitePage>`, `INDEXABLE_PATHS: readonly string[]`, `getRouteSeo(pathname: string): RouteSeo`.
- Consumes: no earlier task interfaces.

- [ ] **Step 1: Add the test command and write failing route tests**

Add `"test": "vitest run"` and `"test:watch": "vitest"` under `scripts`.

Create tests that assert:

```ts
expect(BUSINESS.name).toBe("G-Tech Consult");
expect(BUSINESS.canonicalOrigin).toBe("https://gtechconsult.ng");
expect(BUSINESS.postalCode).toBe("100967");
expect(BUSINESS.openingHours).toEqual([
  { days: "Monday–Saturday", opens: "09:00", closes: "18:00" },
]);
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
expect(getRouteSeo("/contact").canonical).toBe("https://gtechconsult.ng/contact");
expect(getRouteSeo("/missing").robots).toBe("noindex, follow");
```

- [ ] **Step 2: Run the tests and confirm the missing-module failure**

Run: `pnpm test -- client/src/seo/routes.test.ts`  
Expected: FAIL because `business.ts` and `routes.ts` do not exist.

- [ ] **Step 3: Implement immutable business and route records**

Define `BusinessDetails` with these exact values: name `G-Tech Consult`, origin `https://gtechconsult.ng`, E.164 phone `+2348167498489`, display phone `0816 749 8489`, WhatsApp `https://wa.me/2348167498489`, map `https://maps.app.goo.gl/FK4QEWGyVbmGxz3K6`, full approved address, postcode `100967`, locality `Ondo City`, region `Ondo State`, country `Nigeria`, and Monday–Saturday 09:00–18:00.

Define `RouteSeo` as:

```ts
export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  robots: "index, follow, max-image-preview:large" | "noindex, follow";
  image: string;
};
```

Use the metadata table above and unique descriptions of 130–160 characters that accurately summarize each page. Normalize trailing slashes so both `/contact` and `/contact/` resolve to the same record; unknown paths return the 404 record.

- [ ] **Step 4: Run the route tests**

Run: `pnpm test -- client/src/seo/routes.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit the data contract**

```bash
git add package.json client/src/content/business.ts client/src/content/sitePages.ts client/src/seo/routes.ts client/src/seo/routes.test.ts
git commit -m "feat: centralize canonical local SEO data"
```

### Task 2: Service and package content modules

**Files:**
- Create: `client/src/content/services.ts`
- Create: `client/src/content/packages.ts`
- Create: `client/src/content/content.test.ts`
- Modify: `client/src/pages/Home.tsx`

**Interfaces:**
- Consumes: `BUSINESS` from Task 1.
- Produces: `SERVICE_PAGES: readonly ServicePageContent[]`, `SOLAR_PACKAGES: readonly SolarPackage[]`, `getServiceByPath(path: string): ServicePageContent | undefined`.

- [ ] **Step 1: Write failing content-integrity tests**

Test that the four service records use these paths:

```ts
expect(SERVICE_PAGES.map(service => service.path)).toEqual([
  "/solar-installation-ondo-city",
  "/solar-installation-ondo-state",
  "/inverter-lithium-battery-installation",
  "/cctv-installation-ondo",
  "/smart-home-automation",
]);
```

The expected list intentionally contains five records: two distinct solar coverage pages and three distinct non-solar services. Assert every record has at least three benefits, three process steps, three FAQs with non-empty answers, one CTA, and a unique title/H1/description. Assert all seven existing package slugs remain unique and all prices are positive integers. Recursively stringify the exported content and assert it does not contain `gtechconsult.net`.

- [ ] **Step 2: Run the content tests**

Run: `pnpm test -- client/src/content/content.test.ts`  
Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Extract the seven package records without changing commercial data**

Move the complete `PackageItem`, `Package`, and `packages` definitions from `Home.tsx` to `client/src/content/packages.ts`. Rename the public exports to `PackageItem`, `SolarPackage`, and `SOLAR_PACKAGES`. Preserve every slug, title, price, old price, badge, image, system specification, battery specification, panel specification, description, powered-appliance statement, note, included item, and inclusion.

- [ ] **Step 4: Implement truthful service records**

Each service record must contain the exact route/H1 from the metadata contract and these distinct content themes:

- Ondo City solar: on-site assessment, load calculation, component sizing, safe installation, commissioning, and local after-installation support.
- Ondo State solar: scheduled assessment outside Ondo City, logistics planning, residential/commercial scope, and service-area confirmation before quotation.
- Inverter/lithium battery: backup duration depends on load and usable capacity; compatible inverter, protection, cabling, ventilation, and commissioning.
- CCTV: camera-position survey, recording/storage needs, night visibility, remote viewing where internet is available, protected cabling, and user handover.
- Smart home: lighting, access, selected appliance control, security integration, manual fallback, and solutions scoped after assessment.

FAQs must answer real buying questions without promising a fixed battery runtime, universal price, guaranteed savings, or same-day installation.

- [ ] **Step 5: Update Home imports and run tests**

Replace the inline array with `SOLAR_PACKAGES` and update local type references.

Run: `pnpm test -- client/src/content/content.test.ts && pnpm check`  
Expected: PASS.

- [ ] **Step 6: Commit the content extraction**

```bash
git add client/src/content/services.ts client/src/content/packages.ts client/src/content/content.test.ts client/src/pages/Home.tsx
git commit -m "refactor: extract service and package content"
```

### Task 3: Structured data and document-head generation

**Files:**
- Create: `client/src/seo/schema.ts`
- Create: `client/src/seo/schema.test.ts`
- Create: `client/src/seo/head.ts`
- Create: `client/src/seo/SeoHead.tsx`
- Modify: `client/index.html`

**Interfaces:**
- Consumes: `BUSINESS`, `RouteSeo`, `SERVICE_PAGES`, and `SOLAR_PACKAGES`.
- Produces: `buildLocalBusinessSchema(): JsonLd`, `buildPageSchemas(path): JsonLd[]`, `renderSeoHead(path): string`, and React component `SeoHead({ path }: { path: string })`.

- [ ] **Step 1: Write failing schema tests**

Assert the local-business schema contains:

```ts
expect(schema["@id"]).toBe("https://gtechconsult.ng/#business");
expect(schema.name).toBe("G-Tech Consult");
expect(schema.telephone).toBe("+2348167498489");
expect(schema.address.postalCode).toBe("100967");
expect(schema.openingHoursSpecification[0]).toMatchObject({
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  opens: "09:00",
  closes: "18:00",
});
```

Assert service routes include `Service` and `BreadcrumbList`; the homepage includes `LocalBusiness`; `/solar-packages` includes an `OfferCatalog`; and no output includes `aggregateRating`, `Review`, or `gtechconsult.net`.

- [ ] **Step 2: Run the schema test and confirm failure**

Run: `pnpm test -- client/src/seo/schema.test.ts`  
Expected: FAIL because `schema.ts` does not exist.

- [ ] **Step 3: Implement pure schema builders**

Use `LocalBusiness` with the approved address, phone, `priceRange: "₦₦"`, `areaServed` for Ondo City and Ondo State, the map URL, visible social URLs already present in the site, and `hasOfferCatalog` based on actual services. Use `Service` only on service pages, `OfferCatalog` on the package overview, and `BreadcrumbList` for every non-home indexable page. Do not add rating or review properties.

- [ ] **Step 4: Implement safe head serialization**

`renderSeoHead(path)` must HTML-escape title and attribute values, JSON-stringify schemas, replace `<` with `\\u003c` inside JSON-LD, and return title, description, robots, canonical, Open Graph, Twitter, and JSON-LD tags. Give all managed tags `data-seo-managed="true"`.

`SeoHead` must update the same fields after client-side navigation and replace managed JSON-LD scripts, leaving the favicon, fonts, charset, viewport, and theme color untouched.

- [ ] **Step 5: Replace the static head with a safe default**

Keep charset, viewport, theme color, favicon, apple icon, sitemap link, and font links. Put the default homepage head between:

```html
<!--seo-head-start-->
<!-- route-specific metadata is injected during pre-rendering -->
<!--seo-head-end-->
```

Remove the script whose source contains `%VITE_ANALYTICS_ENDPOINT%/umami`; do not replace it until a real analytics property is configured.

- [ ] **Step 6: Run schema, type, and format checks**

Run: `pnpm test -- client/src/seo/schema.test.ts && pnpm check`  
Expected: PASS.

- [ ] **Step 7: Commit SEO serialization**

```bash
git add client/index.html client/src/seo/schema.ts client/src/seo/schema.test.ts client/src/seo/head.ts client/src/seo/SeoHead.tsx
git commit -m "feat: add route metadata and structured data"
```

### Task 4: Shared navigation, footer, breadcrumbs, and CTAs

**Files:**
- Create: `client/src/components/site/SiteHeader.tsx`
- Create: `client/src/components/site/SiteFooter.tsx`
- Create: `client/src/components/site/PageHero.tsx`
- Create: `client/src/components/site/Breadcrumbs.tsx`
- Create: `client/src/components/site/ContactCta.tsx`
- Modify: `client/src/index.css`

**Interfaces:**
- Consumes: `BUSINESS`, `INDEXABLE_PATHS`, and `RouteSeo`.
- Produces: reusable layout components with ordinary crawlable `<a href>` links.

- [ ] **Step 1: Add server-render smoke assertions**

Extend `routes.test.ts` to render the shared header/footer with `renderToStaticMarkup` and assert the output includes `href="/solar-installation-ondo-city"`, `href="/projects"`, `href="/contact"`, the full approved address, `tel:+2348167498489`, and the WhatsApp URL.

- [ ] **Step 2: Run tests and confirm missing-component failure**

Run: `pnpm test -- client/src/seo/routes.test.ts`  
Expected: FAIL because the shared components do not exist.

- [ ] **Step 3: Implement semantic shared components**

Use a skip link, `header`, `nav aria-label="Primary navigation"`, `main id="main-content"`, and `footer`. Navigation must link to Home, Solar Installation, Solar Packages, Projects, About, and Contact. The footer must link to all five services plus packages/projects/about/contact and display the canonical phone, complete address, and approved hours.

`Breadcrumbs` must render `Home` plus the current page and use `aria-current="page"`. `ContactCta` must provide separate call and WhatsApp anchors.

- [ ] **Step 4: Add responsive shared styles**

Add focused classes for `.site-header`, `.site-nav`, `.site-footer`, `.page-hero`, `.breadcrumbs`, `.contact-cta`, `.service-grid`, `.proof-grid`, and `.nap-card`. Reuse the current green, cream, ink, spacing, Manrope, and Space Grotesk tokens; do not replace the existing storefront styles.

- [ ] **Step 5: Run tests and type checking**

Run: `pnpm test -- client/src/seo/routes.test.ts && pnpm check`  
Expected: PASS.

- [ ] **Step 6: Commit the shared shell**

```bash
git add client/src/components/site client/src/index.css client/src/seo/routes.test.ts
git commit -m "feat: add crawlable site navigation and local footer"
```

### Task 5: Service pages and application routes

**Files:**
- Create: `client/src/pages/ServicePage.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/pages/NotFound.tsx`

**Interfaces:**
- Consumes: `getServiceByPath`, `getRouteSeo`, `SeoHead`, and all shared site components.
- Produces: SSR-compatible routing for all five service URLs and a noindex 404 route.

- [ ] **Step 1: Add failing route-render tests**

For each service path, render `<App ssrPath={path} />` with `renderToString` and assert that the HTML contains the route's H1, a visible process section, an FAQ section, a call link, and a WhatsApp link. Render `/does-not-exist` and assert it contains `Page Not Found`.

- [ ] **Step 2: Run the tests**

Run: `pnpm test -- client/src/seo/routes.test.ts`  
Expected: FAIL because `App` does not accept `ssrPath` and service routes do not exist.

- [ ] **Step 3: Implement the service template**

Render, in order: `SeoHead`, shared header, breadcrumbs, page hero, problem/solution introduction, benefits, installation process, service-area statement, FAQs, contact CTA, and shared footer. Each FAQ answer must be visible in initial HTML; use native `details/summary` if collapsible behavior is wanted.

- [ ] **Step 4: Register explicit routes and SSR path support**

Change the app signature to `App({ ssrPath }: { ssrPath?: string })` and wrap the route switch in Wouter's `Router` using `ssrPath` during server rendering. Register each canonical route explicitly. Keep `/404` and the fallback route. The fallback must render `SeoHead` for the 404 route.

- [ ] **Step 5: Replace button-only 404 navigation**

Use `<a href="/">Return to G-Tech Consult</a>` so the route works without JavaScript and remove `useLocation` from `NotFound.tsx`.

- [ ] **Step 6: Run route tests and type checking**

Run: `pnpm test -- client/src/seo/routes.test.ts && pnpm check`  
Expected: PASS.

- [ ] **Step 7: Commit service routing**

```bash
git add client/src/App.tsx client/src/pages/ServicePage.tsx client/src/pages/NotFound.tsx client/src/seo/routes.test.ts
git commit -m "feat: add indexable local service routes"
```

### Task 6: Packages, projects, about, and contact pages

**Files:**
- Create: `client/src/pages/SolarPackages.tsx`
- Create: `client/src/pages/Projects.tsx`
- Create: `client/src/pages/About.tsx`
- Create: `client/src/pages/Contact.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/index.css`

**Interfaces:**
- Consumes: `BUSINESS`, `SOLAR_PACKAGES`, page metadata, and shared site components.
- Produces: four crawlable trust and conversion pages.

- [ ] **Step 1: Write failing render assertions**

Assert:

- `/solar-packages` renders all seven package names and visible price text;
- `/projects` renders the heading `Our Installation Work` and explains that photographs and project details represent work completed by G-Tech Consult;
- `/about` renders the canonical name, Ondo City, and the five service links;
- `/contact` renders the complete address, approved hours, phone, WhatsApp, and Google Maps URL.

- [ ] **Step 2: Run tests and confirm route failures**

Run: `pnpm test -- client/src/seo/routes.test.ts`  
Expected: FAIL because the pages and routes do not exist.

- [ ] **Step 3: Build the package overview**

Render every package as a crawlable article with image, title, system, battery, panels, description, powered-load list, inclusion summary, price, assessment disclaimer, and WhatsApp CTA. Preserve current pricing and state that final sizing follows assessment; do not present estimated runtime as guaranteed.

- [ ] **Step 4: Build proof, company, and contact pages**

Projects must reuse only repository-owned installation/product imagery and factual captions; when no verified project details exist, use transparent portfolio categories and invite the owner to add dated case studies after customer permission. About must explain assessment, design, installation, commissioning, and support without invented years or credentials. Contact must show the canonical NAP/hours and ordinary anchors for phone, WhatsApp, map, Instagram, and Facebook.

- [ ] **Step 5: Register routes and add responsive styles**

Add explicit routes for `/solar-packages`, `/projects`, `/about`, and `/contact`. Add only the new page-specific layout classes to `index.css`.

- [ ] **Step 6: Run all source tests**

Run: `pnpm test && pnpm check`  
Expected: PASS.

- [ ] **Step 7: Commit trust and conversion pages**

```bash
git add client/src/App.tsx client/src/index.css client/src/pages/SolarPackages.tsx client/src/pages/Projects.tsx client/src/pages/About.tsx client/src/pages/Contact.tsx client/src/seo/routes.test.ts
git commit -m "feat: add packages proof about and contact pages"
```

### Task 7: Localize and connect the homepage

**Files:**
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/index.css`

**Interfaces:**
- Consumes: canonical content modules, `SeoHead`, and shared navigation/footer.
- Produces: locally focused homepage with preserved shop interactions.

- [ ] **Step 1: Add failing homepage assertions**

Render the homepage and assert one H1 contains `Solar Installation Company in Ondo City`; the HTML links to all five service routes, packages, projects, about, and contact; and it contains the canonical address and approved hours. Assert there is exactly one `<h1`.

- [ ] **Step 2: Run the homepage test**

Run: `pnpm test -- client/src/seo/routes.test.ts`  
Expected: FAIL against the current generic hero and anchor-only navigation.

- [ ] **Step 3: Refactor the homepage without removing commerce behavior**

Keep category filtering, sorting, pagination, favorites, product-detail state, cart state, WhatsApp order links, and responsive product cards. Replace the hero H1 with the approved local H1, add a short natural explanation of solar/inverter/CCTV/automation work in Ondo, change service controls that represent destinations into ordinary route links, and add sections for process, operating area, proof/projects, and canonical NAP.

Use the shared header/footer or adapt their exact navigation/NAP contracts into the current store shell; do not render two headers or two footers.

- [ ] **Step 4: Verify behavior and markup**

Run: `pnpm test && pnpm check`  
Expected: PASS.

Manually check at widths 390px, 768px, and 1440px: menu, hero, filters, package details, cart, WhatsApp links, footer, focus states, and horizontal overflow.

- [ ] **Step 5: Commit homepage localization**

```bash
git add client/src/pages/Home.tsx client/src/index.css client/src/seo/routes.test.ts
git commit -m "feat: position homepage for solar installation in Ondo"
```

### Task 8: Static pre-render build

**Files:**
- Create: `client/src/entry-server.tsx`
- Create: `scripts/prerender.mjs`
- Modify: `client/src/main.tsx`
- Modify: `package.json`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: `App({ ssrPath })`, `INDEXABLE_PATHS`, and `renderSeoHead(path)`.
- Produces: `render(path): { appHtml: string; headHtml: string }` and complete static HTML under `dist/public`.

- [ ] **Step 1: Add a failing pre-render command**

Add scripts:

```json
{
  "build:client": "vite build",
  "build:ssr": "vite build --ssr src/entry-server.tsx --outDir ../dist/ssr --emptyOutDir",
  "prerender": "node scripts/prerender.mjs",
  "audit:seo": "node scripts/audit-seo-output.mjs",
  "build": "pnpm run build:client && pnpm run build:ssr && pnpm run prerender && pnpm run audit:seo && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
}
```

Run: `pnpm run build`  
Expected: FAIL because the SSR entry and pre-render scripts do not exist.

- [ ] **Step 2: Implement the SSR entry**

Export:

```ts
export function render(path: string): { appHtml: string; headHtml: string } {
  return {
    appHtml: renderToString(<App ssrPath={path} />),
    headHtml: renderSeoHead(path),
  };
}
```

The module must not read `window`, `document`, local storage, or browser-only layout state during render.

- [ ] **Step 3: Hydrate server markup in production**

In `main.tsx`, select `#root`. If it has child nodes, call `hydrateRoot(root, <App />)`; otherwise call `createRoot(root).render(<App />)`. Throw a clear error if the root element is missing.

- [ ] **Step 4: Implement deterministic HTML generation**

`scripts/prerender.mjs` must:

1. import `INDEXABLE_PATHS` from the compiled SSR module through an exported `getIndexablePaths()`;
2. read `dist/public/index.html` as the Vite-produced asset template;
3. replace the content between the SEO markers with `headHtml`;
4. replace `<div id="root"></div>` with the rendered body;
5. write root HTML to `dist/public/index.html`;
6. write each other route to `dist/public/<route>/index.html`;
7. render `/404` to both `dist/public/404/index.html` and `dist/public/404.html`;
8. fail if either marker or the empty root node is missing;
9. remove `dist/ssr` after successful generation so it is not published as a static asset.

- [ ] **Step 5: Keep Vite output stable**

Set `build.manifest` only if needed for diagnostics; retain `dist/public` and `emptyOutDir: true` for the client pass. The SSR command's explicit output directory must not erase `dist/public`.

- [ ] **Step 6: Run source tests and the client/SSR build**

Run: `pnpm test && pnpm check && pnpm run build:client && pnpm run build:ssr && pnpm run prerender`  
Expected: PASS, with ten canonical route HTML files plus `404.html`.

- [ ] **Step 7: Commit pre-rendering**

```bash
git add package.json vite.config.ts client/src/main.tsx client/src/entry-server.tsx scripts/prerender.mjs
git commit -m "feat: prerender canonical routes for search crawlers"
```

### Task 9: Sitemap, robots, output audit, and real 404 behavior

**Files:**
- Create: `scripts/audit-seo-output.mjs`
- Modify: `client/public/sitemap.xml`
- Modify: `client/public/robots.txt`
- Modify: `server/index.ts`

**Interfaces:**
- Consumes: the built `dist/public` files and canonical route registry.
- Produces: a failing build when SEO output is incomplete or inconsistent.

- [ ] **Step 1: Write the output audit before implementation**

The audit must fail unless:

- every indexable path has an HTML file;
- every file has exactly one title, description, canonical, and H1;
- the canonical equals the route URL;
- title and description values are unique across indexable routes;
- initial HTML contains `G-Tech Consult`, `100967`, and at least one internal crawlable link;
- service routes contain `Service` and `BreadcrumbList` JSON-LD;
- the homepage contains `LocalBusiness` JSON-LD;
- the 404 file contains `noindex, follow`;
- no public text file contains `gtechconsult.net`, `%VITE_ANALYTICS_ENDPOINT%`, or `%VITE_ANALYTICS_WEBSITE_ID%`;
- the sitemap route set exactly equals `INDEXABLE_PATHS`.

Run: `pnpm run audit:seo`  
Expected: FAIL until the sitemap and built pages satisfy the assertions.

- [ ] **Step 2: Expand the sitemap**

List the ten indexable canonical URLs in the exact route-registry order. Use `2026-09-08` as the initial `lastmod`. Omit `changefreq` and `priority`, because they do not provide reliable scheduling or ranking instructions.

- [ ] **Step 3: Keep robots explicit and canonical**

Use exactly:

```text
User-agent: *
Allow: /

Sitemap: https://gtechconsult.ng/sitemap.xml
```

- [ ] **Step 4: Return a server-side 404 outside Cloudflare Pages**

Replace the Express catch-all `index.html` response with a check for a generated route file; serve its `index.html` for known routes and respond with status 404 plus `dist/public/404.html` for unknown paths. Keep static asset serving ahead of route handling.

- [ ] **Step 5: Run the complete verification suite**

Run: `pnpm test && pnpm check && pnpm run build && pnpm run audit:seo`  
Expected: PASS.

Run: `NODE_ENV=production node dist/index.js`, then verify:

```bash
curl -I http://localhost:3000/contact
curl -I http://localhost:3000/not-a-real-page
```

Expected: `/contact` returns 200 and the missing path returns 404.

- [ ] **Step 6: Commit crawl controls and audit**

```bash
git add client/public/robots.txt client/public/sitemap.xml scripts/audit-seo-output.mjs server/index.ts
git commit -m "test: enforce crawlable SEO build output"
```

### Task 10: Final branch verification and review gate

**Files:**
- Modify only files required by failures found in this task.
- Reference: `docs/superpowers/specs/2026-09-08-local-seo-design.md`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: a reviewable branch; it does not merge or deploy.

- [ ] **Step 1: Search for identity and domain drift**

Run:

```bash
rg -n -i "gtechconsult\.net|GTech Solar Consultants|GTECH Consults|Adesuper Junction, Ondo City|8.?AM|7.?PM" client scripts server
```

Expected: no old domain or old brand variants; address matches the approved full address; only approved 9:00 AM–6:00 PM public hours remain.

- [ ] **Step 2: Run clean verification**

Run:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm run build
pnpm run audit:seo
```

Expected: every command exits 0.

- [ ] **Step 3: Inspect rendered pages**

Serve `dist/public` and inspect all ten indexable routes plus a missing route at 390px, 768px, and 1440px. Confirm navigation, headings, images, package interactions, call links, WhatsApp links, map links, focus states, hydration, console output, and absence of horizontal overflow.

- [ ] **Step 4: Record the reviewer handoff**

Provide the commit list, verification output, preview URL, screenshots for home/service/contact at mobile and desktop sizes, and known limitations: no `.net` redirect, no guaranteed ranking, and no GBP edits completed by code.

- [ ] **Step 5: Stop before production**

Do not merge `seo/local-search-foundation`, modify Cloudflare production routing, or update the Google Business Profile until the owner approves the verified preview.
