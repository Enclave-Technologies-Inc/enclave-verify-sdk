import { createBrowserClient } from "@supabase/ssr";
import {
  getAccountSupabaseConfig,
  isAccountAuthConfigured,
} from "../supabase/account-config.js";
import { getSupabaseCookieOptions } from "../supabase/cookie-options.js";

export function createAccountBrowserClient() {
  if (!isAccountAuthConfigured()) {
    throw new Error("Account auth is not configured.");
  }

  const { url, anonKey } = getAccountSupabaseConfig();
  return createBrowserClient(url, anonKey, {
    cookieOptions: getSupabaseCookieOptions(),
  });
}
