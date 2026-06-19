export const SITE_URL = process.env.NEXT_PUBLIC_VERIFY_LANDING_URL?.trim() ||
    "https://verify.enclave.talk";
export const ACCOUNT_WEB_ORIGIN = "https://account.enclave.talk";
export const DOCS_URL = `${SITE_URL}/docs`;
export const ENCLAVE_URL = "https://enclave.talk";
export const AUTH_CALLBACK_URL = `${SITE_URL}/auth/callback`;
export const LANDING_ONBOARDING_URL = `${SITE_URL}/onboarding`;
export const ACCOUNT_SIGN_IN_URL = `${ACCOUNT_WEB_ORIGIN}/signin?redirect=${encodeURIComponent(AUTH_CALLBACK_URL)}`;
export const PRIVACY_URL = process.env.NEXT_PUBLIC_VERIFY_PRIVACY_URL?.trim() ||
    `${SITE_URL}/privacy`;
export const TERMS_URL = process.env.NEXT_PUBLIC_VERIFY_TERMS_URL?.trim() ||
    `${SITE_URL}/terms`;
export const SOCIAL_IMAGE_ALT = "Enclave Verify identity verification infrastructure";
export const OG_IMAGE_PATH = "/favicon.svg";
/** Prefix for dashboard hrefs (e.g. `/web` on landing, empty in the web app). */
export const DASHBOARD_PATH_PREFIX = process.env.NEXT_PUBLIC_VERIFY_DASHBOARD_PATH_PREFIX?.trim() || "";
/** Prefix for `next` params on the landing auth callback (e.g. `/web` from the web app). */
export const AUTH_NEXT_PATH_PREFIX = process.env.NEXT_PUBLIC_VERIFY_AUTH_NEXT_PREFIX?.trim() || "";
//# sourceMappingURL=constants.js.map