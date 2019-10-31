const https = require("https")
const fs = require ("fs")

const cfg = require("_/config")
const {mongodb} = require("_/config/another_config")

const mongoose = require("mongoose")
mongoose.connect (mongodb, {useNewUrlParser: true, useUnifiedTopology: true})

const options = {
    key: fs.readFileSync('lib/private/privatekey.pem'),
    cert: fs.readFileSync('lib/private/certificate.pem'),
}

https.createServer(options ,require('_/app')).listen(cfg.port)
console.log("Express server running on port "+cfg.port)