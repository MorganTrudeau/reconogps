import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useMemo, useState } from "react";
import AppScrollView from "../components/Core/AppScrollView";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import functions from "@react-native-firebase/functions";
import { User } from "../types";
import { useAlert } from "../hooks/useAlert";
import AppButton from "../components/Core/AppButton";
import { RootStackParamList } from "../navigation/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Stripe } from "stripe";
import {
  buildCheckoutItems,
  buildPricesParam,
  getStripePaymentSheetAppearance,
} from "../utils/stripe";
import { ActivityIndicator, View } from "react-native";
import AppText from "../components/Core/AppText";
import { BORDER_RADIUS_SM, spacing } from "../styles";
import { CheckoutItem, PricesParam } from "../types/stripe";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "activate-assets"
>;

const SubscribeAssetsScreen = ({ route }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();
  const Alert = useAlert();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const activeUser = useAppSelector((state) => state.activeUser.data);

  const [products, setProducts] = useState<Stripe.Product[]>();
  const [subscription, setSubscription] = useState<Stripe.Subscription>();

  const imeis = useMemo(() => {
    return route.params.activationEntries
      .map((entry) => entry.info.asset.IMEI)
      .sort((a, b) => (a > b ? -1 : 1));
  }, [route.params.activationEntries]);

  const loadProductsWithPrices = async () => {
    try {
      const res = await functions().httpsCallable("fetchSubscriptionProducts")({
        dev: true,
      });

      const products = res.data as Stripe.Product[];

      setProducts(products);

      return products;
    } catch (error) {
      console.log(error);
      Toast.show(
        "There was a problem loading your subscription products. Please check your internet and try again."
      );
      throw "load_products_error";
    }
  };

  const fetchPaymentSheetParams = async (
    _activeUser: User,
    _prices: PricesParam[]
  ) => {
    const customerData = {
      email: _activeUser.Email,
      name: `${_activeUser.FirstName} ${_activeUser.SurName}`,
      address: {
        country: _activeUser.CountryCode,
        postal_code: _activeUser.Address4,
      },
    };

    const res = await functions().httpsCallable(
      "createSubscriptionPaymentIntent"
    )({ customerData, prices: _prices, imeis: imeis.join(",") });

    const { paymentIntent, subscription, customerId } = res.data;

    setSubscription(subscription);

    return {
      paymentIntent,
      subscription,
      customerId,
    };
  };

  const initializePaymentSheet = async () => {
    if (!activeUser) {
      return Toast.show(
        "There is a problem with your app data. Please restart the app and try again."
      );
    }

    const products = await loadProductsWithPrices();

    const pricesParam = buildPricesParam(
      products,
      route.params.activationEntries.map((e) => e.formData.solution)
    );

    const { paymentIntent, customerId } = await fetchPaymentSheetParams(
      activeUser,
      pricesParam
    );

    const appearance = getStripePaymentSheetAppearance(theme, colors);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Recono GPS Tracking LTD.",
      customerId: customerId,
      paymentIntentClientSecret: paymentIntent,
      // customerEphemeralKeySecret: '',
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: `${activeUser.FirstName} ${activeUser.SurName}`,
      },
      style: "alwaysDark",
      appearance,
    });

    if (error) {
      console.log("initPaymentSheet error: ", error);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error && error.code === "Canceled") {
      return;
    }

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const renderSubscriptionItem = (
    subscriptionItem: Stripe.SubscriptionItem
  ) => {
    const price = subscriptionItem.price;

    const product = products
      ? products.find((p) => p.id === price.product)
      : null;

    return (
      <View
        style={[
          {
            paddingHorizontal: spacing("lg"),
            paddingVertical: spacing("md"),
            backgroundColor: colors.surface,
            borderRadius: BORDER_RADIUS_SM,
          },
          theme.row,
        ]}
        key={subscriptionItem.id}
      >
        <View style={{ flex: 1 }}>
          <AppText style={theme.title}>
            {product ? product.name : "Service Plan"}
          </AppText>
          <AppText style={[theme.textMeta, { marginTop: spacing("xs") }]}>
            {subscriptionItem.quantity} x Asset
            {subscriptionItem.quantity !== 1 ? "s" : ""}
          </AppText>
        </View>
        <AppText>${((price.unit_amount as number) / 100).toFixed(2)}</AppText>
      </View>
    );
  };

  const renderSubscription = (_subscription: Stripe.Subscription) => {
    return (
      <View>
        {_subscription.items.data.map((item: Stripe.SubscriptionItem) => {
          return renderSubscriptionItem(item);
        })}
      </View>
    );
  };

  return (
    <AppScrollView
      style={theme.container}
      contentContainerStyle={theme.contentContainer}
    >
      {!subscription ? (
        <ActivityIndicator
          color={colors.primary}
          size={"large"}
          style={{ marginTop: spacing("lg") }}
        />
      ) : (
        <>
          <View style={{ flex: 1, paddingVertical: spacing("md") }}>
            <AppText style={[theme.titleMeta, { marginBottom: spacing("sm") }]}>
              Your asset solutions
            </AppText>
            {renderSubscription(subscription)}
            <AppButton
              title={"Checkout"}
              onPress={openPaymentSheet}
              style={{ marginTop: spacing("xl") }}
            />
          </View>
        </>
      )}
    </AppScrollView>
  );
};

export default SubscribeAssetsScreen;
