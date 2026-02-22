import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setup.test.ts',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,hg,svn}/**',
      '**/*.d.ts',
      '.stryker-tmp/**/*',
      'reports/**/*',
      'coverage/**/*',
      'src/setup.test.ts'
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**.*.d.ts'],
    },
  },
})