// @ts-nocheck
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import vitePluginRequire from 'vite-plugin-require';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ['**/*.{tsx,ts,jsx,js}'],
    }),
    eslint(),
    tsconfigPaths(),
    vitePluginRequire.default({ fileRegex: /(config.js)$/ }),
  ],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'vege-foods',
      fileName: (format) => `vege-foods.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
