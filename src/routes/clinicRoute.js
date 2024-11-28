import express from 'express';
import { 
  registerClinic,
  obtainAllClinics,
  deleteClinic,
  getclinicById,
  updateClinic 
} from '../controllers/clinicController.js';

import { clinicPermissions } from '../middleware/verifyAuth.js';

const router = express.Router();

router.post('/', clinicPermissions , registerClinic);
router.get('/', obtainAllClinics);
router.delete('/:id', clinicPermissions, deleteClinic);
router.get('/:id', getclinicById);
router.put('/:id', clinicPermissions, updateClinic);

export default router;
