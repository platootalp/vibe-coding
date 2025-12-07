import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import { sequelize } from '../config/db';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Controller', () => {
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });

    // Create a test user
    testUser = await User.create({
      name: 'Profile Test User',
      email: 'profile@test.com',
      password: 'password123'
    });

    // Generate auth token
    authToken = generateToken({
      userId: testUser.id,
      email: testUser.email,
      role: 'user',
      tenantId: 1
    });
  });

  afterAll(async () => {
    // Close database connections
    await sequelize.close();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
    });

    it('should not get profile without authentication', async () => {
      await request(app)
        .get('/api/users/profile')
        .expect(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        age: 25,
        height: 175,
        weight: 70
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.age).toBe(updateData.age);
      expect(response.body.height).toBe(updateData.height);
      expect(response.body.weight).toBe(updateData.weight);
    });

    it('should not update profile without authentication', async () => {
      const updateData = {
        age: 25,
        height: 175,
        weight: 70
      };

      await request(app)
        .put('/api/users/profile')
        .send(updateData)
        .expect(401);
    });
  });
});