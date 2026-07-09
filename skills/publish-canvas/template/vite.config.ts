import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The single bridge: `cursor/canvas` resolves to the open-source
      // Mantine-backed shim so the canvas builds outside the Cursor IDE.
      'cursor/canvas': '@thisismydesign/cursor-canvas-web',
    },
  },
});
