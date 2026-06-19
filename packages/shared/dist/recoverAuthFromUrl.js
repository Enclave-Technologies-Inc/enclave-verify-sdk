function readAuthParamsFromUrl() {
    if (typeof window === "undefined") {
        return new URLSearchParams();
    }
    const values = new URLSearchParams();
    const addPairs = (raw) => {
        const clean = raw.startsWith("?") || raw.startsWith("#") ? raw.slice(1) : raw;
        if (!clean)
            return;
        const parsed = new URLSearchParams(clean);
        parsed.forEach((value, key) => values.set(key, value));
    };
    addPairs(window.location.search);
    addPairs(window.location.hash);
    return values;
}
export function clearAuthParamsFromUrl() {
    if (typeof window === "undefined") {
        return;
    }
    const path = window.location.pathname;
    const search = new URLSearchParams(window.location.search);
    const authKeys = [
        "code",
        "access_token",
        "refresh_token",
        "expires_in",
        "token_type",
        "type",
        "error",
        "error_description",
    ];
    let changed = false;
    for (const key of authKeys) {
        if (search.has(key)) {
            search.delete(key);
            changed = true;
        }
    }
    const nextSearch = search.toString();
    const nextUrl = nextSearch ? `${path}?${nextSearch}` : path;
    if (changed || window.location.hash) {
        window.history.replaceState(window.history.state, "", nextUrl);
    }
}
export function hasAuthParamsInUrl() {
    const params = readAuthParamsFromUrl();
    return Boolean(params.get("code") ||
        (params.get("access_token") && params.get("refresh_token")));
}
export async function recoverAuthSessionFromUrl(setSession, exchangeCode) {
    const params = readAuthParamsFromUrl();
    const code = params.get("code");
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (code) {
        const { error } = await exchangeCode(code);
        clearAuthParamsFromUrl();
        return !error;
    }
    if (accessToken && refreshToken) {
        const { error } = await setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        clearAuthParamsFromUrl();
        return !error;
    }
    return false;
}
//# sourceMappingURL=recoverAuthFromUrl.js.map