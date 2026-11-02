import express from 'express';
import { withdraw, deposit, transfer, getHistory } from '../controllers/transactionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/withdraw', requireAuth, withdraw);
router.post('/deposit', requireAuth, deposit);
router.post('/transfer', requireAuth, transfer);
router.get('/history', requireAuth, getHistory);

export default router;
