"use server";
import { createAccountAuthClient, getEnclaveSession } from "../supabase/account-server.js";
import { exchangeAccountTokenForVerifyData } from "../supabase/verify-data-server.js";
import { getVerifyDataConfig } from "../supabase/verify-data-config.js";
export async function createBusinessSetupIntent() {
    const session = await getEnclaveSession();
    if (!session) {
        return { ok: false, reason: "not_authenticated" };
    }
    const account = await createAccountAuthClient();
    const { data: { session: accountSession }, } = await account.auth.getSession();
    if (!accountSession?.access_token) {
        return { ok: false, reason: "not_authenticated" };
    }
    const verifyToken = await exchangeAccountTokenForVerifyData(accountSession.access_token);
    if (!verifyToken) {
        return { ok: false, reason: "verify_token_exchange_failed" };
    }
    const { url, anonKey } = getVerifyDataConfig();
    const response = await fetch(`${url}/functions/v1/verify-create-setup-intent`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${verifyToken}`,
            apikey: anonKey,
            "Content-Type": "application/json",
        },
        body: "{}",
    });
    const body = (await response.json());
    if (!response.ok || !body.client_secret) {
        return {
            ok: false,
            reason: body.error ?? "failed_to_create_setup_intent",
        };
    }
    return { ok: true, clientSecret: body.client_secret };
}
//# sourceMappingURL=setup-intent.js.map