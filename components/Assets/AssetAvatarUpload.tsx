import React, { useMemo, useRef } from "react";
import { Pressable, PressableProps, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import OptionsModal, { OptionModalItem } from "../Modals/OptionsModal";
import { AppModalRef } from "../Core/AppModal";
import { useAlert } from "../../hooks/useAlert";
import { uploadAssetImage } from "../../api/assets";

export const AssetAvatarUpload = ({
  assetId,
  imei,
  children,
  ...rest
}: { assetId: string; imei: string; children: React.ReactNode } & Omit<
  PressableProps,
  "children"
>) => {
  const Alert = useAlert();

  const optionsModal = useRef<AppModalRef>(null);

  const [statusCamera, requestPermissionCamera] =
    ImagePicker.useCameraPermissions();
  const [statusMedia, requestPermissionMedia] =
    ImagePicker.useMediaLibraryPermissions();

  const handlePress = () => {
    optionsModal.current?.open();
  };

  const handleUpload = async (base64: string) => {
    try {
      console.log("[AvatarUpload] uploading image", {
        imei,
        base64Length: base64.length,
      });
      const result = await uploadAssetImage(imei, base64);
      console.log("[AvatarUpload] upload success", result);
    } catch (error) {
      console.error("[AvatarUpload] upload failed", error);
      Alert.alert("Something went wrong", "Your image was not uploaded.");
    }
  };

  const pickImage = async (type: "library" | "camera") => {
    console.log("[AvatarUpload] pickImage called", { type });
    if (type === "library") {
      if (!statusMedia?.granted) {
        const status = await requestPermissionMedia();
        console.log("[AvatarUpload] media permission result", status);
        if (!status.granted) {
          console.log("[AvatarUpload] media permission denied");
          return;
        }
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.1,
        allowsEditing: true,
        aspect: [1, 1],
      });
      console.log("[AvatarUpload] library result", {
        canceled: res.canceled,
        assetCount: res.assets?.length,
        hasBase64: !!res.assets?.[0]?.base64,
      });
      if (!res.canceled) {
        const base64 = res.assets?.[0].base64;
        if (base64) {
          handleUpload(base64);
        } else {
          Alert.alert("Something went wrong", "Your image was not found.");
        }
      }
    } else {
      if (!statusCamera?.granted) {
        const status = await requestPermissionCamera();
        console.log("[AvatarUpload] camera permission result", status);
        if (!status.granted) {
          console.log("[AvatarUpload] camera permission denied");
          return;
        }
      }
      try {
        const res = await ImagePicker.launchCameraAsync({
          base64: true,
          quality: 0.1,
          allowsEditing: true,
          aspect: [1, 1],
        });
        console.log("[AvatarUpload] camera result", {
          canceled: res.canceled,
          assetCount: res.assets?.length,
          hasBase64: !!res.assets?.[0]?.base64,
        });
        if (!res.canceled) {
          const base64 = res.assets?.[0].base64;
          if (base64) {
            handleUpload(base64);
          } else {
            Alert.alert("Something went wrong", "Your image was not found.");
          }
        }
      } catch (error) {
        console.error("[AvatarUpload] camera error", error);
        Alert.alert("Something went wrong", "Failed to launch camera.");
      }
    }
  };

  const options = useMemo(() => {
    const _options: OptionModalItem[] = [
      {
        text: "Photo Library",
        value: "photo",
        icon: "image-multiple",
        onPress: () => pickImage("library"),
        closeOnPress: true,
      },
      {
        text: "Camera",
        value: "camera",
        icon: "camera",
        onPress: () => pickImage("camera"),
        closeOnPress: true,
      },
    ];
    return _options;
  }, []);

  return (
    <>
      <Pressable onPress={handlePress} {...rest}>
        <View>{children}</View>
      </Pressable>
      <OptionsModal
        title={"Edit asset image"}
        options={options}
        ref={optionsModal}
      />
    </>
  );
};
