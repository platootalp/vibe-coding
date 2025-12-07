import express from 'express';
import { 
  getSystemStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAuditLogs
} from '../controllers/adminController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorizeRoles('admin'));

// Get system statistics
router.route('/stats')
  .get(getSystemStats);

// Get all users (paginated)
router.route('/users')
  .get(getAllUsers);

// Get, update, or delete a specific user
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Get audit logs
router.route('/audit-logs')
  .get(getAuditLogs);

export default router;