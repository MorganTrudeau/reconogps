import { colors, styles } from "../styles";

export type ThemeStyle = "light" | "dark";
export type Theme = typeof styles;
export type Colors = typeof colors;

export type ThemeProps = { theme: Theme; colors: Colors };

export type SpacingScale = "xs" | "sm" | "md" | "lg" | "xl";
