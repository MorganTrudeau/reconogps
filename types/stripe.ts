import { Stripe } from "stripe";

export type PricesParam = { id: string; quantity: number };
export type CheckoutItem = {
  product: Stripe.Product;
  price: Stripe.Price;
  quantity: number;
};
