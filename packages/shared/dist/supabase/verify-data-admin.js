import { createClient } from "@supabase/supabase-js";
import { getVerifyDataConfig, getVerifyDataServiceRoleKey, isVerifyDataServiceRoleConfigured, } from "../supabase/verify-data-config.js";
export function createVerifyDataAdminClient() {
    if (!isVerifyDataServiceRoleConfigured()) {
        throw new Error("Verify service role is not configured. Set VERIFY_DATA_SUPABASE_SERVICE_ROLE_KEY.");
    }
    const { url } = getVerifyDataConfig();
    return createClient(url, getVerifyDataServiceRoleKey(), {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
//# sourceMappingURL=verify-data-admin.js.map