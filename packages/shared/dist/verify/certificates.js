import { getEnclaveSession } from "../supabase/account-server.js";
import { createVerifyDataClientFromAccountSession } from "../supabase/verify-data-server.js";
export async function getUserCertificates() {
    const session = await getEnclaveSession();
    if (!session) {
        return [];
    }
    const supabase = await createVerifyDataClientFromAccountSession();
    const { data, error } = await supabase
        .from("verify_certificates")
        .select("*")
        .eq("enclave_user_id", session.id)
        .order("issued_at", { ascending: false });
    if (error) {
        throw new Error(error.message);
    }
    return (data ?? []);
}
//# sourceMappingURL=certificates.js.map