import express from 'express';
import { register,obtainAll,deleteClinic} from '../controllers/clinicController.js';


const router = express.Router();

router.post('/register', register);
router.get('/obtainAll', obtainAll);
router.delete('/deleteClinic/:id', deleteClinic);

export default router;