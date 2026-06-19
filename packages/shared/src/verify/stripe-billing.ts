import { getStripeVerifyPriceIds } from "../stripe/config.js";
import { getStripeServerClient } from "../stripe/server.js";
import { createVerifyDataAdminClient } from "../supabase/verify-data-admin.js";

export async function provisionBusinessStripeBilling(input: {
  enclaveUserId: string;
  email: string;
  businessName: string;
  paymentMethodId: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const admin = createVerifyDataAdminClient();
  const { verificationPriceId, presentationPriceId } =
    getStripeVerifyPriceIds();

  if (!verificationPriceId || !presentationPriceId) {
    return { ok: false, reason: "stripe_prices_not_configured" };
  }

  const { data: business, error: businessError } = await admin
    .from("verify_businesses")
    .select(
      "id, stripe_customer_id, stripe_subscription_id, stripe_verification_item_id, stripe_presentation_item_id",
    )
    .eq("enclave_user_id", input.enclaveUserId)
    .maybeSingle();

  if (businessError || !business?.id) {
    return { ok: false, reason: "business_not_found" };
  }

  if (
    business.stripe_customer_id &&
    business.stripe_subscription_id &&
    business.stripe_verification_item_id &&
    business.stripe_presentation_item_id
  ) {
    return { ok: true };
  }

  const stripe = getStripeServerClient();

  const customer =
    business.stripe_customer_id
      ? await stripe.customers.retrieve(business.stripe_customer_id)
      : await stripe.customers.create({
          email: input.email,
          name: input.businessName,
          metadata: {
            enclave_user_id: input.enclaveUserId,
            business_name: input.businessName,
          },
        });

  const customerId =
    typeof customer === "string" ? customer : customer.id;

  await stripe.paymentMethods.attach(input.paymentMethodId, {
    customer: customerId,
  });

  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: input.paymentMethodId,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      { price: verificationPriceId },
      { price: presentationPriceId },
    ],
    collection_method: "charge_automatically",
  });

  const verificationItem = subscription.items.data.find(
    (item) => item.price.id === verificationPriceId,
  );
  const presentationItem = subscription.items.data.find(
    (item) => item.price.id === presentationPriceId,
  );

  if (!verificationItem?.id || !presentationItem?.id) {
    return { ok: false, reason: "stripe_subscription_items_missing" };
  }

  const { error: updateError } = await admin
    .from("verify_businesses")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_verification_item_id: verificationItem.id,
      stripe_presentation_item_id: presentationItem.id,
    })
    .eq("id", business.id);

  if (updateError) {
    return { ok: false, reason: updateError.message };
  }

  return { ok: true };
}

export async function updateBusinessPaymentMethod(input: {
  enclaveUserId: string;
  paymentMethodId: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const admin = createVerifyDataAdminClient();

  const { data: business, error } = await admin
    .from("verify_businesses")
    .select("stripe_customer_id")
    .eq("enclave_user_id", input.enclaveUserId)
    .maybeSingle();

  if (error || !business?.stripe_customer_id) {
    return { ok: false, reason: "stripe_customer_not_found" };
  }

  const stripe = getStripeServerClient();

  await stripe.paymentMethods.attach(input.paymentMethodId, {
    customer: business.stripe_customer_id,
  });

  await stripe.customers.update(business.stripe_customer_id, {
    invoice_settings: {
      default_payment_method: input.paymentMethodId,
    },
  });

  return { ok: true };
}
