import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema(
	{
		taskName: { type: String, required: true },
		isArchived: { type: Boolean, required: true, default: false },
		taskDescription: String,
		expiration: {
			expires: Boolean,
			date: Date,
		},
		taskType: { type: String, required: true, enum: ['shoppingList', 'todoList', 'simpleNote'] },
		userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
	},
	{ timestamps: true, discriminatorKey: 'taskType' }
)

export const Task = mongoose.model('Tasks', taskSchema)
