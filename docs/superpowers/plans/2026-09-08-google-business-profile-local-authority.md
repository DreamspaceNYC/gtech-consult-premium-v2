# Google Business Profile and Local Authority Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align G-Tech Consult's Google Business Profile and external local signals with gtechconsult.ng, then measure Maps visibility from a stable Ondo City baseline.

**Architecture:** Use one canonical real-world identity across Google and controlled citations. Complete profile improvements manually through the verified owner's Google account, record before/after evidence, and run a steady proof/review/citation program measured with fixed local-grid searches rather than personalized spot checks.

**Tech Stack:** Google Business Profile, Google Search Console, Google Maps, gtechconsult.ng, spreadsheet-based local-grid and conversion tracking

**Spec:** `docs/superpowers/specs/2026-09-08-local-seo-design.md`

## Global Constraints

- Public business name: **G-Tech Consult**, only if storefront signage and customer-facing documents display that name.
- Website: `https://gtechconsult.ng`.
- Address: **KM 140 Ondo–Ore Road, Adesuper Junction, Ondo City, Ondo State 100967, Nigeria**.
- Hours: **Monday–Saturday, 9:00 AM–6:00 PM**.
- Location type: staffed, customer-facing business.
- Primary category: **Solar energy company**.
- Primary phone: `0816 749 8489`, subject to owner confirmation before changing public listings.
- Never create a second listing for the same business/location.
- Never buy reviews, gate unhappy customers, ask staff/family to pose as customers, mass-post templated reviews, or offer rewards for reviews.
- Never add categories, services, service areas, opening hours, credentials, or projects that are not true.
- This plan cannot guarantee a top-three position because distance, competition, prominence, and Google's systems remain outside direct control.

---

### Task 1: Capture the profile and search baseline

**Files:**
- Create during execution: `docs/local-seo/google-business-profile-record.md`
- Create during execution: `docs/local-seo/local-ranking-baseline.csv`

**Interfaces:**
- Produces: dated evidence for profile fields, public presentation, competitor comparison, and local-grid rank.
- Consumes: no earlier task interfaces.

- [ ] **Step 1: Capture owner-dashboard fields**

From the verified profile dashboard, record the profile identifier, verification state, business name, categories, address, map pin, phone, website, regular hours, special hours, description, services, products, attributes, service areas, social links, opening date if present, and pending/suspended edit status. Take screenshots before editing.

- [ ] **Step 2: Capture the public listing**

In a signed-out browser, record the public name, primary category, rating, review count, address, phone, website, hours, map pin, photos, products, services, questions, and visible action buttons.

- [ ] **Step 3: Establish a fixed search grid**

Use a 5×5 grid centered on the storefront with points approximately 2 km apart. At every point, record the top 20 for these exact queries:

```text
solar installers in Ondo
solar installation company in Ondo City
solar energy company in Ondo
inverter installation in Ondo
```

CSV columns:

```text
date,query,grid_point,latitude,longitude,gtech_rank,top_1,top_2,top_3,notes
```

Use the same grid, language, device class, and query wording in future runs.

- [ ] **Step 4: Record conversion baselines**

Record the previous 28 days of profile website clicks, calls, direction requests, messages, discovery searches, and branded searches. If a metric is unavailable, write `unavailable`; do not enter zero.

- [ ] **Step 5: Commit the sanitized baseline**

Exclude private account identifiers and personal customer data. Commit:

```bash
git add docs/local-seo/google-business-profile-record.md docs/local-seo/local-ranking-baseline.csv
git commit -m "docs: record local search baseline"
```

### Task 2: Align the core Google Business Profile identity

**Files:**
- Append evidence to: `docs/local-seo/google-business-profile-record.md`

**Interfaces:**
- Consumes: the live, verified `gtechconsult.ng` release and baseline evidence.
- Produces: a single aligned NAP/website/category profile.

- [ ] **Step 1: Pass the real-world name gate**

Confirm storefront signage, invoices/quotations, social profiles, and the website visibly use **G-Tech Consult**. If physical signage still says `GTech Solar Consultants and Engineers`, update the real-world branding first and photograph the corrected permanent signage before requesting the Google name edit.

- [ ] **Step 2: Update the website field**

Replace `gtechconsult.net` with `https://gtechconsult.ng`. Open the saved public listing and confirm the website button reaches the apex without a redirect error.

- [ ] **Step 3: Align address and map pin**

Set the approved address exactly. Inspect the map pin against the storefront entrance and road access; move it only if it is physically inaccurate. Do not insert keywords, services, landmarks, or promotional text into address lines.

- [ ] **Step 4: Align regular and special hours**

