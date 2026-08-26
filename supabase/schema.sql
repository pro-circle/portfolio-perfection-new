-- =====================================================================
-- Portfolio — complete SQL schema
-- Run this once in the Supabase SQL editor.
-- Browser-only Supabase access uses the anon key, so RLS + GRANTs below
-- are tuned for public insert / owner-style update where appropriate.
-- =====================================================================

-- ---------------------------------------------------------------
-- 1. VISITORS  (per-device analytics, no auth required)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.visitors (
  id                  text PRIMARY KEY,
  session_id          text,
  user_agent          text,
  ip_hash             text,                -- optional, hash IP server-side only
  country             text,
  city                text,
  referrer            text,
  landing_path        text,
  device_type         text,                -- 'mobile' | 'tablet' | 'desktop'
  browser             text,
  os                  text,
  screen_size         text,                -- e.g. '1920x1080'
  language            text,
  first_visit         timestamptz DEFAULT now(),
  last_visit          timestamptz DEFAULT now(),
  visit_date          date        DEFAULT (now() AT TIME ZONE 'utc')::date,
  visit_time          time        DEFAULT (now() AT TIME ZONE 'utc')::time,
  time_spent_seconds  integer     DEFAULT 0,
  visit_count         integer     DEFAULT 1,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Forward-compat: add columns if migrating from older schema
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS ip_hash      text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS country      text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS city         text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS referrer     text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS landing_path text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS device_type  text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS browser      text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS os           text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS screen_size  text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS language     text;
ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS updated_at   timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS visitors_visit_date_idx ON public.visitors (visit_date DESC);
CREATE INDEX IF NOT EXISTS visitors_last_visit_idx ON public.visitors (last_visit DESC);

-- ---------------------------------------------------------------
-- 2. PAGE_VIEWS  (per-page stamp: section, time, scroll depth)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_views (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id      text REFERENCES public.visitors(id) ON DELETE CASCADE,
  session_id      text,
  path            text NOT NULL,           -- '/', '/projects/foo'
  section         text,                    -- 'hero', 'projects', 'contact'
  entered_at      timestamptz DEFAULT now(),
  left_at         timestamptz,
  dwell_seconds   integer DEFAULT 0,
  max_scroll_pct  integer DEFAULT 0,       -- 0..100
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS page_views_visitor_idx ON public.page_views (visitor_id);
CREATE INDEX IF NOT EXISTS page_views_path_idx    ON public.page_views (path);
CREATE INDEX IF NOT EXISTS page_views_entered_idx ON public.page_views (entered_at DESC);

-- ---------------------------------------------------------------
-- 3. EVENTS  (clicks, downloads, outbound links, project opens)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id   text REFERENCES public.visitors(id) ON DELETE CASCADE,
  session_id   text,
  event_type   text NOT NULL,              -- 'click' | 'download' | 'outbound' | 'project_open' | 'cv_download' | 'theme_toggle'
  target       text,                       -- selector or URL
  label        text,                       -- human label
  metadata     jsonb DEFAULT '{}'::jsonb,
  path         text,
  created_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_visitor_idx ON public.events (visitor_id);
CREATE INDEX IF NOT EXISTS events_type_idx    ON public.events (event_type);
CREATE INDEX IF NOT EXISTS events_created_idx ON public.events (created_at DESC);

-- ---------------------------------------------------------------
-- 4. CONTACT_MESSAGES  (fallback store if EmailJS fails or for archive)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  subject     text,
  category    text,                        -- 'comment' | 'work' | 'other'
  message     text NOT NULL,
  visitor_id  text REFERENCES public.visitors(id) ON DELETE SET NULL,
  user_agent  text,
  status      text DEFAULT 'new',          -- 'new' | 'read' | 'archived'
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON public.contact_messages (created_at DESC);

-- ---------------------------------------------------------------
-- 5. GUESTBOOK / TESTIMONIALS  (optional public wall)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guestbook (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author      text NOT NULL,
  message     text NOT NULL,
  approved    boolean DEFAULT false,
  visitor_id  text REFERENCES public.visitors(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS guestbook_approved_idx ON public.guestbook (approved, created_at DESC);

-- ---------------------------------------------------------------
-- 6. PROJECT_LIKES  (per-visitor, per-project upvotes)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text NOT NULL,
  visitor_id  text REFERENCES public.visitors(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (project_slug, visitor_id)
);
CREATE INDEX IF NOT EXISTS project_likes_slug_idx ON public.project_likes (project_slug);

-- =====================================================================
-- updated_at trigger for visitors
-- =====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS visitors_set_updated_at ON public.visitors;
CREATE TRIGGER visitors_set_updated_at
  BEFORE UPDATE ON public.visitors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
ALTER TABLE public.visitors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes     ENABLE ROW LEVEL SECURITY;

-- ---- visitors ----
DROP POLICY IF EXISTS "Anyone can read visitors"   ON public.visitors;
DROP POLICY IF EXISTS "Anyone can insert visitors" ON public.visitors;
DROP POLICY IF EXISTS "Anyone can update visitors" ON public.visitors;
CREATE POLICY "Anyone can read visitors"   ON public.visitors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert visitors" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update visitors" ON public.visitors FOR UPDATE USING (true) WITH CHECK (true);

-- ---- page_views ----
DROP POLICY IF EXISTS "Anyone can insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can update page_views" ON public.page_views;
CREATE POLICY "Anyone can insert page_views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update page_views" ON public.page_views FOR UPDATE USING (true) WITH CHECK (true);

-- ---- events ----
DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);

-- ---- contact_messages ----
DROP POLICY IF EXISTS "Anyone can insert contact_messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- ---- guestbook ----
DROP POLICY IF EXISTS "Anyone can insert guestbook"          ON public.guestbook;
DROP POLICY IF EXISTS "Anyone can read approved guestbook"   ON public.guestbook;
CREATE POLICY "Anyone can insert guestbook"        ON public.guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read approved guestbook" ON public.guestbook FOR SELECT USING (approved = true);

-- ---- project_likes ----
DROP POLICY IF EXISTS "Anyone can read project_likes"   ON public.project_likes;
DROP POLICY IF EXISTS "Anyone can insert project_likes" ON public.project_likes;
DROP POLICY IF EXISTS "Anyone can delete project_likes" ON public.project_likes;
CREATE POLICY "Anyone can read project_likes"   ON public.project_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert project_likes" ON public.project_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete project_likes" ON public.project_likes FOR DELETE USING (true);

-- =====================================================================
-- GRANTS (Supabase no longer grants the Data API by default)
-- =====================================================================
GRANT SELECT, INSERT, UPDATE          ON public.visitors         TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE          ON public.page_views       TO anon, authenticated;
GRANT SELECT, INSERT                  ON public.events           TO anon, authenticated;
GRANT INSERT                          ON public.contact_messages TO anon, authenticated;
GRANT SELECT                          ON public.contact_messages TO authenticated;
GRANT SELECT, INSERT                  ON public.guestbook        TO anon, authenticated;
GRANT SELECT, INSERT, DELETE          ON public.project_likes    TO anon, authenticated;

GRANT ALL ON public.visitors, public.page_views, public.events,
            public.contact_messages, public.guestbook, public.project_likes
            TO service_role;

-- =====================================================================
-- ANALYTICS VIEWS (read-only convenience)
-- =====================================================================
CREATE OR REPLACE VIEW public.v_daily_visitors AS
SELECT visit_date,
       COUNT(*)                              AS unique_visitors,
       SUM(visit_count)                      AS total_visits,
       SUM(time_spent_seconds)               AS total_seconds,
       ROUND(AVG(time_spent_seconds)::numeric, 1) AS avg_seconds
FROM public.visitors
GROUP BY visit_date
ORDER BY visit_date DESC;

CREATE OR REPLACE VIEW public.v_top_pages AS
SELECT path, COUNT(*) AS views, SUM(dwell_seconds) AS total_dwell
FROM public.page_views
GROUP BY path
ORDER BY views DESC;

GRANT SELECT ON public.v_daily_visitors, public.v_top_pages TO anon, authenticated;
