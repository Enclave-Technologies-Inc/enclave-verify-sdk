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

async function exchangeAccountTokenForVerifyData(
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

export async function getVerifyAccountForMiddleware(
  enclaveUserId: string,
  accountAccessToken?: string,
): Promise<VerifyAccountRow | null> {
  if (!isVerifyDataConfigured()) {
    return null;
  }

  if (isVerifyDataServiceRoleConfigured()) {
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

  if (!accountAccessToken) {
    return null;
  }

  const verifyToken = await exchangeAccountTokenForVerifyData(accountAccessToken);
  if (!verifyToken) {
    return null;
  }

  const { url, anonKey } = getVerifyDataConfig();
  const response = await fetch(
    `${url}/rest/v1/verify_accounts?enclave_user_id=eq.${enclaveUserId}&select=account_type&limit=1`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${verifyToken}`,
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
