const db = require('./db')
const webpush = require('web-push')

const broadcast = function () {
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    'BEZ-sdHnKnYFNf5Hwxs3W06H0wR07peXc2n0ZYWsKZAGcnzT4m-1VEDqbp7xbIfMrEzZPcs2O9zJyC_BeSrhl1s',
    'DHZjDw6mqYasnwcB_OOVb0bHwJZWTghfSzJEZelS9t4',
  )

  db.find({}, function (err, users) {
    users.forEach((user) => {
      const subscription = {
        endpoint: user.endpoint,
        keys: {
          auth: user.keys.auth,
          p256dh: user.keys.p256dh,
        },
      }

      webpush.sendNotification(subscription, 'Can you hear me?')
    })
  })
}

module.exports = broadcast
