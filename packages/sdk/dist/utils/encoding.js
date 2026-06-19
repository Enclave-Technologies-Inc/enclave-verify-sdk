export function bytesToHex(bytes) {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
export function hexToBytes(hex) {
    const normalized = hex.trim().toLowerCase();
    if (normalized.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }
    const out = new Uint8Array(normalized.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}
function bytesToBase64(bytes) {
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary);
}
function base64ToBytes(base64) {
    const binary = atob(base64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        out[i] = binary.charCodeAt(i);
    }
    return out;
}
export function bytesToBase64Url(bytes) {
    return bytesToBase64(bytes)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}
export function base64UrlToBytes(value) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    return base64ToBytes(padded + "=".repeat(padLen));
}
export function sortedClaimKeys(claims) {
    return Object.keys(claims).sort();
}
//# sourceMappingURL=encoding.js.map