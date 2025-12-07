import express from 'express';
import { 
  getNutritionLogs,
  getNutritionLog,
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog,
  getFoods,
  getMeals,
  getNutritionSummary
} from '../controllers/nutritionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.route('/foods')
  .get(getFoods);

router.route('/meals')
  .get(getMeals);

// Protected routes
router.route('/logs')
  .get(protect, getNutritionLogs)
  .post(protect, createNutritionLog);

router.route('/logs/:id')
  .get(protect, getNutritionLog)
  .put(protect, updateNutritionLog)
  .delete(protect, deleteNutritionLog);

router.route('/summary')
  .get(protect, getNutritionSummary);

export default router;