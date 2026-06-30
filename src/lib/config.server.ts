// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = import.meta.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || import.meta.env.NODE_ENV,

    // Supabase
    supabaseUrl: process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || "",

    // PayU Payment Gateway
    payuMerchantKey: process.env.PAYU_MERCHANT_KEY || import.meta.env.PAYU_MERCHANT_KEY || "",
    payuSalt: process.env.PAYU_SALT || import.meta.env.PAYU_SALT || "",
    payuMode: (process.env.PAYU_MODE || import.meta.env.PAYU_MODE || "test") as "test" | "live",

    // Email (Resend)
    resendApiKey: process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || "",

    // App
    appUrl: process.env.APP_URL || import.meta.env.APP_URL || "http://localhost:3000",
    adminEmail: process.env.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL || "",
    supportEmail: process.env.SUPPORT_EMAIL || import.meta.env.SUPPORT_EMAIL || "",
  };
}
