import { Schema } from 'mongoose'
import { Task } from '../taskModel'

const simpleNoteSchema = new Schema({
	noteContent: { type: String, required: true },
})

export const simpleNote = Task.discriminator('simpleNote', simpleNoteSchema)
