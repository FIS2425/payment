import express from 'express';
import { obtainAllPlans,obtainPlanById} from '../controllers/planController.js';
const router = express.Router();

router.get('/', obtainAllPlans);
router.get('/:id', obtainPlanById);

export default router;
