# G-Tech Consult Local SEO Design

**Date:** 2026-09-08  
**Status:** Approved for implementation planning  
**Repository:** `DreamspaceNYC/gtech-consult-premium-v2`  
**Working branch:** `seo/local-search-foundation`

## 1. Objective

Strengthen G-Tech Consult's eligibility, relevance, prominence, and conversion quality for local searches such as:

- solar installers in Ondo
- solar installers in Ondo City
- solar installation company in Ondo
- inverter installation in Ondo
- lithium battery installation in Ondo
- CCTV installation in Ondo
- smart home automation in Ondo

A top-three Google Maps or organic position cannot be guaranteed because rankings also depend on searcher location, competition, profile activity, reputation, and Google's systems. The implementation will establish a technically sound local-search foundation and a measurable ongoing growth process.

## 2. Approved Business Identity

| Field | Canonical value |
|---|---|
| Business name | G-Tech Consult |
| Primary domain | https://gtechconsult.ng |
| Location type | Staffed, customer-facing business |
| Address | KM 140 Ondo–Ore Road, Adesuper Junction, Ondo City, Ondo State 100967, Nigeria |
| Hours | Monday–Saturday, 9:00 AM–6:00 PM |
| Primary category | Solar energy company |
| Primary phone | 0816 749 8489, subject to final owner verification before launch |

The same name, address, phone number, URL, and hours must be used consistently on the website, Google Business Profile, social profiles, directories, quotations, invoices, and future citations.

## 3. Domain Policy

`gtechconsult.ng` is the only canonical public domain.

- All new pages use absolute `.ng` canonical URLs.
- `www.gtechconsult.ng` permanently redirects to `https://gtechconsult.ng`.
- The Cloudflare Pages development hostname redirects to the canonical domain where platform configuration permits it.
- The former `gtechconsult.net` domain is not under the owner's control, so this project cannot implement page-to-page redirects from it.
- All controllable profiles and backlinks should be updated from `.net` to `.ng`.
- The site must never link to or advertise the old domain.

## 4. Selected Technical Approach

Retain the current React/Vite visual system and sales flow, while introducing crawlable static or pre-rendered routes for the business's main services, location, proof, and contact information.

This approach is selected because it:

- preserves the current branding, components, catalogue, and WhatsApp conversion path;
- avoids the cost and regression risk of an immediate framework migration;
- produces complete HTML and metadata for search engines at build time;
- supports unique URLs, internal linking, structured data, and future content expansion.

A metadata-only homepage patch was rejected because it would not create enough locally relevant crawlable content. A full framework rebuild was deferred because it is unnecessary for the first SEO release.

## 5. Information Architecture

The initial indexable route set will be:

| Route | Primary purpose |
|---|---|
| `/` | Brand, solar installer positioning, main services, proof, and conversion |
| `/solar-installation-ondo-city` | High-intent Ondo City solar installation landing page |
| `/solar-installation-ondo-state` | Wider Ondo State service coverage without doorway-page duplication |
| `/inverter-lithium-battery-installation` | Inverter, battery, backup-power expertise |
| `/cctv-installation-ondo` | Local CCTV installation service |
| `/smart-home-automation` | Smart-home and automation service |
| `/solar-packages` | Crawlable overview of available solar packages |
| `/projects` | Completed work, locations, outcomes, and original evidence |
| `/about` | Business identity, expertise, operating area, and trust signals |
| `/contact` | Canonical NAP, hours, directions, enquiry and WhatsApp actions |

Package detail pages may be added when the catalogue data can support genuinely useful, unique pages. Thin pages generated only to target keyword variations will not be published.

## 6. Page and Content Requirements

Every indexable page will include:

- a unique, natural title and meta description;
- one clear H1 aligned with the page's real purpose;
- complete server-delivered or pre-rendered HTML;
- a self-referencing canonical URL;
- descriptive internal links and breadcrumbs where appropriate;
- service details, customer problems solved, process, operating area, evidence, FAQs, and a relevant call to action;
- natural Nigerian English without keyword stuffing or unverifiable claims;
- consistent business identity and contact information;
- useful image alternative text based on visible content;
- Open Graph and social-sharing metadata.

The homepage will lead with a clear local proposition such as “Solar Installation Company in Ondo City,” while retaining the premium visual identity and sales-oriented layout.

## 7. Structured Data

JSON-LD will be implemented and validated using the most specific truthful types available:

- `Organization` and `LocalBusiness`/`Electrician`-appropriate business identity;
- `PostalAddress`, telephone, opening hours, area served, map/profile URL, and canonical website;
- `Service` entities on service pages;
- `BreadcrumbList` on nested content;
- `Product` and `Offer` only where current, visible product information and pricing support them;
- `FAQPage` only for FAQs visibly rendered on the corresponding page.

The site will not add self-authored aggregate ratings or unsupported review markup.

