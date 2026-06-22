import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiUsersRouter from './routes/users'
import apiProductsRouter from './routes/products'
import prisma from './prisma';
import cookieparser from 'cookie-parser'
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser())

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/users', apiUsersRouter);
app.use('/api/products', apiProductsRouter)

const PORT = process.env.PORT ? Number(process.env.PORT) : 6767;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
