import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAccountSupabaseConfig, isAccountAuthConfigured, } from "../supabase/account-config.js";
import { getSupabaseCookieOptions } from "../supabase/cookie-options.js";
export async function createAccountAuthClient() {
    const { url, anonKey } = getAccountSupabaseConfig();
    const cookieStore = await cookies();
    return createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                }
                catch {
                    // Server Component read-only context; middleware refreshes session.
                }
            },
        },
        cookieOptions: getSupabaseCookieOptions(),
    });
}
export async function getEnclaveSession() {
    if (!isAccountAuthConfigured()) {
        return null;
    }
    const supabase = await createAccountAuthClient();
    const { data: { user }, } = await supabase.auth.getUser();
    return user;
}
//# sourceMappingURL=account-server.js.map