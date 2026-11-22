#!/usr/bin/env node
// Minimal zero-dependency static server for the Chronos atlas.
// Usage: node scripts/serve.mjs [port]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    let stat;
    try {
      stat = fs.statSync(file);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
      return;
    }
    if (stat.isDirectory()) {
      res.writeHead(302, { location: p + "/" }).end();
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "content-type": MIME[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" }).end("Server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Chronos serving ${ROOT}`);
  console.log(`  http://localhost:${PORT}`);
});
