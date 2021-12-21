export default {
  presets: [
    '@reworkjs/core/babel-preset',
  ],
  overrides: [{
    test: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    presets: [
      '@babel/preset-typescript',
    ],
  }],
}
