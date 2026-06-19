export const SUPPORTED_CLAIMS = [
  "identity_verified",
  "age_18_plus",
  "age_21_plus",
  "name_verified",
  "nationality",
  "document_type",
] as const;

export type SupportedClaim = (typeof SUPPORTED_CLAIMS)[number];

export const claimLabels: Record<string, string> = {
  identity_verified: "Proof of identity",
  age_18_plus: "Proof you are 18 or older",
  age_21_plus: "Proof you are 21 or older",
  name_verified: "Verification of your name",
  nationality: "Your nationality",
  document_type: "Your document type",
};

export function formatClaimLabel(claim: string): string {
  return claimLabels[claim] ?? claim.replace(/_/g, " ");
}

export function mapRequestStatusForApi(status: string): string {
  if (status === "pending") {
    return "pending_consent";
  }

  return status;
}

export type VerificationRequestStatus =
  | "pending"
  | "consented"
  | "denied"
  | "expired";

export function effectiveRequestStatus(
  status: string,
  expiresAt: string,
): VerificationRequestStatus {
  if (status === "pending" && new Date(expiresAt).getTime() < Date.now()) {
    return "expired";
  }

  if (
    status === "pending" ||
    status === "consented" ||
    status === "denied" ||
    status === "expired"
  ) {
    return status;
  }

  return "expired";
}

export function formatRequestStatusLabel(
  status: VerificationRequestStatus,
): string {
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