## 8. Technical SEO

The implementation will provide:

- a sitemap containing every canonical indexable route and no nonexistent URLs;
- a robots file that permits intended crawling and references the canonical sitemap;
- correct HTTP status behavior, including a real 404 response/page where hosting permits;
- no accidental `noindex`, duplicate canonicals, redirect chains, or mixed-domain URLs;
- semantic navigation and crawlable anchor links;
- mobile-friendly rendering and reasonable Core Web Vitals;
- optimized images with explicit dimensions and lazy loading below the fold;
- removal or correction of the unresolved analytics endpoint currently present in the HTML;
- a single production analytics approach, configured only with valid settings and consent requirements.

## 9. Cloudflare Configuration

Cloudflare remains the production host and DNS provider.

Planned configuration:

- preserve `gtechconsult.ng` as the canonical apex;
- enforce HTTPS;
- redirect `www` to the apex with a permanent redirect;
- redirect the Pages hostname to the apex if the project and platform rules allow it;
- avoid caching HTML in a way that serves obsolete metadata;
- verify deployment, redirects, headers, sitemap, robots, canonicals, and status codes after release.

No production deployment or DNS change is included until the implementation has passed review and verification.

## 10. Google Business Profile Workstream

The website work must be paired with owner-side Google Business Profile updates:

1. Change the public business name to **G-Tech Consult**, provided this matches real-world branding and signage.
2. Replace the old website with `https://gtechconsult.ng`.
3. Use the approved address and postcode consistently.
4. Set Monday–Saturday hours to 9:00 AM–6:00 PM.
5. Retain the truthful primary category and add only relevant secondary categories.
6. Add distinct services with accurate descriptions and matching website URLs.
7. Add current products/packages where supported.
8. Upload original storefront, team, installation, equipment, vehicle, and completed-project photos regularly.
9. Answer profile questions and keep holiday/special hours current.
10. Request genuine customer reviews steadily and respond individually without incentives or fabricated wording.

Because no authenticated Google Business Profile connector is available in this project, these changes will be supplied as an exact owner checklist rather than silently assumed complete.

## 11. Local Authority and Reputation

After launch:

- correct the domain and NAP on all controlled social and directory listings;
- pursue legitimate citations from relevant Nigerian, Ondo, trade, supplier, and community sources;
- publish original project case studies with customer permission;
- earn links through partnerships, suppliers, associations, community projects, and useful local resources;
- avoid paid link schemes, review gating, fake reviews, mass directory spam, and duplicate location pages.

## 12. Measurement

Baseline and ongoing measurement will separate Maps performance from organic website performance.

Track:

- Google Business Profile calls, website clicks, direction requests, messages, and discovery searches;
- Google Search Console indexing, impressions, clicks, queries, pages, and rich-result issues;
- rankings using a fixed local grid around Ondo City rather than one personalized search;
- conversions from calls, WhatsApp, enquiries, and quotation requests;
- indexed-page count, referring domains, review count, rating, and review velocity;
- Core Web Vitals and crawl errors.

Recommended review cadence: record the baseline before changes, verify indexing weekly during rollout, and compare meaningful performance over 30-, 60-, and 90-day periods.

## 13. Verification and Acceptance Criteria

Before release:

- production build and automated tests pass;
- each intended route renders directly and contains unique indexable HTML;
- titles, descriptions, H1s, canonicals, schema, internal links, sitemap, and robots are checked;
- structured data passes Google's applicable validation;
- mobile and desktop pages are visually inspected;
- primary calls, WhatsApp links, navigation, forms, address, map, and hours work;
- redirect and status-code tests pass;
- no `.net` references remain in the repository's public output;
- Lighthouse or equivalent checks establish a documented performance/accessibility baseline.

After release:

- submit the canonical sitemap in Google Search Console;
- request indexing for priority pages;
- update the Google Business Profile website and business details;
- monitor coverage, enhancements, performance, and local-grid movement.

## 14. Rollout and Risk Control

Work will be completed on the isolated SEO branch and reviewed before merging.

Main risks and controls:

| Risk | Control |
|---|---|
| Brand-name change conflicts with real-world evidence | Match signage, documents, and customer-facing branding before GBP edit |
| Old `.net` continues ranking | Replace controllable links and profiles; build authority directly to `.ng` |
| Thin or repetitive local pages | Publish only distinct pages with substantive service or geographic value |
| React content is difficult to crawl | Pre-render every priority route and verify delivered HTML |
| Ranking expectations exceed controllable factors | Report grid-based trends and conversions; never guarantee position |
| Release harms the live sales flow | Preserve existing components, test CTAs, and deploy only after review |

## 15. Implementation Boundary

This document authorizes implementation planning, not an immediate production deployment. The next step is a file-by-file implementation plan with tests, verification commands, review checkpoints, and a controlled Cloudflare release sequence.
