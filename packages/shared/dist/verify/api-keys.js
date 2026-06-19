import { createVerifyDataAdminClient } from "../supabase/verify-data-admin.js";
async function sha256Hex(input) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
export async function generateBusinessApiKey(enclaveUserId) {
    const admin = createVerifyDataAdminClient();
    const { data: business, error: businessError } = await admin
        .from("verify_businesses")
        .select("id")
        .eq("enclave_user_id", enclaveUserId)
        .maybeSingle();
    if (businessError || !business?.id) {
        return null;
    }
    const rawKey = `enc_live_${crypto.randomUUID().replace(/-/g, "")}`;
    const keyHash = await sha256Hex(rawKey);
    const keyPrefix = rawKey.substring(0, 16);
    const { error: insertError } = await admin.from("verify_api_keys").insert({
        business_id: business.id,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        label: "Default key",
        active: true,
    });
    if (insertError) {
        return null;
    }
    return { rawKey, keyPrefix };
}
async function getBusinessId(enclaveUserId) {
    const admin = createVerifyDataAdminClient();
    const { data: business, error } = await admin
        .from("verify_businesses")
        .select("id")
        .eq("enclave_user_id", enclaveUserId)
        .maybeSingle();
    if (error || !business?.id) {
        return null;
    }
    return business.id;
}
export async function listBusinessApiKeys(enclaveUserId) {
    const businessId = await getBusinessId(enclaveUserId);
    if (!businessId) {
        return [];
    }
    const admin = createVerifyDataAdminClient();
    const { data, error } = await admin
        .from("verify_api_keys")
        .select("id, key_prefix, label, active, created_at, last_used_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });
    if (error || !data) {
        return [];
    }
    return data.map((row) => ({
        id: row.id,
        keyPrefix: row.key_prefix,
        label: row.label,
        active: row.active,
        createdAt: row.created_at,
        lastUsedAt: row.last_used_at,
    }));
}
export async function revokeBusinessApiKey(enclaveUserId, keyId) {
    const businessId = await getBusinessId(enclaveUserId);
    if (!businessId) {
        return { ok: false, reason: "business_not_found" };
    }
    const admin = createVerifyDataAdminClient();
    const { error } = await admin
        .from("verify_api_keys")
        .update({ active: false })
        .eq("id", keyId)
        .eq("business_id", businessId);
    if (error) {
        return { ok: false, reason: error.message };
    }
    return { ok: true };
}
export async function rotateBusinessApiKey(enclaveUserId) {
    const businessId = await getBusinessId(enclaveUserId);
    if (!businessId) {
        return { ok: false, reason: "business_not_found" };
    }
    const admin = createVerifyDataAdminClient();
    const { error: revokeError } = await admin
        .from("verify_api_keys")
        .update({ active: false })
        .eq("business_id", businessId)
        .eq("active", true);
    if (revokeError) {
        return { ok: false, reason: revokeError.message };
    }
    const generated = await generateBusinessApiKey(enclaveUserId);
    if (!generated) {
        return { ok: false, reason: "key_generation_failed" };
    }
    return {
        ok: true,
        rawKey: generated.rawKey,
        keyPrefix: generated.keyPrefix,
    };
}
//# sourceMappingURL=api-keys.js.map