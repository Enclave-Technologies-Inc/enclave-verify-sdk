import { DASHBOARD_PATH_PREFIX } from "../constants.js";
export function getDashboardPathForAccountType(accountType) {
    const segment = accountType === "business" ? "/business/dashboard" : "/personal/dashboard";
    return `${DASHBOARD_PATH_PREFIX}${segment}`;
}
export function resolvePostSignInPath(verifyAccount) {
    if (!verifyAccount) {
        return "/onboarding";
    }
    return getDashboardPathForAccountType(verifyAccount.account_type);
}
//# sourceMappingURL=routing.js.map