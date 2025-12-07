import { Request, Response } from 'express';
import DeviceSync from '../models/DeviceSync';

// @desc    Sync data from wearable device
// @route   POST /api/devices/sync
// @access  Private
export const syncDeviceData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceType, deviceId, syncData } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // Create or update device sync record
    const [deviceSync, created] = await DeviceSync.findOrCreate({
      where: { userId, deviceType, deviceId },
      defaults: {
        userId,
        deviceType,
        deviceId,
        syncData,
        lastSyncedAt: new Date()
      }
    });

    if (!created) {
      // Update existing record
      deviceSync.syncData = syncData;
      deviceSync.lastSyncedAt = new Date();
      await deviceSync.save();
    }

    res.status(201).json({
      id: deviceSync.id,
      userId: deviceSync.userId,
      deviceType: deviceSync.deviceType,
      deviceId: deviceSync.deviceId,
      lastSyncedAt: deviceSync.lastSyncedAt,
      message: 'Device data synced successfully'
    });
  } catch (error) {
    console.error('Device sync error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get device sync history
// @route   GET /api/devices/sync
// @access  Private
export const getDeviceSyncHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const deviceSyncs = await DeviceSync.findAll({
      where: { userId },
      order: [['lastSyncedAt', 'DESC']],
      limit: 10
    });

    res.status(200).json(deviceSyncs);
  } catch (error) {
    console.error('Get device sync history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific device sync data
// @route   GET /api/devices/sync/:deviceId
// @access  Private
export const getDeviceSyncData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { deviceId } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const deviceSync = await DeviceSync.findOne({
      where: { userId, deviceId }
    });

    if (!deviceSync) {
      res.status(404).json({ message: 'Device sync data not found' });
      return;
    }

    res.status(200).json(deviceSync);
  } catch (error) {
    console.error('Get device sync data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};