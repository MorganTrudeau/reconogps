import { PixelRatio, Platform, StyleProp } from "react-native";
import { SpacingScale } from "../types/styles";

export const BORDER_RADIUS_SM = 3;

export const iconSize = (sizeScale: SpacingScale): number => {
  switch (sizeScale) {
    case "xs":
      return Platform.select({ default: 16, web: 18 });
    case "sm":
      return Platform.select({ default: 20, web: 22 });
    case "md":
      return Platform.select({ default: 24, web: 26 });
    case "lg":
      return Platform.select({ default: 28, web: 30 });
    case "xl":
      return Platform.select({ default: 32, web: 34 });
  }
};

export const spacing = (scale: SpacingScale) => {
  switch (scale) {
    case "xs":
      return 3;
    case "sm":
      return 6;
    case "md":
      return 10;
    case "lg":
      return 14;
    case "xl":
      return 20;
  }
};

export function normalize(size: number) {
  return Math.round(PixelRatio.roundToNearestPixel(size));
}

const FontSizes = {
  SMALL: normalize(12),
  NORMAL: normalize(16),
  LARGE: normalize(19),
};
type FontSize = typeof FontSizes[keyof typeof FontSizes];

export const FontWeights = {
  THIN: "100",
  ULTRA_LIGHT: "200",
  LIGHT: "300",
  REGULAR: "400",
  MEDIUM: "500",
  SEMIBOLD: "600",
  BOLD: "700",
  HEAVY: "800",
  BLACK: "900",
} as const;
export type FontWeight = typeof FontWeights[keyof typeof FontWeights];

export const FontFamilies = {
  thin: "AvenirNext-UltraLight",
  ultraLight: "AvenirNext-UltraLight",
  light: "AvenirNext-UltraLight",
  regular: "AvenirNext-Regular",
  medium: "AvenirNext-Medium",
  semibold: "AvenirNext-DemiBold",
  bold: "AvenirNext-Bold",
  heavy: "AvenirNext-Heavy",
  black: "AvenirNext-Heavy",
} as const;
export type FontFamily = typeof FontFamilies[keyof typeof FontFamilies];

const createFont = ({
  fontSize = FontSizes.NORMAL,
  color,
  fontWeight = FontWeights.REGULAR,
}: {
  fontSize?: FontSize;
  color: string;
  fontWeight?: FontWeight;
}) => {
  return { fontSize, color, fontWeight };
};

export const colors = {
  background: "#1f1f1f",
  surface: "#272727",
  primary: "#cdad58",
  text: "#ffffff",
  textMeta: "#939393",

  white: "#fff",
  black: "#000",
};

export const styles = {
  container: { flex: 1, backgroundColor: colors.background },

  textInput: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS_SM,
    padding: spacing("lg"),
    fontSize: FontSizes.NORMAL,
    color: colors.text,
    flex: 1,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS_SM,
    padding: spacing("lg"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: createFont({
    fontSize: FontSizes.NORMAL,
    color: "#000000",
  }),

  textPrimary: createFont({ color: colors.primary }),
  textMeta: createFont({ color: colors.textMeta }),
  text: createFont({ color: colors.text }),

  titleLarge: createFont({
    fontSize: FontSizes.LARGE,
    color: colors.text,
    fontWeight: FontWeights.BOLD,
  }),
} as StyleProp<any>;
