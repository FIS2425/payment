import express from 'express';
import { 
  registerClinic,
  obtainAllClinics,
  deleteClinic,
  getclinicById,
  updateClinic 
} from '../controllers/clinicController.js';

const router = express.Router();

router.post('/', registerClinic);
router.get('/', obtainAllClinics);
router.delete('/:id', deleteClinic);
router.get('/:id', getclinicById);
router.put('/:id', updateClinic);

export default router;
