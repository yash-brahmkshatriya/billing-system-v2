import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function scssHmr() {
  return {
    name: 'scssHmr',
    enforce: 'post',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.scss')) {
        server.ws.send({
          type: 'update',
          path: '*',
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), scssHmr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
