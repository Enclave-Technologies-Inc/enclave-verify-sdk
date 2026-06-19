const ACCOUNT_SUPABASE_URL =
  process.env.NEXT_PUBLIC_ACCOUNT_SUPABASE_URL?.trim() ||
  "https://eyqaeigblulbtnorqyts.supabase.co";

const ACCOUNT_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_ACCOUNT_SUPABASE_ANON_KEY?.trim() ?? "";

export function isAccountAuthConfigured(): boolean {
  return Boolean(ACCOUNT_SUPABASE_URL && ACCOUNT_SUPABASE_ANON_KEY);
}

export function getAccountSupabaseConfig(): { url: string; anonKey: string } {
  if (!isAccountAuthConfigured()) {
    throw new Error(
      "Account auth is not configured. Set NEXT_PUBLIC_ACCOUNT_SUPABASE_URL and NEXT_PUBLIC_ACCOUNT_SUPABASE_ANON_KEY.",
    );
  }

  return { url: ACCOUNT_SUPABASE_URL, anonKey: ACCOUNT_SUPABASE_ANON_KEY };
}
