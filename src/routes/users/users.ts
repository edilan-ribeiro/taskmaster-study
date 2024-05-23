import express from 'express'
import { User } from '../../database/models/userModel'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', async (req, res) => {
	const { email } = req.body

	try {
		const userData = await User.findOne({email})

		if (!userData) {
			res.status(404).json({ message: 'User not found' })
		} else {
			res.status(200).json(userData)
		}
	} catch (err) {
		console.error(`Error fetching user data : ${err}`)
		res.status(500).json({ message: 'Failed to get user data' })
	}
})

router.post('/new', async (req, res) => {
	const { name, email } = req.body

	try {
		const checkMail = await User.findOne({email})

		if (checkMail) {
			res.status(409).json({ message: 'User already exists' })
		} else {
			const createUser = await User.create({
				name,
				email,
			})

			res.status(200).json(createUser)
		}
	} catch (err) {
		console.error(`Error creating user data : ${err}`)
		res.status(500).json({ message: 'Failed to create user' })
	}
})

router.put('/edit', async (req, res) => {
	const { userId, name, email } = req.body

	try {
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(409).json({ message: 'Invalid user' })
		} else {
			const checkDuplicatedMail = await User.findOne({ email, _id: { $ne: userId }})

			if (checkDuplicatedMail) {
				res.status(409).json({ message: 'Email is already in use, try another' })
			} else {
				const editUser = await User.findByIdAndUpdate(userId, {
					name,
					email,
				}, {new: true})

				res.status(200).json(editUser)
			}
		}
	} catch (err) {
		console.error(`Error editing user data : ${err}`)
		res.status(500).json({ message: 'Failed to edit user' })
	}
})

router.delete('/remove', async (req, res) => {
	const { userId } = req.body

	try {
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(409).json({ message: 'Invalid user' })
		} else {
			await User.deleteOne(userId)

			res.status(200).json({ message: 'User removed' })
		}
	} catch (err) {
		console.error(`Error erasing user data : ${err}`)
		res.status(500).json({ message: 'Failed to delete user' })
	}
})

export default router
