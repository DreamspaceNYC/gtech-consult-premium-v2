import express from "express";
import { readFile } from "node:fs/promises";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const routes: string[] = JSON.parse(
    await readFile(path.resolve(staticPath, "..", "seo-routes.json"), "utf8")
  );
  app.use(express.static(staticPath, { index: false, redirect: false }));
  app.get("*", (req, res) => {
    const route = req.path.replace(/\/+$/, "") || "/";
    if (routes.includes(route)) {
      res.sendFile(path.join(staticPath, route.slice(1), "index.html"));
    } else {
      res.status(404).sendFile(path.join(staticPath, "404.html"));
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
