import React, { forwardRef } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iconSize, spacing } from "../../styles/";
import { FeatherIcon, MaterialIcon, ThemeProps } from "../../types/styles";
import AppText from "../Core/AppText";
import { useTheme } from "../../hooks/useTheme";
import AppIcon from "../Core/AppIcon";

export const OPTION_HEIGHT = 55;
export const OPTION_ICON_SIZE = iconSize("md");
const PADDING_TOP = spacing("sm");

export type OptionModalItem = {
  customRenderer?: (props: { closeModal: () => void }) => React.ReactElement;
  value: string;
  text?: string;
  icon?: MaterialIcon;
  iconSize?: number;
  onPress?: (value: string) => void;
  renderIcon?: () => React.ReactElement;
  destructive?: boolean;
  onConfirmation?: () => Promise<boolean>;
  disabled?: boolean;
  loading?: boolean;
  selected?: boolean;
};

type OptionModalProps = {
  title?: string;
  description?: string;
  options: Array<OptionModalItem>;
  onSelect?: () => void;
  closeOnPress?: boolean;
  HeaderComponent?: React.FC<any>;
};

const OptionsModal = forwardRef<Modalize, OptionModalProps>(
  (
    {
      title,
      description,
      options = [],
      closeOnPress,
      HeaderComponent,
    }: OptionModalProps,
    ref
  ) => {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();

    const TITLE_PADDING_BOTTOM = spacing("sm");
    const PADDING_BOTTOM = spacing("md") + insets.bottom;

    const closeModal = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current?.close();
      }
    };

    const handleSelect = async (option: OptionModalItem) => {
      if (closeOnPress) {
        closeModal();
      }

      if (typeof option.onConfirmation === "function") {
        try {
          const shouldContinue = await option.onConfirmation();
          if (!shouldContinue) return;
        } catch (error) {
          console.log(error);
          return;
        }
      }

      const onPress = option.onPress;

      if (typeof onPress === "function") {
        requestAnimationFrame(() => onPress(option.value));
      }
    };

    const renderOptions = () =>
      options.map((option, index) =>
        typeof option.customRenderer === "function" ? (
          <View key={option.value}>
            {option.customRenderer({ closeModal })}
          </View>
        ) : (
          <OptionItem
            key={option.value}
            option={option}
            onPress={handleSelect}
            lastItem={index === options.length - 1}
            {...{ theme, colors }}
          />
        )
      );

    return (
      <Modalize
        ref={ref}
        adjustToContentHeight={true}
        modalStyle={{ backgroundColor: colors.background }}
        childrenStyle={{
          paddingTop: PADDING_TOP,
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        {(!!title || !!description) && (
          <View
            style={{
              marginHorizontal: spacing("lg"),
              marginBottom: TITLE_PADDING_BOTTOM,
            }}
          >
            {!!title && <AppText style={theme.titleLarge}>{title}</AppText>}
            {!!description && (
              <AppText
                style={{
                  color: colors.empty,
                  marginTop: 3,
                }}
              >
                {description}
              </AppText>
            )}
          </View>
        )}

        {HeaderComponent !== undefined && <HeaderComponent />}

        {renderOptions()}
      </Modalize>
    );
  }
);

type OptionItemProps = {
  option: OptionModalItem;
  lastItem: boolean;
  onPress: (option: OptionModalItem) => void;
} & ThemeProps;

export const OptionItem = ({
  option,
  lastItem,
  onPress,
  theme,
  colors,
}: OptionItemProps) => (
  <TouchableOpacity
    onPress={() => {
      onPress(option);
    }}
    activeOpacity={1}
    disabled={option.disabled}
  >
    <View
      style={[
        !lastItem && theme.borderBottom,
        {
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: spacing("lg"),
          height: OPTION_HEIGHT,
        },
      ]}
    >
      {typeof option.renderIcon === "function" ? (
        option.renderIcon()
      ) : !!option.icon ? (
        <View
          style={{
            height: OPTION_ICON_SIZE,
            width: OPTION_ICON_SIZE,
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing("lg"),
          }}
        >
          <AppIcon
            name={option.icon}
            size={option.iconSize || OPTION_ICON_SIZE}
            color={
              option.destructive
                ? colors.red
                : option.disabled
                ? colors.empty
                : colors.text
            }
          />
        </View>
      ) : null}
      <View
        style={[
          {
            alignItems: "center",
            justifyContent: "space-between",
            height: OPTION_HEIGHT,
            flex: 1,
          },
          theme.row,
        ]}
      >
        <AppText
          style={[
            theme.textLarge,
            {
              fontWeight: "400",
              textAlign: "left",
              marginLeft: 3,
              flexShrink: 1,
            },
            option.destructive && { color: colors.red },
            option.disabled && { color: colors.empty },
          ]}
        >
          {option.text}
        </AppText>
        {option.loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : option.selected ? (
          <AppIcon name={"check-circle"} color={colors.primary} />
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);

export default OptionsModal;
