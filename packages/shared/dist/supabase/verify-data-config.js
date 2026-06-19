const VERIFY_DATA_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERIFY_DATA_SUPABASE_URL?.trim() ||
    "https://kltykhkcvdwhfjgvevbt.supabase.co";
const VERIFY_DATA_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_VERIFY_DATA_SUPABASE_ANON_KEY?.trim() ||
    "";
const VERIFY_DATA_SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.VERIFY_DATA_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";
export function isVerifyDataConfigured() {
    return Boolean(VERIFY_DATA_SUPABASE_URL && VERIFY_DATA_SUPABASE_ANON_KEY);
}
export function isVerifyDataServiceRoleConfigured() {
    return Boolean(VERIFY_DATA_SUPABASE_URL && VERIFY_DATA_SUPABASE_SERVICE_ROLE_KEY);
}
export function getVerifyDataConfig() {
    if (!isVerifyDataConfigured()) {
        throw new Error("Verify data is not configured. Set NEXT_PUBLIC_VERIFY_DATA_SUPABASE_URL and NEXT_PUBLIC_VERIFY_DATA_SUPABASE_ANON_KEY.");
    }
    return {
        url: VERIFY_DATA_SUPABASE_URL,
        anonKey: VERIFY_DATA_SUPABASE_ANON_KEY,
    };
}
export function getVerifyDataServiceRoleKey() {
    if (!isVerifyDataServiceRoleConfigured()) {
        throw new Error("Verify service role is not configured. Set VERIFY_DATA_SUPABASE_SERVICE_ROLE_KEY.");
    }
    return VERIFY_DATA_SUPABASE_SERVICE_ROLE_KEY;
}
//# sourceMappingURL=verify-data-config.js.map