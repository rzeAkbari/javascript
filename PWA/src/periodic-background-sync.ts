export async function askBackgroundSyncPermission() {
  const status = await navigator.permissions.query({
    name: <any>'periodic-background-sync',
  })
  if (status.state === 'granted') {
    console.log('periodic background sync granted!')

    const registration = await navigator.serviceWorker.ready
    if ('periodicSync' in registration) {
      try {
        const periodicSync = registration.periodicSync as { register: any }

        await periodicSync.register('poc-sync', {
          // An interval of one day.
          minInterval: 24 * 60 * 60 * 1000,
        })
      } catch (error) {
        console.log('periodic background sync can not be used')
      }
    }
  } else {
    console.log('periodic background sync is not granted')
  }
}
