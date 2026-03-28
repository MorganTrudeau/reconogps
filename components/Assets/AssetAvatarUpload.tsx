import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import OptionsModal, { OptionModalItem } from "../Modals/OptionsModal";
import { AppModalRef } from "../Core/AppModal";
import { useAlert } from "../../hooks/useAlert";
import { uploadAssetImage } from "../../api/assets";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { assetIconUpdated } from "../../redux/reducers/assets";
import { colors } from "../../styles";

const MAX_DIMENSION = 800;
const COMPRESS_QUALITY = 0.7;

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
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const optionsModal = useRef<AppModalRef>(null);

  const [statusCamera, requestPermissionCamera] =
    ImagePicker.useCameraPermissions();
  const [statusMedia, requestPermissionMedia] =
    ImagePicker.useMediaLibraryPermissions();

  const handlePress = () => {
    optionsModal.current?.open();
  };

  const compressImage = async (uri: string): Promise<string> => {
    const context = ImageManipulator.manipulate(uri);
    context.resize({ width: MAX_DIMENSION });
    const imageRef = await context.renderAsync();
    const result = await imageRef.saveAsync({
      base64: true,
      compress: COMPRESS_QUALITY,
      format: SaveFormat.JPEG,
    });
    if (!result.base64) {
      throw new Error("Failed to compress image");
    }
    return result.base64;
  };

  const handleUpload = async (base64: string) => {
    try {
      setLoading(true);
      console.log("[AvatarUpload] uploading image", {
        imei,
        base64Length: base64.length,
      });
      const result = await uploadAssetImage(imei, base64);
      console.log("[AvatarUpload] upload success", result);
      dispatch(assetIconUpdated({ assetId, icon: `IMEI_${imei}.png` }));
    } catch (error) {
      console.error("[AvatarUpload] upload failed", error);
      Alert.alert("Something went wrong", "Your image was not uploaded.");
    } finally {
      setLoading(false);
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
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!res.canceled) {
        const uri = res.assets?.[0]?.uri;
        if (uri) {
          try {
            const base64 = await compressImage(uri);
            await handleUpload(base64);
          } catch (error) {
            console.error("[AvatarUpload] library error", error);
            Alert.alert("Something went wrong", "Your image was not uploaded.");
          }
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
          quality: 1,
          allowsEditing: true,
          aspect: [1, 1],
        });
        if (!res.canceled) {
          const uri = res.assets?.[0]?.uri;
          if (uri) {
            const base64 = await compressImage(uri);
            await handleUpload(base64);
          } else {
            Alert.alert("Something went wrong", "Your image was not found.");
          }
        }
      } catch (error) {
        console.error("[AvatarUpload] camera error", error);
        Alert.alert("Something went wrong", "Your image was not uploaded.");
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
      <Pressable onPress={handlePress} disabled={loading} {...rest}>
        <>
          {children}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={colors.white} />
            </View>
          )}
        </>
      </Pressable>
      <OptionsModal
        title={"Edit asset image"}
        options={options}
        ref={optionsModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});
