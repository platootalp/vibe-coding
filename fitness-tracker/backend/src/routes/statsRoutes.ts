import express from 'express';
import { getWorkoutStats, getWeeklyStats } from '../controllers/statsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/workouts').get(protect, getWorkoutStats);
router.route('/weekly').get(protect, getWeeklyStats);

export default router;