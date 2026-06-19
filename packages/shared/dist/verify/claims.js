export const SUPPORTED_CLAIMS = [
    "identity_verified",
    "age_18_plus",
    "age_21_plus",
    "name_verified",
    "nationality",
    "document_type",
];
export const claimLabels = {
    identity_verified: "Proof of identity",
    age_18_plus: "Proof you are 18 or older",
    age_21_plus: "Proof you are 21 or older",
    name_verified: "Verification of your name",
    nationality: "Your nationality",
    document_type: "Your document type",
};
export function formatClaimLabel(claim) {
    return claimLabels[claim] ?? claim.replace(/_/g, " ");
}
export function mapRequestStatusForApi(status) {
    if (status === "pending") {
        return "pending_consent";
    }
    return status;
}
export function effectiveRequestStatus(status, expiresAt) {
    if (status === "pending" && new Date(expiresAt).getTime() < Date.now()) {
        return "expired";
    }
    if (status === "pending" ||
        status === "consented" ||
        status === "denied" ||
        status === "expired") {
        return status;
    }
    return "expired";
}
export function formatRequestStatusLabel(status) {
    switch (status) {
        case "pending":
            return "Pending consent";
        case "consented":
            return "Consented";
        case "denied":
            return "Denied";
        case "expired":
            return "Expired";
    }
}
//# sourceMappingURL=claims.js.map