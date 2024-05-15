import express from 'express'
import dbConnection from './database/connection'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
	res.send('teste')
})

dbConnection().then(() => {
	app.listen(PORT, () => console.log(`Servidor em execução em http://localhost:${PORT}/`))
})
