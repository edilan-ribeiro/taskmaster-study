import express from 'express'
import dbConnection from './database/connection'
import taskListRoute from './routes/tasks/taskListRoute'
import simpleNoteRoute from './routes/tasks/taskTypes/simpleNoteRoute'
import usersRoute from './routes/users/users'
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json";

const app = express()
const PORT = 3000

app.use(express.json())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/user', usersRoute)
app.use('/tasks', taskListRoute)
app.use('/task/simple-note', simpleNoteRoute)


dbConnection().then(() => {
	app.listen(PORT, () => console.log(`Servidor em execução em http://localhost:${PORT}/`))
})
