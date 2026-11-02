import express from 'express';
import { login, changePin, logout, unlockAccount } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/change-pin', requireAuth, changePin);
router.post('/logout', requireAuth, logout);
router.post('/unlock', unlockAccount);

export default router;
