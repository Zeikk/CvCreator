const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Cv = require('./cv')

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
			trim: true
		},
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Email is invalid')
				}
			}
		},
		password: {
			type: String,
			required: true,
			minlength: 7,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes('password')) {
					throw new Error('Password cannot contain "password"')
				}
			}
		},
		role: {
			type: Number,
			default: 0
		},
		tokens: [
			{
				token: {
					type: String,
					required: true
				}
			}
		],
		avatar: {
			type: Buffer
		}
	},
	{
		timestamps: true
	}
)

userSchema.virtual('cvs', {
	ref: 'Cv',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
	const user = this
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

	user.tokens = user.tokens.concat({ token })
	await user.save()

	return token
}

userSchema.methods.toJSON = function() {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens
	delete userObject.avatar

	return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email })

	if (!email) {
		throw new Error('Unable to login')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw new Error('Unable to login')
	}

	return user
}

// Hash the pwd before saving
userSchema.pre('save', async function(next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

// Delete User Cvs when user is removed

userSchema.pre('remove', async function(next) {
	const user = this

	await Cv.deleteMany({ owner: user._id })

	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
