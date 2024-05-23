import express from 'express'
import { User } from '../../../database/models/userModel'
import { Task } from '../../../database/models/tasks/taskModel'
import { simpleNote } from '../../../database/models/tasks/taskTypes/simpleNote'

const router = express.Router()

router.post('/new', async (req, res) => {
	const { taskName, taskDescription, expiration, taskType, userId, noteContent } = req.body

	if (taskType !== 'simpleNote') {
		res.status(400).json({ message: 'Task type not allowed on this route' })
	}

	try {
		const checkUser = await User.findById(userId)

		if (checkUser) {
			const isDuplicated = await Task.findOne({ taskName })

			if (isDuplicated) {
				res.status(409).json({
					message: 'Task name already exists, please change the task name',
				})
			} else {
				let expirationData = {}

				if (expiration.expires !== undefined) {
					expirationData = {
						expires: expiration.expires,
						date: expiration.date,
					}
				}

				const newNote = await simpleNote.create({
					taskName,
					taskDescription,
					expiration: expirationData,
					taskType,
					userId,
					noteContent,
				})

				res.status(200).json(newNote)
			}
		}
	} catch (err) {
		res.status(500).json({ message: 'Failed to create the simple note' })
	}
})

router.put('/edit/:id', async (req, res) => {
	const taskId = req.params.id

	const { taskName, taskDescription, expiration, taskType, userId, noteContent } = req.body

	if (taskType !== 'simpleNote') {
		res.status(400).json({ message: 'Task type not allowed on this route' })
	}

	try {
		const noteExists = await Task.findById(taskId)

		if (!noteExists) {
			res.status(404).json({ message: 'This simple note was not found' })
		} else {
			let expirationData = {}

			if (expiration.expires !== undefined) {
				expirationData = {
					expires: expiration.expires,
					date: expiration.date,
				}
			}

			const editNote = await simpleNote.findByIdAndUpdate(
				taskId,
				{
					taskName,
					taskDescription,
					expiration: expirationData,
					taskType,
					userId,
					noteContent,
				},
				{ new: true }
			)

			res.status(200).json(editNote)
		}
	} catch (err) {
		res.status(500).json({ message: 'Failed to edit this simple note' })
	}
})

export default router