Set Monday–Saturday 9:00 AM–6:00 PM and Sunday closed. Enter special hours for Nigerian public holidays whenever the business will differ from its regular schedule.

- [ ] **Step 5: Confirm phone and category**

Verify that `0816 749 8489` reaches G-Tech Consult during business hours, then retain it as the primary phone. Keep **Solar energy company** as the primary category. Add a secondary category only when the business currently performs that category's work and the category is offered by Google's editor.

- [ ] **Step 6: Submit the name edit**

Change the profile name to **G-Tech Consult** only after Step 1 passes. Save screenshots of the submitted edit, approval/pending state, and final public result. Do not repeatedly resubmit while an edit is pending.

- [ ] **Step 7: Record completed field changes**

For every edited field, record the previous value, new value, submission date, approval date/status, and screenshot filename.

### Task 3: Complete services, products, description, and attributes

**Files:**
- Append evidence to: `docs/local-seo/google-business-profile-record.md`

**Interfaces:**
- Consumes: the website's matching canonical service URLs and current package catalogue.
- Produces: complete profile content whose claims match visible website content.

- [ ] **Step 1: Publish a factual business description**

Use this owner-reviewable description, shortening only if Google's editor enforces a smaller limit:

```text
G-Tech Consult provides solar power system design and installation, inverter and lithium battery solutions, CCTV installation, smart home automation and technical site assessments for homes and businesses. From our customer-facing location at Adesuper Junction in Ondo City, we assess power or security needs, recommend suitable equipment, install and commission systems, and provide after-installation support across Ondo City and scheduled locations in Ondo State.
```

Do not add phone numbers, URLs, prices, promotion language, or ranking claims to the description.

- [ ] **Step 2: Add matching services**

Create these service entries and connect them to the matching website content where Google's interface permits:

| Service | Matching path |
|---|---|
| Solar installation in Ondo City | `/solar-installation-ondo-city` |
| Solar installation across Ondo State | `/solar-installation-ondo-state` |
| Inverter installation | `/inverter-lithium-battery-installation` |
| Lithium battery installation | `/inverter-lithium-battery-installation` |
| CCTV installation | `/cctv-installation-ondo` |
| Smart home automation | `/smart-home-automation` |
| Technical site assessment | `/contact` |

Descriptions must state what the service includes and that final scope/pricing follows assessment; they must not repeat the business name or location unnaturally.

- [ ] **Step 3: Add current solar packages**

Use the exact seven package names, current visible prices, images, and specifications from `/solar-packages`. Link products to the package overview or a unique package URL only when that destination displays the same product. Remove a product promptly when its public price/specification is no longer current.

- [ ] **Step 4: Set truthful attributes**

Retain only attributes visible in the owner dashboard that are true for the storefront and service delivery, including onsite service when accurate. Do not select accessibility, identity, payment, appointment, or amenity attributes without owner confirmation.

- [ ] **Step 5: Verify public rendering**

Check desktop and mobile public views for truncation, duplicates, rejected edits, outdated links, and services/products placed under the wrong category. Record the final public state.

### Task 4: Build original visual proof

**Files:**
- Create during execution: `docs/local-seo/photo-publishing-log.csv`

**Interfaces:**
- Produces: a steady record of original business and project photos.
- Consumes: customer consent and factual project details.

- [ ] **Step 1: Prepare the first verified photo set**

Capture original, well-lit images in these groups:

```text
storefront and permanent sign
entrance and customer area
team at work
solar panels and mounting
inverter and lithium battery installation
protection, cabling and finishing
CCTV camera and recorder installation
smart-home control work
completed system overview
service vehicle or branded workwear, when actually available
```

Remove customer documents, house numbers, faces without consent, serial numbers that create security risk, and unrelated watermarks.

- [ ] **Step 2: Publish a balanced initial set**

Upload at least one truthful image from each available group. Select a clear storefront/brand image for the cover and a clean logo file for the logo. Do not upload stock or AI-generated project evidence.

- [ ] **Step 3: Establish steady publishing**

Add two to four new original photos each month, favoring recent completed work and storefront/team evidence. CSV columns:

```text
date,category,project_area,consent_confirmed,website_path,profile_status,notes
```

- [ ] **Step 4: Connect proof to the website**

For every project with customer permission, publish a useful project entry with approximate area, problem, installed system, work performed, and photographs. Do not publish a customer's full address, name, energy usage, security-camera coverage, or access details without explicit consent.

### Task 5: Establish a compliant review process

**Files:**
- Create during execution: `docs/local-seo/review-process.md`
- Create during execution: `docs/local-seo/review-log.csv`

