module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-safe-area-context|react-native-screens|react-native-svg|lucide-react-native|react-native-size-matters)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
