"use server";

import { createAccountAuthClient, getEnclaveSession } from "../supabase/account-server.js";
import {
  exchangeAccountTokenForVerifyData,
} from "../supabase/verify-data-server.js";
import { getVerifyDataConfig } from "../supabase/verify-data-config.js";

export type CreateVerificationSessionResult =
  | { ok: true; sessionUrl: string; sessionId: string }
  | { ok: false; reason: string };

export async function createVerificationSession(
  consentRequestId?: string,
): Promise<CreateVerificationSessionResult> {
  const session = await getEnclaveSession();

  if (!session) {
    return { ok: false, reason: "not_authenticated" };
  }

  const account = await createAccountAuthClient();
  const {
    data: { session: accountSession },
  } = await account.auth.getSession();

  if (!accountSession?.access_token) {
    return { ok: false, reason: "not_authenticated" };
  }

  const verifyToken = await exchangeAccountTokenForVerifyData(
    accountSession.access_token,
  );

  if (!verifyToken) {
    return { ok: false, reason: "verify_token_exchange_failed" };
  }

  const { url, anonKey } = getVerifyDataConfig();

  const response = await fetch(`${url}/functions/v1/verify-create-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${verifyToken}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      enclave_user_id: session.id,
      consent_request_id: consentRequestId ?? null,
    }),
  });

  const body = (await response.json()) as {
    session_url?: string;
    session_id?: string;
    error?: string;
  };

  if (!response.ok || !body.session_url || !body.session_id) {
    return {
      ok: false,
      reason: body.error ?? "failed_to_create_session",
    };
  }

  return {
    ok: true,
    sessionUrl: body.session_url,
    sessionId: body.session_id,
  };
}
