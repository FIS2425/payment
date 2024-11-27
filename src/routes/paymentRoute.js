import express from 'express';
import { registerPayment,
  obtainAllPayments,
  deletePayment,
  getPaymentById,
  processPayment
} from '../controllers/paymentController.js';
import { 
  registerClinic,
  obtainAllClinics,
  deleteClinic,
  getclinicById,
  updateClinic
} from '../controllers/clinicController.js';

const router = express.Router();

router.post('/registerPayment', registerPayment);
router.get('/obtainAllPayments', obtainAllPayments);
router.delete('/deletePayment/:id', deletePayment);
router.get('/getPaymentById/:id', getPaymentById);
router.post('/registerClinic', registerClinic);
router.get('/obtainAllClinic', obtainAllClinics);
router.delete('/deleteClinic/:id', deleteClinic);
router.get('/getclinicById/:id', getclinicById);
router.put('/updateClinic/:id', updateClinic);
router.post('/payment', processPayment);

export default router;
