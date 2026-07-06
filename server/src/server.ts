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
