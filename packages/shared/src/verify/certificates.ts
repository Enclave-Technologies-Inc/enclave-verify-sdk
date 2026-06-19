import { getEnclaveSession } from "../supabase/account-server.js";
import { createVerifyDataClientFromAccountSession } from "../supabase/verify-data-server.js";

export type VerifyCertificate = {
  id: string;
  enclave_user_id: string;
  document_type: string;
  issuing_country: string;
  issued_at: string;
  expires_at: string;
  revoked: boolean;
  revoked_at: string | null;
  claims: Record<string, unknown>;
  signature: string;
  verification_method: string;
};

export async function getUserCertificates(): Promise<VerifyCertificate[]> {
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

  return (data ?? []) as VerifyCertificate[];
}
