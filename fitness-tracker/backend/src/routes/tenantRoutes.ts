import express from 'express';
import { 
  createTenant, 
  getTenants, 
  getTenantById, 
  updateTenant, 
  deleteTenant 
} from '../controllers/tenantController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All tenant routes require authentication and admin role
router.route('/')
  .post(authenticate, authorizeRoles('admin'), createTenant)
  .get(authenticate, authorizeRoles('admin'), getTenants);

router.route('/:id')
  .get(authenticate, authorizeRoles('admin'), getTenantById)
  .put(authenticate, authorizeRoles('admin'), updateTenant)
  .delete(authenticate, authorizeRoles('admin'), deleteTenant);

export default router;