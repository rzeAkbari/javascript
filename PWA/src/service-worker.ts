/** @format */
/// <reference lib="webworker" />

import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import * as navigationPreload from 'workbox-navigation-preload'
import { precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

navigationPreload.enable()

const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: 'navigations',
  }),
)
/*
 *************** Background Sync ***********************************
 */
const bgSyncPlugin = new BackgroundSyncPlugin('pocQueue', {
  maxRetentionTime: 24 * 60,
})

registerRoute(navigationRoute)

registerRoute(
  ({ url }) => url.pathname.startsWith('/static'),
  new NetworkFirst({
    cacheName: 'static-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      bgSyncPlugin,
    ],
  }),
)

/*
 *************** Periodic Background Sync ***********************************
 */
self.addEventListener('periodicSync', (event) => {
  if ('tag' in event && event.tag === 'poc-sync') {
    console.log('Im syncing periodically')
  }
})

/*
 *************** Push Notification ***********************************
 */
self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.showNotification('ContentFlow', {
      body: event.data.text(), //2k of data can be received
      icon: '/static/icon.512x512.png',
    }),
  )
})
