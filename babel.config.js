module.exports = function (api) {
  const isProduction = api.env("production");

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ...(isProduction ? ["transform-remove-console"] : []),
      "react-native-reanimated/plugin",
    ],
  };
};
