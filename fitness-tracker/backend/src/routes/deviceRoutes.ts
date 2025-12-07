import express from 'express';
import { syncDeviceData, getDeviceSyncHistory, getDeviceSyncData } from '../controllers/deviceController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.route('/sync').post(authenticate, syncDeviceData);
router.route('/sync').get(authenticate, getDeviceSyncHistory);
router.route('/sync/:deviceId').get(authenticate, getDeviceSyncData);

export default router;