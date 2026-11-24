import express from 'express';
import {
  getRazorpayKey,
  createOrder,
  verifyPayment,
  getAllPayments,
} from '../controllers/payment.controller.js';

const router = express.Router();

// GET /api/payment/get-key -> Frontend ko public key_id bhejne ke liye
router.get('/get-key', getRazorpayKey);

// POST /api/payment/create-order -> Naya order create karne ke liye
router.post('/create-order', createOrder);

// POST /api/payment/verify -> Payment signature verify karne ke liye
router.post('/verify', verifyPayment);

// GET /api/payment/all -> Saare transactions ki list dekhne ke liye
router.get('/all', getAllPayments);

export default router;