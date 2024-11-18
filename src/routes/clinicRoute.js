import express from 'express';
import { 
  registerClinic,
  obtainAllClinics,
  deleteClinic,
  getclinicById,
  updateClinic 
} from '../controllers/clinicController.js';

const router = express.Router();

router.post('/registerClinic', registerClinic);
router.get('/obtainAllClinic', obtainAllClinics);
router.delete('/deleteClinic/:id', deleteClinic);
router.get('/getclinicById/:id', getclinicById);
router.put('/updateClinic/:id', updateClinic);

export default router;
