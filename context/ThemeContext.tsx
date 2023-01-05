import React, { createContext } from "react";
import { styles, colors } from "../styles";
import { Colors, Theme, ThemeStyle } from "../types/styles";

export const ThemeContext = createContext({
  themeStyle: "dark" as ThemeStyle,
  theme: {} as Theme,
  colors: {} as Colors,
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContext.Provider
      value={{ themeStyle: "dark", theme: styles, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
