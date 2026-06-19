import Stripe from "stripe";
import { getStripeSecretKey } from "../stripe/config.js";
let stripeClient = null;
export function getStripeServerClient() {
    const secretKey = getStripeSecretKey();
    if (!secretKey) {
        throw new Error("Stripe is not configured.");
    }
    if (!stripeClient) {
        stripeClient = new Stripe(secretKey);
    }
    return stripeClient;
}
//# sourceMappingURL=server.js.map