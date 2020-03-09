const express = require('express')
const Cv = require('../models/cv')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/cvs', auth, async (req, res) => {
	const cv = new Cv({
		...req.body,
		owner: req.user._id
	})

	try {
		await cv.save()
		res.status(201).send(cv)
	} catch (error) {
		res.status(400).send(error)
	}
})

// GET /cvs?completed=true
// GET /cvs?limit=10&skip=20
// GET /cvs?sortBy=createdAt:asc
router.get('/cvs', auth, async (req, res) => {
    const match = {}
    const sort = {}
    
	if (req.query.completed) {
		match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

	try {
		// const cvs = await cv.find({owner: req.user._id})
		// res.send(req.cvs)
		await req.user
			.populate({
				path: 'cvs',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
			})
			.execPopulate()
		res.send(req.user.cvs)
	} catch (error) {
		res.status(500).send()
	}
})

router.get('/cvs/:id', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const cv = await Cv.findOne({ _id, owner: req.user._id })

		if (!cv) {
			return res.status(404).send()
		}

		res.send(cv)
	} catch (error) {
		res.status(500).send()
	}
})

router.patch('/cvs/:id', auth, async (req, res) => {
	const _id = req.params.id
	const updates = Object.keys(req.body)
	const allowedUpdates = ['description', 'completed']
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' })
	}

	try {
		const cv = await Cv.findOne({ _id, owner: req.user._id })

		if (!cv) {
			return res.status(404).send()
		}

		updates.forEach((update) => (cv[update] = req.body[update]))
		await cv.save()

		res.send(cv)
	} catch (error) {
		res.status(400).send(e)
	}
})

router.delete('/cvs/:id', auth, async (req, res) => {
	const _id = req.params.id
	try {
		const cv = await Cv.findOneAndDelete({ _id, owner: req.user._id })

		if (!cv) {
			res.status(404).send()
		}

		res.send(cv)
	} catch (error) {
		res.status(500).send()
	}
})

module.exports = router
