import * as SecureStore from 'expo-secure-store'
import type { StateStorage } from 'zustand/middleware'

// expo-router's static web export pre-renders in Node, where SecureStore's
// web shim (backed by localStorage) has nothing to talk to and throws.
const isServer = typeof window === 'undefined'

/**
 * Adapts expo-secure-store to zustand's persist StateStorage interface so the
 * auth token survives app restarts without living in plain AsyncStorage.
 */
export const secureStorage: StateStorage = {
  getItem: (name) => (isServer ? Promise.resolve(null) : SecureStore.getItemAsync(name)),
  setItem: (name, value) => (isServer ? Promise.resolve() : SecureStore.setItemAsync(name, value)),
  removeItem: (name) => (isServer ? Promise.resolve() : SecureStore.deleteItemAsync(name)),
}
