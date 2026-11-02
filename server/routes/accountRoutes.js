import express from 'express';
import { getBalance, getRecipients } from '../controllers/accountController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/balance', requireAuth, getBalance);
router.get('/recipients', getRecipients);

export default router;
