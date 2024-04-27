import type { ContextBridgeApi } from '../../preload/index'

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}
