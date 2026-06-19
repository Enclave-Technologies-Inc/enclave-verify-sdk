export function isSafeInternalPath(path) {
    if (!path?.startsWith("/") || path.startsWith("//")) {
        return false;
    }
    if (path.startsWith("/auth/callback")) {
        return false;
    }
    return true;
}
//# sourceMappingURL=safe-path.js.map