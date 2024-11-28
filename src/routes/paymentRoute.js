import express from 'express';
import {
  obtainAllPayments,
  getPaymentById,
  processPayment
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', obtainAllPayments);
router.get('/:id', getPaymentById);
router.post('/', processPayment);

export default router;
