# Deployment guide

This app is a **TanStack Start** project (SSR via Nitro, default target
Cloudflare Workers). Firebase Hosting on its own only serves static
files, so for full SSR you need **Firebase App Hosting** (or Cloud
Functions). A static-only fallback is also documented below.

## 1. Local development

```bash
bun install
cp .env.example .env       # then fill in real keys
bun run dev                # http://localhost:8080
```

Required env vars (all `VITE_*` are exposed to the browser at build time):

| Var | Where to get it |
|---|---|
| `VITE_EMAILJS_SERVICE_ID`   | https://dashboard.emailjs.com |
| `VITE_EMAILJS_TEMPLATE_ID`  | same |
| `VITE_EMAILJS_PUBLIC_KEY`   | same |
| `VITE_SUPABASE_URL`         | Supabase → Project Settings → API |
| `VITE_SUPABASE_KEY`         | Supabase anon / publishable key ONLY |

> Never put the Supabase **service-role** key in a `VITE_*` variable —
> anything with a `VITE_` prefix ships to the browser.

Run `supabase/schema.sql` once in the Supabase SQL editor to create the
`visitors` / analytics / contact / guestbook / likes tables (RLS + GRANTs
are already tuned for browser-only anon access).

## 2. Keeping keys secret

- `.env` (and `.env.local`, `.env.production`) are git-ignored — see
  `.gitignore`. Only `.env.example` is committed.
- Real values live in `.env` locally, and in your CI / hosting provider's
  secret store in production. They are inlined into the client bundle at
  `bun run build` time, so rebuild after rotating a key.
- `src/lib/supabase.ts` no-ops gracefully when the two Supabase vars are
  missing, so the app still boots without a DB connection.

## 3. Production build

```bash
bun run build
```

Output layout (Nitro):

```
dist/ or .output/
├── client/public  ← static assets (JS, CSS, images)
└── server         ← SSR worker bundle (Cloudflare / Nitro)

dist/client/       ← Firebase Hosting folder + prerendered index.html
```

## 4. Firebase deployment

### 4a. Firebase App Hosting (recommended — real SSR)

App Hosting runs the SSR server, so all routes render correctly and env
vars stay on the server.

1. Install the CLI and log in:
   ```bash
   npm i -g firebase-tools
   firebase login
   ```
2. Edit `.firebaserc` and replace `your-firebase-project-id` with your
   real Firebase project id.
3. In the Firebase console → **App Hosting → Create backend**, connect
   this repo. In the backend's **Environment** settings add every
   `VITE_*` value from the table above (App Hosting exposes them at
   build time; they never touch git).
4. Every push to the tracked branch triggers a build + rollout. No
   manual deploy step is required.

### 4b. Firebase Hosting on the free Spark plan (static `dist/client`)

Spark-plan Hosting serves static files only, so this path ships the client
bundle plus prerendered HTML. Everything in this portfolio is client-side,
so it works fully.

`firebase.json` is preconfigured to:
- run `npm run build:static` before deploy (build + prerender)
- serve from `dist/client`
- SPA fallback (`**` → `/index.html`) so deep links work
- long cache headers on JS/CSS/fonts/images, no-cache on `index.html`

`scripts/prerender.mjs` writes `dist/client/index.html` and
`dist/client/hobbies/index.html` after the build so crawlers get real HTML.

```bash
bun run build:static          # or: npm run build:static
firebase deploy --only hosting
```


### Environment variables on Firebase Hosting (static path)

Firebase Hosting serves *static files only* — there is no runtime env.
All `VITE_*` vars are baked into the JS bundle at `bun run build` time.

**CI / shell before build** (recommended, keeps keys out of the repo):
```bash
export VITE_EMAILJS_SERVICE_ID=...
export VITE_EMAILJS_TEMPLATE_ID=...
export VITE_EMAILJS_PUBLIC_KEY=...
export VITE_SUPABASE_URL=...
export VITE_SUPABASE_KEY=...
bun run build && firebase deploy --only hosting
```

Or a local `.env.production` (git-ignored) that Vite auto-loads during
`bun run build`.

## 5. Alternative: Cloudflare Workers

Because Nitro already targets Cloudflare by default, you can also run:

```bash
bun run build
npx wrangler deploy dist/server
```

and set `VITE_*` env vars via `wrangler secret put` — no Firebase needed.
