<<<<<<< HEAD
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index';
import prisma from './prisma';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api', apiRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 6767;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
=======
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
app.use('/produtos', autoverif, ProductsRouter)
app.use('/carrinho', autoverif, CartsRouter)
app.use('/cupom', autoverif, CouponRouter)
app.use('/pedidos', autoverif, OrderRouter)

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
>>>>>>> e685ec177cbb88baa181bdf755d654eddc20c620
