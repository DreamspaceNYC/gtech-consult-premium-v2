import { getRouteSeo } from "@/seo/routes";

export function Breadcrumbs({ path }: { path: string }) {
  const route = getRouteSeo(path);
  if (route.path === "/") return null;

  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>
        <li aria-current="page">{route.h1}</li>
      </ol>
    </nav>
  );
}
