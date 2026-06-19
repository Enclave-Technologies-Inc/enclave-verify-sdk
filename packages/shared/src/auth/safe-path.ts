export function isSafeInternalPath(path: string | null | undefined): path is string {
  if (!path?.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  if (path.startsWith("/auth/callback")) {
    return false;
  }

  return true;
}
