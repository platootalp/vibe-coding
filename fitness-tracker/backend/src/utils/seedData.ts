import Tenant from '../models/Tenant';
import User from '../models/User';

// Seed default tenants and users
export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if tenants already exist
    const tenantCount = await Tenant.count();
    if (tenantCount > 0) {
      console.log('Tenants already exist, skipping seeding');
      return;
    }

    // Create default tenants
    const defaultTenant = await Tenant.create({
      name: 'Default Fitness Studio',
      subdomain: 'default'
    });

    const premiumTenant = await Tenant.create({
      name: 'Premium Fitness Studio',
      subdomain: 'premium'
    });

    console.log('Created default tenants');

    // Create default admin user for default tenant
    await User.create({
      tenantId: defaultTenant.id,
      name: 'Admin User',
      email: 'admin@default.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create default coach user for default tenant
    await User.create({
      tenantId: defaultTenant.id,
      name: 'Coach User',
      email: 'coach@default.com',
      password: 'coach123',
      role: 'coach'
    });

    // Create default regular user for default tenant
    await User.create({
      tenantId: defaultTenant.id,
      name: 'Regular User',
      email: 'user@default.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Created default users');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};