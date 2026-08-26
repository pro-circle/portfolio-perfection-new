// Prerenders route(s) and ensures dist/client exists for Firebase Hosting.
// TanStack/Nitro can emit either dist/* or .output/* depending on config/version,
// so this script detects the actual build folder instead of hardcoding one.
import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROUTES = ["/", "/hobbies"];
const FIREBASE_DIR = new URL("../dist/client/", import.meta.url);

const OUTPUT_CANDIDATES = [
  {
    clientDir: new URL("../dist/client/", import.meta.url),
    ssrEntry: new URL("../dist/server/_ssr/ssr.mjs", import.meta.url),
  },
  {
    clientDir: new URL("../.output/public/", import.meta.url),
    ssrEntry: new URL("../.output/server/_ssr/ssr.mjs", import.meta.url),
  },
];

async function exists(url) {
  try {
    await access(fileURLToPath(url));
    return true;
  } catch {
    return false;
  }
}

const output = await (async () => {
  for (const candidate of OUTPUT_CANDIDATES) {
    if ((await exists(candidate.clientDir)) && (await exists(candidate.ssrEntry))) {
      return candidate;
    }
  }

  throw new Error("Build output not found. Expected dist/client + dist/server or .output/public + .output/server.");
})();

const mod = await import(output.ssrEntry.href);
const handler = mod.default;
if (!handler?.fetch) {
  throw new Error("SSR handler missing .fetch — did the build run?");
}

for (const route of ROUTES) {
  const req = new Request(`http://localhost${route}`, { method: "GET" });
  const res = await handler.fetch(req);
  if (!res.ok) {
    console.error(`Prerender ${route} failed: ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const outPath =
    route === "/"
      ? new URL("index.html", output.clientDir)
      : new URL(`.${route}/index.html`, output.clientDir);
  const outPathname = fileURLToPath(outPath);
  await mkdir(dirname(outPathname), { recursive: true });
  await writeFile(outPath, html, "utf8");
  console.log(`✓ prerendered ${route} → ${outPathname}`);
}

if (fileURLToPath(output.clientDir) !== fileURLToPath(FIREBASE_DIR)) {
  await rm(FIREBASE_DIR, { recursive: true, force: true });
  await cp(output.clientDir, FIREBASE_DIR, { recursive: true });
  console.log(`✓ copied Firebase Hosting output → ${fileURLToPath(FIREBASE_DIR)}`);
}
