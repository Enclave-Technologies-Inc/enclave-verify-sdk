import { getSupabaseServerConfig } from "../supabase/server-config.js";

export async function callVerifyEdgeFunction(
  functionName: string,
  body: Record<string, unknown>,
) {
  const { url, serviceRoleKey } = getSupabaseServerConfig();

  const response = await fetch(`${url}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(body),
  });

  const result = (await response.json()) as Record<string, unknown>;
  return { response, result };
}
