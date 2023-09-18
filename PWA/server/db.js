const DataStore = require('nedb')
const path = require('path')

const db = new DataStore({ filename: path.join(__dirname, 'users.db'), autoload: true })

module.exports = db
