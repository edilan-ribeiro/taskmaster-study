import express from 'express'
import dbConnection from './database/connection'
import taskListRoute  from './routes/tasks/taskListRoute'

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/tasks', taskListRoute)


dbConnection().then(() => {
	app.listen(PORT, () => console.log(`Servidor em execução em http://localhost:${PORT}/`))
})
