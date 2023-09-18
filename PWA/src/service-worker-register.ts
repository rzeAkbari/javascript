/** @format */

export async function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`/service-worker.js`)
        .then((registration) => {
          console.log('SW registered: ', registration)
          Promise.resolve()
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
          Promise.reject(registrationError)
        })
    })
  }
}

interface SyncManager {
  register(tag: string): Promise<void>
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager
  }
}

export async function backgroundSync() {
  if ('SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready
    registration.sync.register('bundle-sync')
  }
}
