import express from 'express';
import { obtainAllPlans} from '../controllers/planController.js';
const router = express.Router();

router.get('/obtainAllPlans', obtainAllPlans);

export default router;
