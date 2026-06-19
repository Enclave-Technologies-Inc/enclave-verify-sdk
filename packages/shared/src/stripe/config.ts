export function getStripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? "";
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
}

export function getStripeVerifyPriceIds(): {
  verificationPriceId: string;
  presentationPriceId: string;
} {
  return {
    verificationPriceId:
      process.env.STRIPE_VERIFY_VERIFICATION_PRICE_ID?.trim() ?? "",
    presentationPriceId:
      process.env.STRIPE_VERIFY_PRESENTATION_PRICE_ID?.trim() ?? "",
  };
}

export function isStripeConfigured(): boolean {
  const { verificationPriceId, presentationPriceId } =
    getStripeVerifyPriceIds();
  return Boolean(
    getStripeSecretKey() &&
      getStripePublishableKey() &&
      verificationPriceId &&
      presentationPriceId,
  );
}
