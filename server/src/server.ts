import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import apiUsersRouter from './routes/users'
import apiProductsRouter from './routes/products'
import prisma from './db/prisma'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(cors())
app.use(express.json())
app.use(cookieparser())
app.use('/api/users', apiUsersRouter)
app.use('/api/products', apiProductsRouter)

async function createAdmin(){
  const adminPassword : string = await bcrypt.hash(process.env.ADMIN_PASSWORD || "", 10) 
  const adminEmail : string = process.env.ADMIN_EMAIL || ""

  await prisma.userCart.upsert({
    where: { 
        email: adminEmail 
      },
      update: {}, 
      create: {  
        name: "admin",
        email: adminEmail,
        password: adminPassword,
      }
    })
}

createAdmin()

app.get('/health', (req : Request, res : Response ) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`)
});
