export type CreateSetupIntentResult = {
    ok: true;
    clientSecret: string;
} | {
    ok: false;
    reason: string;
};
export declare function createBusinessSetupIntent(): Promise<CreateSetupIntentResult>;
//# sourceMappingURL=setup-intent.d.ts.map