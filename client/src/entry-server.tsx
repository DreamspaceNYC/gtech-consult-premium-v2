import { renderToString } from "react-dom/server";
import App from "./App";
import { renderSeoHead } from "./seo/head";
import { INDEXABLE_PATHS } from "./seo/routes";

export function render(path: string): { appHtml: string; headHtml: string } {
  return {
    appHtml: renderToString(<App ssrPath={path} />),
    headHtml: renderSeoHead(path),
  };
}

export function getIndexablePaths(): readonly string[] {
  return INDEXABLE_PATHS;
}
