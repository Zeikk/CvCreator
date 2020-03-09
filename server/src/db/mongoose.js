const mongoose = require('mongoose')
const logSymbols = require('log-symbols')

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log(logSymbols.success, 'MongoDB Connected'))
	.catch(err => console.log(err))
