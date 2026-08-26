# Local development

1. `bun install`
2. `cp .env.example .env` (already done), then edit `.env` with your real keys:
   - **EmailJS**: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` — from https://dashboard.emailjs.com
   - **Supabase**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` (anon/publishable key only) — from Project Settings → API
3. `bun run dev` → http://localhost:8080

Notes:
- No Lovable Cloud. Supabase uses your own project via the browser anon key with RLS.
- If Supabase env vars are missing the client no-ops gracefully (visitor tracking just silently skips).
- EmailJS missing keys will surface as "Failed to send message" toast.
- Schema for the `visitors` table lives in `supabase/schema.sql` — run it once in the Supabase SQL editor.