**Interfaces:**
- Produces: `REVIEW_URL`, repeatable post-completion review requests, and response tracking.
- Consumes: completed customer jobs and Google's direct review link from the verified dashboard.

- [ ] **Step 1: Save the official review link**

Copy the `Ask for reviews` link from the verified profile dashboard. Test it in a signed-out mobile browser and record the destination in the private operating copy; do not commit customer information.

- [ ] **Step 2: Use one neutral request**

Set `REVIEW_URL` to the tested dashboard link from Step 1. Send this exact sentence followed by one space and `REVIEW_URL`, only after genuine work is completed:

```text
Thank you for choosing G-Tech Consult. If you have a moment, please share an honest Google review about the service you received. Your feedback helps other customers understand our work:
```

Do not ask only satisfied customers, prescribe keywords, or offer discounts/rewards.

- [ ] **Step 3: Request reviews steadily**

Send the request individually after handover or a resolved support visit. Avoid a large one-day campaign. Log only job reference, request date, response status, public reply status, and internal notes; do not copy private customer messages into the repository.

- [ ] **Step 4: Respond to every legitimate review**

Positive response pattern:

```text
Thank you for your feedback and for choosing G-Tech Consult. We appreciate the opportunity to work on your system and are glad the service met your expectations.
```

Critical response pattern:

```text
Thank you for sharing this. We are sorry the experience did not meet expectations. Please contact us directly with the job details so we can review what happened and work toward a resolution.
```

Personalize responses with the real service when known, but do not disclose customer details, argue, threaten, or insert repetitive search phrases.

### Task 6: Correct controlled citations and build local authority

**Files:**
- Create during execution: `docs/local-seo/citation-tracker.csv`

**Interfaces:**
- Produces: deduplicated list of controlled profiles and legitimate authority opportunities.
- Consumes: canonical NAP and live `.ng` pages.

- [ ] **Step 1: Inventory existing mentions**

Search the exact old name, new name, old domain, primary phone, and address variants. CSV columns:

```text
source,url,status,current_name,current_address,current_phone,current_website,action,date_checked
```

Use statuses `correct`, `needs_update`, `duplicate`, `not_controlled`, or `removed`.

- [ ] **Step 2: Correct controlled profiles first**

Update Instagram, Facebook, supplier/dealer profiles, trade associations, local directories, and other accounts the owner controls to the exact name, address, phone, hours, and `.ng` URL. Do not create multiple entries on the same directory.

- [ ] **Step 3: Handle the uncontrolled old domain truthfully**

Where a third-party listing still links to `.net`, request replacement with the matching `.ng` page. If the publisher does not respond, mark `not_controlled`; do not attempt to impersonate the domain owner or submit false legal claims.

- [ ] **Step 4: Pursue relevant authority**

Prioritize genuine supplier/dealer pages, Ondo business/community organizations, solar or electrical associations, completed community projects, local media coverage, and partner case studies. Reject paid link packages, private blog networks, bulk directory submissions, spun guest posts, and location-page exchanges.

### Task 7: Measure 30-, 60-, and 90-day movement

**Files:**
- Append monthly rows to: `docs/local-seo/local-ranking-baseline.csv`
- Append findings to: `docs/local-seo/google-business-profile-record.md`

**Interfaces:**
- Consumes: the fixed grid, Google profile performance, Search Console, and conversion records.
- Produces: comparable local visibility and lead-quality trend reports.

- [ ] **Step 1: Verify indexing weekly during the first month**

In Search Console, inspect the sitemap, homepage, five service pages, packages, projects, about, and contact. Record `indexed`, `discovered`, `crawled-not-indexed`, `duplicate`, or the exact reported reason.

- [ ] **Step 2: Repeat the identical grid monthly**

At days 30, 60, and 90, reuse the original grid/query/device/language configuration. Record rank beyond 20 as `>20`, not zero.

- [ ] **Step 3: Compare business outcomes**

For each period, compare profile calls, directions, website clicks, messages, Search Console clicks/impressions, WhatsApp enquiries, quotation requests, and won jobs. Annotate profile edits, new reviews, new project pages, citations, holidays, and outages that could influence results.

- [ ] **Step 4: Choose changes from evidence**

If impressions rise but clicks remain weak, test titles/descriptions and profile photos. If clicks rise but enquiries do not, test page clarity and CTAs. If rankings are strong near the shop but weak farther away, build genuine prominence and proof across the served area rather than creating duplicate offices or thin doorway pages. If indexing fails, diagnose technical or content causes before publishing more pages.

- [ ] **Step 5: Report without rank guarantees**

Summarize grid coverage in top 3, top 10, top 20, and beyond 20; show lead/conversion changes separately. State that searcher distance and personalization can produce different individual results.
