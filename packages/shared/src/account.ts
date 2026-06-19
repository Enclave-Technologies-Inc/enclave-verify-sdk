import {
  ACCOUNT_WEB_ORIGIN,
  AUTH_NEXT_PATH_PREFIX,
  SITE_URL,
} from "./constants.js";

export const AUTH_CALLBACK_PATH = "/auth/callback";

export function buildAuthCallbackUrl(nextPath?: string): string {
  const url = new URL(AUTH_CALLBACK_PATH, SITE_URL);

  if (nextPath && nextPath.startsWith("/")) {
    const normalized =
      AUTH_NEXT_PATH_PREFIX && !nextPath.startsWith(AUTH_NEXT_PATH_PREFIX)
        ? `${AUTH_NEXT_PATH_PREFIX}${nextPath}`
        : nextPath;
    url.searchParams.set("next", normalized);
  }

  return url.toString();
}

export function buildAccountSignInUrl(
  redirect: string = buildAuthCallbackUrl(),
): string {
  const params = new URLSearchParams({ redirect });
  return `${ACCOUNT_WEB_ORIGIN}/signin?${params.toString()}`;
}

export function buildAccountSignUpUrl(
  redirect: string = buildAuthCallbackUrl(),
): string {
  const params = new URLSearchParams({ redirect });
  return `${ACCOUNT_WEB_ORIGIN}/signup?${params.toString()}`;
}
