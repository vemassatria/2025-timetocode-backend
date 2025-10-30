// jest.config.mjs

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // 1. PERUBAHAN UTAMA: Gunakan preset ESM (ES Module)
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  // 2. Arahkan ts-jest ke tsconfig.test.json
  transform: {
    '^.+\\.m?[tj]s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        // 'useESM' sudah otomatis 'true' dengan preset di atas
      },
    ],
  },

  // 3. PENTING untuk "moduleResolution": "NodeNext"
  // Ini membantu Jest menyelesaikan impor yang memiliki ekstensi .js
  // (cth: import ... from '../services/LogicGateService.js')
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // 4. Sisa konfigurasi Anda
  testMatch: [
    '**/tests/**/*.test.ts', // Pastikan ini menunjuk ke folder tes Anda
  ],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};
