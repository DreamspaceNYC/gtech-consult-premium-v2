import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "dist/public");
const routes = JSON.parse(
  await readFile(path.join(root, "dist/seo-routes.json"), "utf8")
);
const read = p => readFile(path.join(publicDir, p), "utf8");
const titles = new Set(),
  descriptions = new Set();
function one(html, regex, label) {
  const matches = [...html.matchAll(regex)];
  assert.equal(matches.length, 1, label);
  return matches[0][1];
}
for (const route of routes) {
  const html = await read(path.join(route.slice(1), "index.html"));
  const title = one(html, /<title\b[^>]*>([^<]+)<\/title>/g, `${route}: title`);
  const description = one(
    html,
    /<meta\b[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/g,
    `${route}: description`
  );
  const canonical = one(
    html,
    /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g,
    `${route}: canonical`
  );
  one(html, /<h1(?:\s[^>]*)?>/g, `${route}: H1`);
  assert.equal(canonical, `https://gtechconsult.ng${route}`);
  assert(!titles.has(title), `${route}: duplicate title`);
  titles.add(title);
  assert(!descriptions.has(description), `${route}: duplicate description`);
  descriptions.add(description);
  assert(
    html.includes("G-Tech Consult") && html.includes("100967"),
    `${route}: business details`
  );
  assert(/<a\b[^>]*href="\/(?!\/)/.test(html), `${route}: internal links`);
  const schemas = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ].map(m => JSON.parse(m[1]));
  const types = schemas.map(s => s["@type"]);
  if (route === "/") assert(types.includes("LocalBusiness"));
  if (routes.indexOf(route) >= 1 && routes.indexOf(route) <= 5) {
    assert(types.includes("Service"));
    assert(types.includes("BreadcrumbList"));
  }
}
assert((await read("404.html")).includes('content="noindex, follow"'));
const sitemap = await read("sitemap.xml");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]),
  routes.map(r => `https://gtechconsult.ng${r}`)
);
assert.equal(
  (await read("robots.txt")).trim(),
  "User-agent: *\nAllow: /\n\nSitemap: https://gtechconsult.ng/sitemap.xml"
);
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) await scan(filename);
    else if (/\.(html|js|css|json|svg|txt|xml)$/.test(entry.name)) {
      const text = await readFile(filename, "utf8");
      assert(
        !/gtechconsult\.net|%VITE_ANALYTICS_ENDPOINT%|%VITE_ANALYTICS_WEBSITE_ID%/i.test(
          text
        ),
        `${filename}: stale domain or placeholder`
      );
    }
  }
}
await scan(publicDir);
console.log(
  `SEO audit passed: ${routes.length} routes, structured data, sitemap, robots and 404.`
);
