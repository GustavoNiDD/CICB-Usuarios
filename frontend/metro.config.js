const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Força o publicPath para assets em web builds
config.transformer.publicPath = '/CICB/';

module.exports = config;
