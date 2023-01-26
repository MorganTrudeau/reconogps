import React, { forwardRef, useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { useUpdated } from "../../hooks/useUpdated";
import { subscribeSharedAsset } from "../../redux/thunks/sharedAssets";
import { BORDER_RADIUS_SM, spacing } from "../../styles";
import ConfirmCancelButtons from "../ConfirmCancelButtons";
import AppText from "../Core/AppText";
import AppTextInput from "../Core/AppTextInput";
import AppModal, { AppModalRef } from "../Core/AppModal";
import AppKeyboardAwareView from "../KeyboardAwareView";
import AppScrollView from "../Core/AppScrollView";

type Props = { close: () => void };

const SubscribeSharedAsset = ({ close }: Props) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();

  const [code, setCode] = useState("");

  const subscribeSharedAssetRequest = useAppSelector(
    (state) => state.sharedAssets.subscribeSharedAssetRequest
  );
  const dispatch = useAppDispatch();

  useUpdated(subscribeSharedAssetRequest.success, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      Toast.show("Asset Subscribed");
      close();
    }
  });

  const handleConfirm = () => {
    Keyboard.dismiss();
    if (!code) {
      return;
    }
    dispatch(subscribeSharedAsset({ code }));
  };

  return (
    <AppKeyboardAwareView
      style={[styles.container, { backgroundColor: colors.background }]}
      scrollOffset={-spacing("lg")}
    >
      <AppScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps={"handled"}
      >
        {subscribeSharedAssetRequest.loading ? (
          <View style={theme.row}>
            <AppText>Subscribing to asset</AppText>
            <ActivityIndicator
              color={colors.primary}
              style={{ marginLeft: spacing("lg") }}
            />
          </View>
        ) : (
          <>
            <AppText
              style={[theme.titleLarge, { marginBottom: spacing("md") }]}
            >
              New Asset Subscription
            </AppText>
            <AppText style={theme.textMeta}>
              Enter shared code to subscribe
            </AppText>
            <AppTextInput
              value={code}
              onChangeText={setCode}
              placeholder={"Shared Asset Code"}
              required={true}
              onSubmitEditing={handleConfirm}
            />
            <ConfirmCancelButtons
              onConfirm={handleConfirm}
              onCancel={close}
              colors={colors}
              theme={theme}
            />
          </>
        )}
      </AppScrollView>
    </AppKeyboardAwareView>
  );
};

const SubscribeSharedAssetModal = forwardRef<AppModalRef, {}>(({}, ref) => {
  const closeModal = () => {
    ref && "current" in ref && ref.current?.close();
  };

  return (
    <AppModal ref={ref}>
      <SubscribeSharedAsset close={closeModal} />
    </AppModal>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: spacing("xl"),
    borderRadius: BORDER_RADIUS_SM,
    paddingBottom: spacing("xl"),
  },
});

export default SubscribeSharedAssetModal;
