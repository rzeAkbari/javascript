const fs = require('fs')
const db = require('./db')
const http = require('http')
const mime = require('mime')
const path = require('path')
const broadcast = require('./broadcast')

const server = http.createServer(function (req, res) {
  if (req.url === '/push-subscribe' && req.method === 'POST') {
    req.on('data', (chunk) => {
      insertToDB(chunk)
      res.writeHead(200)
      return res.end()
    })
  }

  if (req.url === '/broadcast') {
    broadcast()
    res.writeHead(200)
    return res.end()
  }

  if (req.url === '/' || req.url === '/index.html') {
    readFileFromPath('./', 'index.html', res)
  }

  if (req.url.match(/bundle.*/)) {
    readFileFromPath('./dist', req.url, res)
  }

  if (req.url === '/service-worker.js') {
    readFileFromPath('./dist', 'service-worker.js', res)
  }

  if (req.url.match(/workbox/)) {
    readFileFromPath('./dist', new RegExp(/workbox/), res)
  }

  if (req.url === '/app.webmanifest') {
    readFileFromPath('', 'app.webmanifest', res)
  }

  if (req.url.match(/\/static\/*/)) {
    const matchFile = req.url.match(/\/static\/(.+[png|mp4|webp])/)
    const fileName = matchFile ? matchFile[1] : ''

    readFileFromPath('./assets', fileName, res)
  }
})

function insertToDB(chunk) {
  const subscription = JSON.parse(chunk)
  db.remove({}, { multi: true }, function (err, numRemoved) {
    db.insert(subscription)
  })
}

function readFileFromPath(searchPath, searchName, res) {
  const filePath = path.join(__dirname, searchPath, searchName)
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, 'fileNotFound')
      return res.end()
    }
    res.setHeader('Content-Type', mime.getType(filePath))
    res.writeHead(200)
    res.write(data)
    return res.end()
  })
}

server.listen(8000)
