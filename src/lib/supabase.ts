import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

// No-op proxy for graceful degradation when Supabase isn't configured
const noopResult = { data: null, error: { message: "Supabase not configured" } };
const noopChain: any = new Proxy(
  {},
  { get: () => (..._args: any[]) => Promise.resolve(noopResult) }
);
const noopClient = new Proxy({} as SupabaseClient, {
  get: (_t, prop) => {
    if (prop === "from") return () => noopChain;
    return () => noopChain;
  },
});

// Browser-only Supabase client (uses public anon key — safe to ship to browser)
export const supabase: SupabaseClient =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : noopClient;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);


const VISITOR_KEY = "portfolio_visitor_uuid";
const SESSION_START_KEY = "portfolio_session_start";

/**
 * Initialise/refresh the visitor row, then start a heartbeat that flushes
 * accumulated `time_spent_seconds` while the tab is visible. Returns the
 * visitor UUID. Safe to call once per page load.
 */
export const getOrCreateVisitorId = async (): Promise<string> => {
  let visitorUuid = localStorage.getItem(VISITOR_KEY);
  const now = new Date();
  const nowIso = now.toISOString();
  const visitDate = nowIso.slice(0, 10);                 // YYYY-MM-DD (UTC)
  const visitTime = nowIso.slice(11, 19);                // HH:MM:SS  (UTC)
  const isNew = !visitorUuid;

  if (!visitorUuid) {
    visitorUuid = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, visitorUuid);
  }

  sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));

  try {
    if (isNew) {
      await supabase.from("visitors").insert({
        id: visitorUuid,
        session_id: visitorUuid,
        user_agent: navigator.userAgent,
        first_visit: nowIso,
        last_visit: nowIso,
        visit_date: visitDate,
        visit_time: visitTime,
        time_spent_seconds: 0,
        visit_count: 1,
      });
    } else {
      // Returning visitor — bump last_visit + visit_count, keep first_visit untouched.
      const { data: existing } = await supabase
        .from("visitors")
        .select("visit_count")
        .eq("id", visitorUuid)
        .maybeSingle();
      const nextCount = ((existing as any)?.visit_count ?? 1) + 1;

      await supabase
        .from("visitors")
        .update({
          last_visit: nowIso,
          visit_date: visitDate,
          visit_time: visitTime,
          user_agent: navigator.userAgent,
          visit_count: nextCount,
        })
        .eq("id", visitorUuid);
    }
  } catch (e) {
    console.warn("Visitor upsert failed:", e);
  }

  startTimeSpentTracking(visitorUuid);
  return visitorUuid;
};

let trackingStarted = false;
let accumulatedMs = 0;
let lastTickAt = Date.now();

function startTimeSpentTracking(visitorUuid: string) {
  if (trackingStarted) return;
  trackingStarted = true;

  const tick = () => {
    if (document.visibilityState === "visible") {
      accumulatedMs += Date.now() - lastTickAt;
    }
    lastTickAt = Date.now();
  };

  const flush = async () => {
    tick();
    const seconds = Math.floor(accumulatedMs / 1000);
    if (seconds <= 0) return;
    accumulatedMs -= seconds * 1000;
    try {
      const { data } = await supabase
        .from("visitors")
        .select("time_spent_seconds")
        .eq("id", visitorUuid)
        .maybeSingle();
      const current = (data as any)?.time_spent_seconds ?? 0;
      await supabase
        .from("visitors")
        .update({
          time_spent_seconds: current + seconds,
          last_visit: new Date().toISOString(),
        })
        .eq("id", visitorUuid);
    } catch (e) {
      // Restore so we try again on the next flush
      accumulatedMs += seconds * 1000;
      console.warn("Time-spent flush failed:", e);
    }
  };

  document.addEventListener("visibilitychange", () => {
    tick();
    if (document.visibilityState === "hidden") void flush();
  });

  // Heartbeat every 30s while the tab is open
  setInterval(() => void flush(), 30_000);

  // Final flush on unload
  window.addEventListener("pagehide", () => void flush());
  window.addEventListener("beforeunload", () => void flush());
}
