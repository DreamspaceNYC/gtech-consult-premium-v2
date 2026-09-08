import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const publicDir = path.join(projectRoot, "dist", "public");
const ssrEntry = path.join(projectRoot, "dist", "ssr", "entry-server.js");
const indexFile = path.join(publicDir, "index.html");
const headStart = "<!--seo-head-start-->";
const headEnd = "<!--seo-head-end-->";
const emptyRoot = '<div id="root"></div>';

const { getIndexablePaths, render } = await import(
  pathToFileURL(ssrEntry).href
);
const template = await readFile(indexFile, "utf8");

if (!template.includes(headStart) || !template.includes(headEnd)) {
  throw new Error("SEO head markers are missing from the Vite HTML template.");
}

if (!template.includes(emptyRoot)) {
  throw new Error(
    "The empty #root node is missing from the Vite HTML template."
  );
}

function buildHtml(routePath) {
  const { appHtml, headHtml } = render(routePath);
  const withHead = template.replace(
    new RegExp(`${headStart}[\\s\\S]*?${headEnd}`),
    `${headStart}\n    ${headHtml}\n    ${headEnd}`
  );
  return withHead.replace(emptyRoot, `<div id="root">${appHtml}</div>`);
}

async function writeRoute(routePath, html) {
  const target =
    routePath === "/"
      ? indexFile
      : path.join(publicDir, routePath.slice(1), "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

for (const routePath of getIndexablePaths()) {
  await writeRoute(routePath, buildHtml(routePath));
}

const notFoundHtml = buildHtml("/404");
await writeRoute("/404", notFoundHtml);
await writeFile(path.join(publicDir, "404.html"), notFoundHtml, "utf8");
await rm(path.join(projectRoot, "dist", "ssr"), {
  recursive: true,
  force: true,
});

console.log(
  `Pre-rendered ${getIndexablePaths().length} canonical routes and 404 HTML.`
);
