# Cloudflare SEO Release Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release the verified SEO build on Cloudflare Pages with one canonical HTTPS hostname and tested redirects, without interrupting the live sales site.

**Architecture:** Treat GitHub as the source of application code and Cloudflare Pages as the deployment target. Verify a branch preview first, merge only after owner approval, then enforce the apex hostname at the zone layer and validate the live response matrix.

**Tech Stack:** GitHub, Cloudflare Pages, Cloudflare DNS, Cloudflare Redirect Rules, HTTP/cURL verification

**Spec:** `docs/superpowers/specs/2026-09-08-local-seo-design.md`

## Global Constraints

- Canonical origin: `https://gtechconsult.ng`.
- Canonical hostname: `gtechconsult.ng`.
- `www.gtechconsult.ng` must permanently redirect to the same path and query on the apex.
- The Pages development hostname must not compete in search; redirect it when the available Pages/account controls support hostname-based redirection, otherwise rely on canonical tags and keep it out of all links and sitemaps.
- Do not alter nameservers, MX records, email records, Google verification records, or unrelated DNS.
- Do not merge or deploy until the website plan's full verification suite and owner preview approval pass.
- Keep the previous successful production deployment available for rollback.
- The former `gtechconsult.net` is outside the owner's control and receives no DNS or redirect change.

---

### Task 1: Capture the production baseline

**Files:**
- Create during execution: `docs/local-seo/cloudflare-release-record.md`

**Interfaces:**
- Produces: immutable record of project ID, production deployment ID/commit, domains, build command, output directory, DNS targets, and HTTP responses.
- Consumes: no earlier task interface.

- [ ] **Step 1: Record the Pages configuration**

Using the connected Cloudflare account, record project `gtech-consult-premium-v2`, project ID `75e42357-9786-48fd-90ec-258dcc40e0fc`, production branch `main`, build command `pnpm run build`, and output directory `dist/public`. Re-read these values rather than assuming the previously observed state is unchanged.

- [ ] **Step 2: Record the rollback target**

Capture the latest successful production deployment ID, URL, creation time, Git commit SHA, and status. The earlier observed commit was `f6667ed7740394bcb89cedd2e47bd4b5e555da0a`; execution must record the then-current successful production commit.

- [ ] **Step 3: Record DNS without changing it**

For zone `b4d5cfbd65229468b6ebe7c0657c15b6`, record only the apex and `www` DNS records, proxy status, TTL, and targets. Confirm that both custom domains are active on the Pages project.

- [ ] **Step 4: Capture the response baseline**

Run:

```bash
curl -sSIL https://gtechconsult.ng/
curl -sSIL https://www.gtechconsult.ng/
curl -sSIL https://gtech-consult-premium-v2.pages.dev/
curl -sSIL https://gtechconsult.ng/contact
curl -sSIL https://gtechconsult.ng/not-a-real-page
```

Record every status and `Location` header in `cloudflare-release-record.md`.

- [ ] **Step 5: Commit the baseline record**

```bash
git add docs/local-seo/cloudflare-release-record.md
git commit -m "docs: record Cloudflare SEO release baseline"
```

### Task 2: Verify the branch preview

**Files:**
- Modify only files required to fix failures in the website implementation plan.
- Reference: `docs/local-seo/cloudflare-release-record.md`

**Interfaces:**
- Consumes: the completed `seo/local-search-foundation` branch and its test/build evidence.
- Produces: an owner-reviewable Cloudflare preview deployment.

- [ ] **Step 1: Confirm branch CI state**

Confirm the branch tip contains all website-plan commits and that `pnpm install --frozen-lockfile && pnpm test && pnpm check && pnpm run build` passed at that exact commit.

- [ ] **Step 2: Inspect the Pages branch deployment**

Locate the Cloudflare Pages preview whose Git branch is `seo/local-search-foundation` and whose commit SHA equals the verified branch tip. Stop if no matching successful preview exists.

- [ ] **Step 3: Test every preview route**

Request all ten indexable paths, `/robots.txt`, `/sitemap.xml`, `/404.html`, and `/not-a-real-page`. Confirm 200 for intended routes/assets, route-specific canonical links pointing to `gtechconsult.ng`, and 404 for the missing path.

- [ ] **Step 4: Complete browser review**

At 390px and 1440px, verify the homepage, one solar service, one non-solar service, packages, projects, about, contact, and 404. Check hydration/console errors, navigation, package controls, phone, WhatsApp, map, readable text, and horizontal overflow.

