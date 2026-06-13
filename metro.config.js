const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude node_modules from file watching to avoid EMFILE on macOS
config.watchFolders = [];

// Only watch the src directory and root files
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/.*/,
];

module.exports = config;
