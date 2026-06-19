export function getStripeSecretKey() {
    return process.env.STRIPE_SECRET_KEY?.trim() ?? "";
}
export function getStripePublishableKey() {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
}
export function getStripeVerifyPriceIds() {
    return {
        verificationPriceId: process.env.STRIPE_VERIFY_VERIFICATION_PRICE_ID?.trim() ?? "",
        presentationPriceId: process.env.STRIPE_VERIFY_PRESENTATION_PRICE_ID?.trim() ?? "",
    };
}
export function isStripeConfigured() {
    const { verificationPriceId, presentationPriceId } = getStripeVerifyPriceIds();
    return Boolean(getStripeSecretKey() &&
        getStripePublishableKey() &&
        verificationPriceId &&
        presentationPriceId);
}
//# sourceMappingURL=config.js.map