- [ ] **Step 5: Present the preview gate**

Give the owner the preview URL, verified commit, screenshots, automated-test results, and limitations. Wait for explicit production approval.

### Task 3: Merge and verify the production deployment

**Files:**
- No new source file unless a preview defect requires a reviewed code fix.

**Interfaces:**
- Consumes: owner-approved preview and rollback target from Task 1.
- Produces: a successful production Pages deployment matching the approved commit.

- [ ] **Step 1: Merge through a reviewed pull request**

Create a pull request from `seo/local-search-foundation` to `main` with the design, three implementation plans, test output, preview URL, screenshot evidence, and manual Google tasks. Merge only after the owner approves production.

- [ ] **Step 2: Match the production deployment to Git**

Wait for Cloudflare Pages to finish. Confirm the production deployment status is successful and its Git commit SHA equals the merge result on `main`.

- [ ] **Step 3: Run the production route audit**

Run the same route matrix used for preview against `https://gtechconsult.ng`. Fetch page bodies and confirm unique titles, descriptions, canonical URLs, H1s, JSON-LD, NAP, service links, sitemap membership, and the absence of the old domain.

- [ ] **Step 4: Roll back on release regression**

If production has broken rendering, missing assets, failed CTAs, incorrect canonical URLs, 5xx responses, or intended routes returning 404, promote the recorded previous successful deployment. Do not compensate with broad DNS edits.

### Task 4: Enforce the apex hostname

**Files:**
- Append evidence to: `docs/local-seo/cloudflare-release-record.md`

**Interfaces:**
- Consumes: verified production deployment.
- Produces: permanent same-path `www` redirect and documented Pages-hostname treatment.

- [ ] **Step 1: Re-read existing redirect rules**

List zone-level redirect rules before writing. If an equivalent enabled rule already exists, reuse it and record its identifier; do not create a duplicate.

- [ ] **Step 2: Create the exact www redirect**

Create a permanent redirect matching:

```text
http.host eq "www.gtechconsult.ng"
```

Target `https://gtechconsult.ng` plus the unchanged request path, preserve the query string, and use status 301. Scope the change to `www.gtechconsult.ng` only.

- [ ] **Step 3: Treat the Pages hostname safely**

First check whether the Pages project/account exposes a supported hostname redirect or access setting that preserves preview deployments. If it supports a production-host redirect, configure `gtech-consult-premium-v2.pages.dev/<path>` to `https://gtechconsult.ng/<path>` with status 301 and preserved query.

If that control is unavailable, make no unrelated Worker or DNS change. Confirm instead that every Pages-host response has an apex canonical, the Pages host is absent from the sitemap/internal links, and Google Search Console uses only the `.ng` property.

- [ ] **Step 4: Verify the redirect matrix**

Run:

```bash
curl -sSIL "https://www.gtechconsult.ng/contact?source=redirect-test"
curl -sSIL "https://gtechconsult.ng/contact?source=redirect-test"
curl -sSIL "https://gtech-consult-premium-v2.pages.dev/contact?source=redirect-test"
```

Expected for `www`: one permanent redirect to `https://gtechconsult.ng/contact?source=redirect-test`, followed by 200. Expected for apex: 200 without a hostname redirect. Record the actual Pages-host behavior and its canonical fallback if it cannot redirect.

- [ ] **Step 5: Commit the completed release record**

```bash
git add docs/local-seo/cloudflare-release-record.md
git commit -m "docs: record canonical domain release checks"
```

### Task 5: Post-release indexing checks

**Files:**
- Append evidence to: `docs/local-seo/cloudflare-release-record.md`

**Interfaces:**
- Consumes: stable apex production release.
- Produces: 24-hour and seven-day technical follow-up record.

- [ ] **Step 1: Check immediately after release**

Verify HTTPS, 200/404 status behavior, robots, sitemap, canonical tags, JSON-LD, asset loading, and call/WhatsApp/map links from an uncached request.

- [ ] **Step 2: Check after 24 hours**

Confirm the production deployment remains current, no new failed deployment replaced it, and all canonical routes remain available.

- [ ] **Step 3: Check after seven days**

Record Google Search Console discovery/indexing state supplied by the owner, crawl errors, sitemap status, and any duplicate-canonical messages. Code fixes return to the feature branch and repeat preview verification before release.
