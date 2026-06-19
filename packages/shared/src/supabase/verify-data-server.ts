import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createAccountAuthClient } from "../supabase/account-server.js";
import {
  getVerifyDataConfig,
  getVerifyDataServiceRoleKey,
  isVerifyDataConfigured,
  isVerifyDataServiceRoleConfigured,
} from "../supabase/verify-data-config.js";

export type VerifyAccountType = "business" | "individual";

export type VerifyAccountRow = {
  account_type: VerifyAccountType;
};

export async function exchangeAccountTokenForVerifyData(
  accountAccessToken: string,
): Promise<string | null> {
  const { url, anonKey } = getVerifyDataConfig();

  const response = await fetch(`${url}/functions/v1/exchange-account-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accountAccessToken}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  const body = (await response.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!response.ok || !body.access_token) {
    return null;
  }

  return body.access_token;
}

export async function createVerifyDataClientFromAccountSession(): Promise<SupabaseClient> {
  const account = await createAccountAuthClient();
  const {
    data: { session },
  } = await account.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Sign in to continue.");
  }

  const verifyToken = await exchangeAccountTokenForVerifyData(
    session.access_token,
  );

  if (!verifyToken) {
    throw new Error("Could not connect to Enclave Verify for this account.");
  }

  const { url, anonKey } = getVerifyDataConfig();
  return createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${verifyToken}`,
      },
    },
  });
}

export async function getVerifyAccountByUserId(
  enclaveUserId: string,
  accountAccessToken?: string,
): Promise<VerifyAccountRow | null> {
  if (!isVerifyDataServiceRoleConfigured()) {
    if (!isVerifyDataConfigured()) {
      return null;
    }

    let accessToken = accountAccessToken;

    if (!accessToken) {
      const account = await createAccountAuthClient();
      const {
        data: { session },
      } = await account.auth.getSession();
      accessToken = session?.access_token;
    }

    if (!accessToken) {
      return null;
    }

    const verifyToken = await exchangeAccountTokenForVerifyData(accessToken);

    if (!verifyToken) {
      return null;
    }

    const { url, anonKey } = getVerifyDataConfig();
    const client = createClient(url, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${verifyToken}`,
        },
      },
    });

    const { data } = await client
      .from("verify_accounts")
      .select("account_type")
      .eq("enclave_user_id", enclaveUserId)
      .maybeSingle();

    return data;
  }

  const { url } = getVerifyDataConfig();
  const serviceRoleKey = getVerifyDataServiceRoleKey();

  const response = await fetch(
    `${url}/rest/v1/verify_accounts?enclave_user_id=eq.${enclaveUserId}&select=account_type&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as VerifyAccountRow[];
  return rows[0] ?? null;
}
