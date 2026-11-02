import express from 'express';
import { runTests } from '../controllers/testController.js';

const router = express.Router();

router.post('/run-all', runTests);
router.get('/run-all', runTests);

export default router;
