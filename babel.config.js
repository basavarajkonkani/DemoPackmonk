module.exports = function (api) {
  api.cache(true);
  const isWeb = process.env.EXPO_TARGET === 'web' || process.env.NODE_ENV === 'production';
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated/plugin must be last; skip on web builds
      ...(isWeb ? [] : ['react-native-reanimated/plugin']),
    ],
  };
};
