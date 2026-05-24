import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const firebaseDir = path.resolve(__dirname, 'node_modules/firebase');

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Force a single copy of firebase. Without this, files under ../shared/
    // resolve firebase from the repo-root node_modules (different version),
    // which breaks the modular SDK ("Service firestore is not available").
    dedupe: ['firebase', '@firebase/app', '@firebase/firestore', '@firebase/auth', '@firebase/messaging', '@firebase/storage'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared'),
      firebase: firebaseDir,
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/messaging', 'firebase/storage'],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});
