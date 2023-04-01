import { Stripe } from "stripe";
import { BORDER_RADIUS_SM } from "../styles";
import { CheckoutItem, PricesParam } from "../types/stripe";
import { Colors, Theme } from "../types/styles";

export const buildCheckoutItems = (
  products: Stripe.Product[],
  prices: Stripe.Price[],
  solutions: string[]
) => {
  const productMap: { [solutionId: string]: Stripe.Product } = {};

  products.forEach((product: Stripe.Product) => {
    productMap[product.metadata.solution] = product;
  });

  const invoiceProductsMap: {
    [productId: string]: CheckoutItem;
  } = {};

  solutions.map((solution) => {
    const product = products.find(
      (p) => p.metadata.solution === solution.toLowerCase()
    );

    if (!product) {
      return;
    }

    const price = prices.find((p) => p.product === product.id);

    if (!price) {
      return;
    }

    invoiceProductsMap[product.id] = invoiceProductsMap[product.id]
      ? {
          product,
          price,
          quantity: invoiceProductsMap[product.id].quantity + 1,
        }
      : { product, price, quantity: 1 };
  });

  return Object.values(invoiceProductsMap);
};

export const buildPricesParam = (
  products: Stripe.Product[],
  solutions: string[]
): PricesParam[] => {
  const productMap: { [solutionId: string]: Stripe.Product } = {};

  products.forEach((product: Stripe.Product) => {
    productMap[product.metadata.solution] = product;
  });

  const priceMap: { [priceId: string]: PricesParam } = {};

  solutions.map((solution) => {
    const product = productMap[solution.toLowerCase()];

    if (!product) {
      return;
    }

    const defaultPrice = product.default_price as string;

    if (!defaultPrice) {
      return;
    }

    priceMap[defaultPrice] = priceMap[defaultPrice]
      ? { id: defaultPrice, quantity: priceMap[defaultPrice].quantity + 1 }
      : { id: defaultPrice, quantity: 1 };
  });

  return Object.values(priceMap);
};

export const getStripePaymentSheetAppearance = (
  theme: Theme,
  colors: Colors
) => {
  return {
    colors: {
      /** A primary color used throughout your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System blue color on iOS, and "#007AFF" (light) / "#0074D4" (dark) on Android.
       */
      primary: colors.primary,
      /** The color used for the background of your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System background color on iOS, and "#ffffff" (light) / "#2e2e2e" (dark) on Android.
       */
      background: colors.background,
      /** The color used for the background of inputs, tabs, and other components in your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System background color (light) / System secondary background color (dark) on iOS, and "#ffffff" (light) / "#a9a9a9" (dark) on Android.
       */
      componentBackground: colors.surface,
      /** The color used for the external border of inputs, tabs, and other components in your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System gray (3) color on iOS, and "#33787880" (light) / "#787880" (dark) on Android.
       */
      componentBorder: colors.border,
      /** The color used for the internal border (meaning the border is shared with another component) of inputs, tabs, and other components in your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System gray (3) color on iOS, and "#33787880" (light) / "#787880" (dark) on Android.
       */
      componentDivider: colors.border,
      /** The color of the header text in your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System label color on iOS, and "#000000" (light) / "#ffffff" (dark) on Android.
       */
      primaryText: colors.text,
      /** The color of the label text of input fields, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System seconday label color on iOS, and "#000000" (light) / "#ffffff" (dark) on Android.
       */
      secondaryText: colors.textMeta,
      /** The color of the input text in your PaymentSheet components, such as the user's card number or zip code, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default "#000000"
       */
      componentText: colors.text,
      /** The color of the placeholder text of input fields, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System label color on iOS, and "#99000000" (light) / "#99ffffff" (dark) on Android.
       */
      placeholderText: colors.textMeta,
      /** The color used for icons in your Payment Sheet, such as the close or back icons, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System seconday label color on iOS, and "#99000000" (light) / "#ffffff" (dark) on Android.
       */
      icon: colors.primary,
      /** The color used to indicate errors or destructive actions in your Payment Sheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
       * @default The System red color on iOS, and "#ff0000" (light) / "#ff0000" (dark) on Android.
       */
      error: colors.red,
    },
    primaryButton: {
      shapes: {
        /** The border radius used for the primary button in your PaymentSheet
         * @default The root `appearance.shapes.borderRadius`
         */
        borderRadius: BORDER_RADIUS_SM,
        /** The border width used for the primary button in your PaymentSheet
         * @default The root `appearance.shapes.borderWidth`
         */
        borderWidth: 0,
      },
      colors: {
        background: colors.primary,
        /** The color of the text for the primary button in your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
         * @default White or black, depending on the color of the button.
         */
        text: colors.black,
        /** The border color used for the primary button in your PaymentSheet, represented as a hex string with format #RRGGBB or #AARRGGBB.
         * @default The System quaternary label on iOS, transparent on Android.
         */
        border: colors.primary,
      },
    },
  };
};
