import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import UsersRouter from './routes/users'
import ProductsRouter from './routes/products'
import CartsRouter from './routes/carts'
import CouponRouter from './routes/cupons'
import OrderRouter from './routes/pedido'
import {autoverif} from './auth'
import prisma from './db/prisma'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(cors())
app.use(express.json())
app.use(cookieparser())
app.use('/api/users', UsersRouter)
app.use('/autoverif', autoverif, async (req: Request, res: Response) => {
  return res.status(201).json({message: "Created dummy data successfully."})
})
app.use('/produtos', ProductsRouter)
app.use('/carrinho', CartsRouter)
app.use('/cupom', CouponRouter)
app.use('/pedidos', OrderRouter)

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

app.get('/', (req : Request, res : Response ) => {console.log("recebi")
  res.json({ status: 'ok' })})

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`)
});
