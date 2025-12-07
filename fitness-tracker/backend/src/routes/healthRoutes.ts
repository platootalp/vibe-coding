import express from 'express';
import { 
  getHealthProfile, 
  updateHealthProfile, 
  getMetricsHistory, 
  addMetricsRecord, 
  updateMetricsRecord, 
  deleteMetricsRecord 
} from '../controllers/healthProfileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Health profile routes
router.route('/profile')
  .get(protect, getHealthProfile)
  .put(protect, updateHealthProfile);

// Metrics history routes
router.route('/metrics-history')
  .get(protect, getMetricsHistory);

// Metrics records routes
router.route('/metrics')
  .post(protect, addMetricsRecord);

router.route('/metrics/:id')
  .put(protect, updateMetricsRecord)
  .delete(protect, deleteMetricsRecord);

export default router;