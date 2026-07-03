import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import apiUsersRouter from './routes/users'
import apiProductsRouter from './routes/products'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(cors())
app.use(express.json())
app.use(cookieparser())
app.use('/api/users', apiUsersRouter)
app.use('/api/products', apiProductsRouter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`)
});
