import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['tournament-pairings'] })],
    build: {
      sourcemap: true
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: true
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      TanStackRouterVite({
        routesDirectory: './src/renderer/src/routes',
        generatedRouteTree: './src/renderer/src/routeTree.gen.ts'
      }),
      nodePolyfills({
        // Configure specific polyfills if needed
        globals: {
          Buffer: true,
          process: true
        }
      })
    ],
    build: {
      sourcemap: true
    }
  }
})
