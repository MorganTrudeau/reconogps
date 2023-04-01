import * as functions from "firebase-functions";

const Stripe = require("stripe");
const stripe = Stripe(functions.config().stripe.secret_key);

export const fetchSubscriptionProducts = functions.https.onCall(
  async ({ dev }) => {
    const devProducts: string[] = [
      "prod_Nd3jV0We1Di0w6",
      "prod_Nd3jpYvmriUh4k",
      "prod_Nd3iFfLpcE90YX",
    ];

    const liveProducts: string[] = [];

    let productIds = dev ? devProducts : liveProducts;

    const productsList = await stripe.products.list({
      limit: productIds.length,
      ids: productIds,
    });

    const products = productsList.data;

    return products;
  }
);

export const createSubscriptionPaymentIntent = functions.https.onCall(
  async ({
    customerData,
    prices,
    imeis,
  }: {
    customerData: {
      email: string;
      name: string;
      address: { country: string; postal_code: string };
    };
    prices: { id: string; quantity: number }[];
    imeis: string;
  }) => {
    let customer;

    const customers = await stripe.customers.list({
      limit: 1,
      email: customerData.email,
    });

    if (!customers.data[0]) {
      customer = await stripe.customers.create(customerData);
    } else {
      customer = customers.data[0];
    }

    let pendingSubscription;

    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        expand: ["data.latest_invoice", "data.latest_invoice.payment_intent"],
      });
      pendingSubscription =
        subscriptions.data &&
        subscriptions.data.find(
          (subscription: any) =>
            subscription.status === "incomplete" &&
            subscription.metadata &&
            subscription.metadata.imeis === imeis &&
            subscription.items.data.length === prices.length &&
            prices.every(({ id, quantity }) => {
              console.log("Price param: ", { id, quantity });
              return subscription.items.data.find((item: any) => {
                console.log("Subscription price: ", {
                  id: item.price.id,
                  quantity: item.quantity,
                });
                return item.price.id === id && item.quantity === quantity;
              });
            })
        );
      console.log("Pending subscription: ", pendingSubscription?.id);
    } catch (error) {
      console.log("Failed to check for pending subscription: ", error);
    }

    let subscription;

    if (pendingSubscription) {
      subscription = pendingSubscription;
    } else {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: prices.map((price: { id: string; quantity: number }) => ({
          price: price.id,
          quantity: price.quantity,
        })),
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: { imeis },
      });
    }

    return {
      subscription: subscription,
      paymentIntent: subscription.latest_invoice.payment_intent.client_secret,
      customerId: customer.id,
    };
  }
);
