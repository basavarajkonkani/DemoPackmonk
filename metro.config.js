const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// On web, stub out the reanimated validate-worklets script that
// tries to require 'semver/functions/satisfies' (a native-only concern)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    moduleName.includes('validate-worklets-version')
  ) {
    return {
      filePath: path.resolve(__dirname, 'stubs/empty.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
