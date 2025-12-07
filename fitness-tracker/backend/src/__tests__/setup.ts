import { sequelize } from '../config/db';

// Increase timeout for database operations
jest.setTimeout(30000);

// Close database connections after all tests
afterAll(async () => {
  await sequelize.close();
});