import express from 'express';
import { 
  getWorkoutPlans, 
  getWorkoutPlan, 
  createWorkoutPlan, 
  updateWorkoutPlan, 
  deleteWorkoutPlan,
  getWorkoutTypes
} from '../controllers/workoutPlanController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.route('/types')
  .get(getWorkoutTypes);

// Protected routes
router.route('/')
  .get(protect, getWorkoutPlans)
  .post(protect, createWorkoutPlan);

router.route('/:id')
  .get(protect, getWorkoutPlan)
  .put(protect, updateWorkoutPlan)
  .delete(protect, deleteWorkoutPlan);

export default router;