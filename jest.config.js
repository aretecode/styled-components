const { resolve } = require('path')

function resolveTsConfig() {
  return resolve(__dirname, './tsconfig.test.json')
}

const config = {
  globals: {
    "__DEV__": true
  },
  testURL: "http://localhost",
  clearMocks: true,
  roots: [
    "<rootDir>/src/"
  ],
  setupFiles: [
    "raf/polyfill",
    "<rootDir>/src/test/globals.ts"
  ],
  verbose: true,
  setupTestFrameworkScriptFile: require.resolve('./jest/exoticJest.js'),
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  testMatch: [
    '<rootDir>/__tests__/**/*.(j|t)s?(x)',
    '<rootDir>/src/**/__tests__/**/*.(j|t)s?(x)',
    '<rootDir>/src/**/?(*.)(spec|test).(j|t)s?(x)',
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/native",
    "<rootDir>/src/primitives",
    '<rootDir>/__tests__/deps/*.(j|t)s?(x)',
    '<rootDir>/__tests__/fixtures/*.(j|t)s?(x)',
  ],
  transform: {
    '^.+\\.tsx?$': require.resolve('./jest/typescriptTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': require.resolve('./jest/fileTransform.js'),
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
  moduleFileExtensions: [
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'web.js',
    'js',
    'web.jsx',
    'jsx',
    'mjs',
    'json',
    'node',
  ],
  globals: {
    'ts-jest': {
      // @todo may want this to resolve to root/
      tsConfigFile: resolveTsConfig(),
    },
  },
}

process.env.FORCE_TRANSPILE_NODE_MODULES =
  process.env.FORCE_TRANSPILE_NODE_MODULES === undefined
    ? undefined
    : process.env.FORCE_TRANSPILE_NODE_MODULES

if (!process.env.FORCE_TRANSPILE_NODE_MODULES) {
  config.transformIgnorePatterns = [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
  ]
}

module.exports = config
