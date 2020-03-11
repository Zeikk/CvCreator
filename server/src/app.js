const path = require("path")
const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')
const cvRouter = require('./routers/cv')

const app = express()
const viewsPath = path.join(__dirname, "./views");

app.set("view engine", "ejs");
app.set("views", viewsPath);

// Website under Maintenance
// app.use((req, res, next) => {
// 	res.status(503).send('We are currently under maintenance')
// })
app.use(cors())
app.use(express.json())
app.use('/', require('./routers/index'))
app.use(userRouter)
app.use(cvRouter)

module.exports = app