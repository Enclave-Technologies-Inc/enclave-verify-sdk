import { DASHBOARD_PATH_PREFIX } from "../constants.js";
import type { VerifyAccountType } from "../supabase/verify-data-server.js";

export function getDashboardPathForAccountType(
  accountType: VerifyAccountType,
): string {
  const segment =
    accountType === "business" ? "/business/dashboard" : "/personal/dashboard";
  return `${DASHBOARD_PATH_PREFIX}${segment}`;
}

export function resolvePostSignInPath(
  verifyAccount: { account_type: VerifyAccountType } | null,
): string {
  if (!verifyAccount) {
    return "/onboarding";
  }

  return getDashboardPathForAccountType(verifyAccount.account_type);
}
