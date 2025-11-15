import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';

import {
  getCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin
} from '../controllers/coin.controller.js';

const router = Router();

// PUBLIC ROUTES
router.get('/', getCoins);
router.get('/:id', getCoinById);

// ADMIN ROUTES
router.post(
  '/',
  adminAuth,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'rearImage', maxCount: 1 }
  ]),
  createCoin
);

router.put(
  '/:id',
  adminAuth,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'rearImage', maxCount: 1 }
  ]),
  updateCoin
);

router.delete('/:id', adminAuth, deleteCoin);

export default router;