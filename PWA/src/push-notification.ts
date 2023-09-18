import { Buffer } from 'buffer'

export function askPusNotificationPermission() {
  const btnSubscribe = document.getElementById('button-subscribe')
  btnSubscribe.addEventListener('click', () => {
    handleSubscribeClick()
  })
}

async function handleSubscribeClick() {
  if ('showNotification' in ServiceWorkerRegistration['prototype']) {
    const state = await Notification.requestPermission()
    if (state === 'granted') {
      const details = await subscribe()

      try {
        await postSubscription(details)
        const btnPush = document.getElementById('button-push')
        btnPush.style.display = 'block'
        btnPush.addEventListener('click', () => {
          handlePushClick()
        })
      } catch (error) {
        console.error('error connecting to server' + error)
      }
    }
  } else {
    console.log('web push not available')
  }
}

async function handlePushClick() {
  await fetch('/broadcast')
}

async function subscribe(): Promise<PushSubscription> {
  //request push subscription
  const swRegistration = await navigator.serviceWorker.ready
  const details = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true, // this is mandatory true, we can not have silent notifications,
    applicationServerKey:
      'BEZ-sdHnKnYFNf5Hwxs3W06H0wR07peXc2n0ZYWsKZAGcnzT4m-1VEDqbp7xbIfMrEzZPcs2O9zJyC_BeSrhl1s', // public key to be saved on push server with our origin
  })
  console.log('Web push subscribed with details: ', details)

  return details
}

async function postSubscription(details: PushSubscription) {
  const requestInfo: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: details.endpoint,
      keys: {
        auth: arrayBufferToBas64(details.getKey('auth')),
        p256dh: arrayBufferToBas64(details.getKey('p256dh')),
      },
    }),
  }

  await fetch('/push-subscribe', requestInfo)
}

function arrayBufferToBas64(arrayBuffer: ArrayBuffer): string {
  const buffer = Buffer.from(arrayBuffer)

  return buffer.toString('base64')
}
