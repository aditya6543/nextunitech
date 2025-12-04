/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'],
    coverage: {
      provider: 'v8',              // default with @vitest/coverage-v8
      reporter: ['text', 'lcov'],  // will write coverage/lcov.info
        reportsDirectory: 'coverage'
      // no `all` here
    },
    },
})
