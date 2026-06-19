export type CreateVerificationSessionResult = {
    ok: true;
    sessionUrl: string;
    sessionId: string;
} | {
    ok: false;
    reason: string;
};
export declare function createVerificationSession(consentRequestId?: string): Promise<CreateVerificationSessionResult>;
//# sourceMappingURL=create-session.d.ts.map