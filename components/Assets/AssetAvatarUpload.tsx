import React, { useMemo, useRef } from "react";
import { Pressable, PressableProps } from "react-native";
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
}: { assetId: string; imei: string } & PressableProps) => {
  const Alert = useAlert();

  const optionsModal = useRef<AppModalRef>(null);

  const [statusCamera, requestPermissionCamera] =
    ImagePicker.useCameraPermissions();
  const [statusMedia, requestPermissionMedia] =
    ImagePicker.useMediaLibraryPermissions();

  const handlePress = () => {
    optionsModal.current?.open();
  };

  const handleUpload = (base64: string) => {
    uploadAssetImage(imei, base64);
  };

  const pickImage = async (type: "library" | "camera") => {
    if (type === "library") {
      if (!statusMedia?.granted) {
        const status = await requestPermissionMedia();
        if (!status.granted) {
          return;
        }
      }
      const res = await ImagePicker.launchImageLibraryAsync();
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
        if (!status.granted) {
          return;
        }
      }
      try {
        const res = await ImagePicker.launchCameraAsync();
        if (!res.canceled) {
          const base64 = res.assets?.[0].base64;
          if (base64) {
            handleUpload(base64);
          } else {
            Alert.alert("Something went wrong", "Your image was not found.");
          }
        }
      } catch (error) {
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
        {children}
      </Pressable>
      <OptionsModal
        title={"Edit asset image"}
        options={options}
        ref={optionsModal}
      />
    </>
  );
};
