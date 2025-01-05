import express from 'express';
import {
  obtainAllPayments,
  getPaymentById,
  processPayment,
  getAllPaymentsByClinicId
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', obtainAllPayments);
router.get('/:id', getPaymentById);
router.post('/', processPayment);
router.get('/clinic/:clinicId', getAllPaymentsByClinicId);

export default router;