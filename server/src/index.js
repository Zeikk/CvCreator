const app = require('./app')
const logSymbols = require('log-symbols')

const port = process.env.PORT

app.listen(port, () => {
	console.log(logSymbols.success, 'Server is up on port ' + port)
})
