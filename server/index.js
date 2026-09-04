import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import simulationRoutes from './routes/simulations.js';
import learningRoutes from './routes/learning.js';
import aiRoutes from './routes/ai.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();

app.use(helmet());
// In production the frontend and API share one Vercel domain, so this only
// matters for local dev where the Vite client (5173) and this server run on
// different ports. CLIENT_URL is optional — no env vars are required to run
// this app.
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'risk-copilot-api' }));
app.use('/api/simulations', simulationRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/ai', aiRoutes);
app.use(notFound);
app.use(errorHandler);

// app.listen() only runs outside Vercel's serverless runtime. Vercel
// imports this file (via /api/index.js) and invokes the exported `app`
// directly per-request instead of keeping a persistent server process alive.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Risk Copilot API listening on http://localhost:${PORT}`));
}

export default app;
