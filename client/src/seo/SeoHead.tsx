import { useEffect } from "react";
import { renderSeoHead } from "./head";

export function SeoHead({ path }: { path: string }) {
  useEffect(() => {
    document.head
      .querySelectorAll("[data-seo-managed='true']")
      .forEach(element => element.remove());
    document.head.insertAdjacentHTML("beforeend", renderSeoHead(path));
  }, [path]);

  return null;
}
