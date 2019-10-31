const   express = require("express"),
        app = express()

// Middleware
const   bodyParser = require("body-parser"),
        morgan = require("morgan"),
        cors = require("cors")

app.use(cors())
app.use(bodyParser.json())
app.use(morgan("dev"))

// Routes
app.use("/users", require("_/routers/users"))
app.use("/roles", require("_/routers/roles"))

module.exports = app