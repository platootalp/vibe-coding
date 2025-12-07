import express from 'express';
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  importWorkouts
} from '../controllers/workoutController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getWorkouts)
  .post(protect, createWorkout)
  .post(protect, importWorkouts); // Add import route

router.route('/:id')
  .get(protect, getWorkoutById)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

export default router;