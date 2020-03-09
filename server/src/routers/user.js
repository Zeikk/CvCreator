const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const CryptoJS =  require('crypto-js')
const bcrypt = require('bcryptjs')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {

	if(req.body.password != req.body.password2){
		console.log("error pwd")
		res.status(400).send(error)
		
	}
	
	const user = new User(req.body)
	try {
		await user.save()
		//sendWelcomeEmail(user.email, user.firstname)
		const token = await user.generateAuthToken()
		const id = await CryptoJS.AES.encrypt(user.id, 'grainDeSel').toString()
		console.log("Welcome")
		res.status(201).send({
			login: 'true',
			id: id
		})
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
})

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		)
		const token = await user.generateAuthToken()
		const id = await CryptoJS.AES.encrypt(user.id, 'grainDeSel').toString()

		res.status(201).send({
			login: 'true',
			id: id
		})
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
})

//Test login
/*router.post('/users/login', async (req, res) => {
	
	res.status(201).send(true)
})*/

// Upload avatar for user
const upload = multer({
	limits: {
		fileSize: 2000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
			return cb(new Error('File must be an image'))
		}
		cb(undefined, true)
	}
})
router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		try {
			const buffer = await sharp(req.file.buffer)
				.resize({
					width: 250,
					height: 250
				})
				.png()
				.toBuffer()
			req.user.avatar = buffer
			await req.user.save()
			res.send('Avatar updated successfully')
		} catch (error) {}
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message })
	}
)

/*router.post('/users/logout', async (req, res) => {

	console.log(req.user)
	console.log(req.body)
	try {
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token !== req.token
		})
		await req.user.save()

		res.status(201).send({
			login: 'false',
			token: null
		})
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
})*/

router.post('/users/logout', async (req, res) => {

	var bytes  = CryptoJS.AES.decrypt(req.body.id, 'grainDeSel');
	const id =  bytes.toString(CryptoJS.enc.Utf8);
	try {
		const user = await User.findById(id)

		if (!user) {
			throw new Error()
		}

		res.status(201).send({
			login: 'false',
			id: false
		})
	} catch (error) {
		console.log(error)
		res.status(404).send(error)
	}
})

router.post('/users/logoutAll', async (req, res) => {
	
	try {
		req.user.tokens = []
		await req.user.save()

		res.send('You logged out successfully')
	} catch (error) {
		res.status(500).send()
	}
})

router.post('/users/profil', async (req, res) => {

	var bytes  = CryptoJS.AES.decrypt(req.body.id, 'grainDeSel');
	const id =  bytes.toString(CryptoJS.enc.Utf8);

	try {
		const user = await User.findById(id)

		if (!user)
			throw new Error()
		

		res.status(200).send(user)
	} catch (error) {
		console.log(error)
		res.status(404).send()
	}
})

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (!user || !user.avatar) {
			throw new Error()
		}

		res.set('Content-Type', 'image/png')
		res.send(user.avatar)
	} catch (error) {
		res.status(404).send()
	}
})

router.post('/users/profil/infos',  async(req, res) => {

	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'firstname', 'id']
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) 
		throw new Error()
	
	var bytes  = CryptoJS.AES.decrypt(req.body.id, 'grainDeSel');
	const id =  bytes.toString(CryptoJS.enc.Utf8);

	try {
		const user = await User.findById(id)

		if (!user && user.name == req.body.name && user.firstname == req.body.firstname) 
			throw new Error()

		await User.findByIdAndUpdate(id, { name:  req.body.name, firstname: req.body.firstname})

		updates.forEach(update => (user[update] = req.body[update]))
		res.status(200).send({user: user})
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
})

router.post('/users/profil/adresse',  async(req, res) => {

	const updates = Object.keys(req.body)
	const allowedUpdates = ['id', 'email', 'email2', 'password']
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) 
		throw new Error()

	try {

		var bytes  = CryptoJS.AES.decrypt(req.body.id, 'grainDeSel');
		const id =  bytes.toString(CryptoJS.enc.Utf8);

		const user = await User.findById(id)
		console.log(user)
		const isMatch = await bcrypt.compare(req.body.password, user.password)
		console.log(isMatch)
		if (!user || !isMatch || user.email == req.body.email || req.body.email != req.body.email2) 
			throw new Error()

		await User.findByIdAndUpdate(user.id, { email:  req.body.email})

		user.email = req.body.email

		res.status(200).send({user: user})
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
})

router.patch('/users/me', async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'email', 'password', 'firstname']
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	)

	var bytes  = CryptoJS.AES.decrypt(req.body.id, 'grainDeSel');
	const id =  bytes.toString(CryptoJS.enc.Utf8);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' })
	}

	try {
		
		const user = await User.findById(id)
		updates.forEach(update => (req.user[update] = req.body[update]))
		await req.user.save()

		res.send(req.user)
	} catch (error) {
		res.status(400).send(error)
	}
})

router.delete('/users/me', auth, async (req, res) => {
	try {
        if (req.user.role === 1 || req.user._id == req.token._id) {
            await req.user.remove()
            sendCancelationEmail(req.user.email, req.user.firstname)
            res.send(req.user)
        } else {
			res.status(404).send()
		}
	} catch (error) {
		res.status(500).send()
	}
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined
	try {
		if (req.user.role === 1 || req.user._id == req.token._id) {
			await req.user.save()
			res.send(req.user)
		} else {
			res.status(404).send()
		}
	} catch (error) {
		res.status(500).send()
	}
})

module.exports = router
