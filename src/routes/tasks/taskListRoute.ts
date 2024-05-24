import express from 'express'
import { Task } from '../../database/models/tasks/taskModel'
import mongoose, { SortOrder } from 'mongoose'

const router = express.Router()

router.get('/', async (req, res) => {
	const { userId, order, limit, offset } = req.query

	const sortOrder: SortOrder = order === 'desc' ? -1 : 1

	try {
		if (userId) {
			const tasks = await Task.find({ userId: userId })
				.sort({ createdAt: sortOrder })
				.limit(Number(limit))
				.skip(Number(offset))

			res.status(200).json(tasks)
		} else {
			res.status(404).json({ message: 'User not found' })
		}
	} catch (err) {
		console.error(`Error retrieving data : ${err}`)
		res.status(500).json({ message: 'Server failed to fetch the data' })
	}
})

router.get('/:id', async (req, res) => {
	const taskId = req.params.id

	if (!mongoose.Types.ObjectId.isValid(taskId)) {
		return res.status(400).json({ message: 'Invalid task ID' })
	}

	try {
		const getTask = await Task.findById({_id: taskId})

		if (getTask) {
			res.status(200).json(getTask)
		} else {
			res.status(404).json({ message: 'Task not found' })
		}
	} catch (err) {
		console.error(`Error getting id data : ${err}`)
		res.status(500).json({ message: 'Failed to get the task' })
	}
})

router.put('/:id', async (req, res) => {
	const taskId = req.params.id

	const { isArchived } = req.body

	if (!mongoose.Types.ObjectId.isValid(taskId)) {
		return res.status(400).json({ message: 'Invalid task ID' })
	}

	try {
		const archiveTask = await Task.findByIdAndUpdate(
			taskId,
			{ isArchived: isArchived },
			{ new: true, runValidators: true }
		)

		if (archiveTask) {
			res.status(200).json(archiveTask)
		} else {
			res.status(404).json({ message: 'Task not found' })
		}
	} catch (err) {
		console.error(`Error editing data : ${err}`)
		res.status(500).json({ message: 'Failed to archive record' })
	}
})

router.delete('/:id', async (req, res) => {
	const taskId = req.params.id

	if (!mongoose.Types.ObjectId.isValid(taskId)) {
		return res.status(400).json({ message: 'Invalid task ID' })
	}

	try {
		const deleteTask = await Task.findByIdAndDelete({ _id: taskId })

		if (deleteTask) {
			res.status(200).json({ message: 'Task removed from database!' })
		} else {
			res.status(404).json({ message: 'Task not found' })
		}
	} catch (err) {
		console.error(`Error deleting data : ${err}`)
		res.status(500).json({ message: 'Failed to delete record' })
	}
})

export default router
