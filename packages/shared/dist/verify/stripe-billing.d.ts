export declare function provisionBusinessStripeBilling(input: {
    enclaveUserId: string;
    email: string;
    businessName: string;
    paymentMethodId: string;
}): Promise<{
    ok: true;
} | {
    ok: false;
    reason: string;
}>;
export declare function updateBusinessPaymentMethod(input: {
    enclaveUserId: string;
    paymentMethodId: string;
}): Promise<{
    ok: true;
} | {
    ok: false;
    reason: string;
}>;
//# sourceMappingURL=stripe-billing.d.ts.map