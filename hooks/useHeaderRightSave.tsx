import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "./useTheme";
import { useEffect, useRef } from "react";
import { RootStackParamList } from "../navigation/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { iconSize } from "../styles";
import AppIcon from "../components/Core/AppIcon";

type Navigation = NativeStackScreenProps<RootStackParamList, any>["navigation"];

export const useHeaderRightSave = ({
  loading,
  navigation,
  onPress,
  style,
  disabled,
  renderActionButton,
  hidden,
}: {
  loading?: boolean;
  navigation: Navigation;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hidden?: boolean;
  renderActionButton?: ({
    color,
    onPress,
  }: {
    color: string;
    onPress: () => void;
  }) => React.ReactElement;
}) => {
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  const { colors } = useTheme();

  const renderSaveButton = () => {
    const onPress = () => onPressRef.current();
    const color = disabled ? colors.empty : colors.primary;

    if (typeof renderActionButton === "function") {
      return renderActionButton({ color, onPress });
    }

    return (
      <Pressable style={style} onPress={onPress}>
        <AppIcon color={color} name={"check-circle"} size={iconSize("md")} />
      </Pressable>
    );
  };

  const renderLoading = () => {
    return (
      <View style={style}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const setHeaderRightSaveButton = () => {
    navigation.setOptions({ headerRight: renderSaveButton });
  };

  const setHeaderRightLoading = () => {
    navigation.setOptions({ headerRight: renderLoading });
  };

  const setHeaderRightHidden = () => {
    navigation.setOptions({ headerRight: undefined });
  };

  useEffect(() => {
    setHeaderRightSaveButton();
  }, []);

  useEffect(() => {
    if (hidden) {
      setHeaderRightHidden();
    } else if (loading) {
      setHeaderRightLoading();
    } else {
      setHeaderRightSaveButton();
    }
  }, [loading, disabled]);
};
