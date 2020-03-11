const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')
const cvRouter = require('./routers/cv')

const app = express()

app.set("view engine", "ejs");

// Website under Maintenance
// app.use((req, res, next) => {
// 	res.status(503).send('We are currently under maintenance')
// })
app.use(cors())
app.use(express.json())
app.use('/', (req, res) => {
render('./pages/index.ejs')
})
app.use(userRouter)
app.use(cvRouter)

module.exports = app