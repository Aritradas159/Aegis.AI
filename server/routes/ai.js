import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chat, interpret, summary } from '../controllers/aiController.js';
import { attachSession } from '../middleware/session.js';

const router = Router();

router.use(attachSession);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.sessionId || 'anonymous',
  validate: { keyGeneratorIpFallback: false },
  message: { message: 'Too many AI requests. Please wait a moment and try again.' }
});

router.use(aiLimiter);
router.post('/chat', chat);
router.post('/interpret', interpret);
router.post('/summary', summary);

export default router;
