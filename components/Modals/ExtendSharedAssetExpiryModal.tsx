import React, { forwardRef, useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { useUpdated } from "../../hooks/useUpdated";
import { extendSharedAssetExpiry } from "../../redux/thunks/sharedAssets";
import { BORDER_RADIUS_SM, spacing } from "../../styles";
import ConfirmCancelButtons from "../ConfirmCancelButtons";
import AppText from "../Core/AppText";
import AppTextInput from "../Core/AppTextInput";
import AppModal, { AppModalRef } from "../Core/AppModal";
import AppKeyboardAwareView from "../KeyboardAwareView";
import { validateNumber } from "../../utils";
import AppScrollView from "../Core/AppScrollView";

type Props = { close: () => void; sharedAssetCode: string | undefined };

const ExtendSharedAssetExpiry = ({ close, sharedAssetCode }: Props) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();

  const [days, setDays] = useState("30");

  const extendExpiryRequest = useAppSelector(
    (state) => state.sharedAssets.extendExpiryRequest
  );
  const dispatch = useAppDispatch();

  useUpdated(extendExpiryRequest.success, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      Toast.show("Expiry Extended");
      close();
    }
  });

  const handleConfirm = () => {
    Keyboard.dismiss();
    if (!days || !sharedAssetCode) {
      return;
    }
    dispatch(extendSharedAssetExpiry({ days, code: sharedAssetCode }));
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
        {extendExpiryRequest.loading ? (
          <View style={theme.row}>
            <AppText>Extending Share Expiry</AppText>
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
              Extend Expiry Date
            </AppText>
            <AppText style={theme.textMeta}>
              Enter the number of days you want to extend your asset share.
            </AppText>
            <AppTextInput
              value={days}
              onChangeText={setDays}
              placeholder={"Days to extend expiry"}
              required={true}
              validation={validateNumber}
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

const ExtendSharedAssetExpiryModal = forwardRef<
  AppModalRef,
  Omit<Props, "close">
>(({ sharedAssetCode }, ref) => {
  const closeModal = () => {
    ref && "current" in ref && ref.current?.close();
  };

  return (
    <AppModal ref={ref}>
      <ExtendSharedAssetExpiry
        close={closeModal}
        sharedAssetCode={sharedAssetCode}
      />
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

export default ExtendSharedAssetExpiryModal;
