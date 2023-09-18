/** @format */

import { askBackgroundSyncPermission } from './periodic-background-sync'
import { askPusNotificationPermission } from './push-notification'
import { register } from './service-worker-register'
import './style.css'

let currentItem = 'item-1'

function slideShow() {
  const buttonRight = document.querySelector('#button-right')
  const buttonLeft = document.querySelector('#button-left')
  buttonRight.addEventListener('click', rightClick)
  buttonLeft.addEventListener('click', leftClick)
}

function rightClick() {
  switch (currentItem) {
    case 'item-1':
      currentItem = 'item-2'
      break
    case 'item-2':
      currentItem = 'item-3'
      break
    case 'item-3':
      currentItem = 'item-1'
      break
    default:
      break
  }

  const activeElement = document.querySelector(`#${currentItem}`)
  activeElement.scrollIntoView({ behavior: 'smooth' })
}

function leftClick() {
  switch (currentItem) {
    case 'item-1':
      currentItem = 'item-3'
      break
    case 'item-2':
      currentItem = 'item-1'
      break
    case 'item-3':
      currentItem = 'item-2'
      break
    default:
      break
  }

  const activeElement = document.querySelector(`#${currentItem}`)
  activeElement.scrollIntoView({ behavior: 'smooth' })
}

register().then(() => {
  console.log('setup push and sync')

  askPusNotificationPermission()
  askBackgroundSyncPermission()
})
slideShow()
