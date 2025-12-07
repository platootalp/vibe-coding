import { Request, Response } from 'express';
import Tenant from '../models/Tenant';
import { authorizeRoles } from '../middleware/auth';

// @desc    Create a new tenant
// @route   POST /api/tenants
// @access  Private/Admin
export const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, subdomain } = req.body;

    // Check if tenant with subdomain already exists
    const tenantExists = await Tenant.findOne({ where: { subdomain } });
    if (tenantExists) {
      res.status(400).json({ message: 'Tenant with this subdomain already exists' });
      return;
    }

    // Create tenant
    const tenant = await Tenant.create({
      name,
      subdomain
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private/Admin
export const getTenants = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await Tenant.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(tenants);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tenant by ID
// @route   GET /api/tenants/:id
// @access  Private/Admin
export const getTenantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    res.status(200).json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private/Admin
export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, subdomain } = req.body;

    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    // Check if another tenant with subdomain already exists
    if (subdomain && subdomain !== tenant.subdomain) {
      const tenantExists = await Tenant.findOne({ where: { subdomain } });
      if (tenantExists) {
        res.status(400).json({ message: 'Tenant with this subdomain already exists' });
        return;
      }
    }

    // Update tenant
    tenant.name = name || tenant.name;
    tenant.subdomain = subdomain || tenant.subdomain;
    await tenant.save();

    res.status(200).json(tenant);
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private/Admin
export const deleteTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    // Delete tenant (will cascade to users)
    await tenant.destroy();

    res.status(200).json({ message: 'Tenant removed' });
  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};