"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createAccountBrowserClient } from "../supabase/client.js";
import { getVerifyDataConfig, isVerifyDataConfigured } from "../supabase/verify-data-config.js";

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

export async function createVerifyDataBrowserClient(): Promise<SupabaseClient | null> {
  if (!isVerifyDataConfigured()) {
    return null;
  }

  const account = createAccountBrowserClient();
  const {
    data: { session },
  } = await account.auth.getSession();

  if (!session?.access_token) {
    return null;
  }

  const verifyToken = await exchangeAccountTokenForVerifyData(
    session.access_token,
  );

  if (!verifyToken) {
    return null;
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
