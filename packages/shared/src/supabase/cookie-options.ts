import type { CookieOptions } from "@supabase/ssr";

const productionCookieOptions = {
  domain: ".enclave.talk",
  sameSite: "lax",
  secure: true,
} satisfies CookieOptions;

function isEnclaveTalkHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "enclave.talk" || host.endsWith(".enclave.talk");
}

function shouldUseProductionCookieDomain(): boolean {
  if (process.env.VERCEL_ENV === "production") {
    return true;
  }

  if (process.env.NEXT_PUBLIC_ENCLAVE_AUTH_COOKIE_DOMAIN === ".enclave.talk") {
    return true;
  }

  if (typeof window !== "undefined") {
    return isEnclaveTalkHost(window.location.hostname);
  }

  return false;
}

export function getSupabaseCookieOptions(): CookieOptions | undefined {
  if (!shouldUseProductionCookieDomain()) {
    return { sameSite: "lax" };
  }

  return productionCookieOptions;
}
