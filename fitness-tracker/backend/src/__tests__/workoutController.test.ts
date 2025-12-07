import request from 'supertest';
import express from 'express';
import workoutRoutes from '../routes/workoutRoutes';
import { sequelize } from '../config/db';
import User from '../models/User';
import Workout from '../models/Workout';
import { generateToken } from '../utils/jwt';

const app = express();
app.use(express.json());
app.use('/api/workouts', workoutRoutes);

describe('Workout Controller', () => {
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });

    // Create a test user
    testUser = await User.create({
      name: 'Workout Test User',
      email: 'workout@test.com',
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

  describe('POST /api/workouts', () => {
    it('should create a new workout', async () => {
      const workoutData = {
        name: 'Morning Run',
        type: 'running',
        duration: 30,
        calories: 200,
        distance: 5,
        date: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workoutData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(workoutData.name);
      expect(response.body.type).toBe(workoutData.type);
      expect(response.body.duration).toBe(workoutData.duration);
      expect(response.body.calories).toBe(workoutData.calories);
      expect(response.body.distance).toBe(workoutData.distance);
    });

    it('should not create a workout without authentication', async () => {
      const workoutData = {
        name: 'Morning Run',
        type: 'running',
        duration: 30,
        calories: 200,
        distance: 5,
        date: new Date().toISOString()
      };

      await request(app)
        .post('/api/workouts')
        .send(workoutData)
        .expect(401);
    });
  });

  describe('GET /api/workouts', () => {
    it('should get all workouts for the user', async () => {
      // Create a workout first
      await Workout.create({
        userId: testUser.id,
        name: 'Evening Walk',
        type: 'walking',
        duration: 20,
        calories: 100,
        distance: 3,
        date: new Date()
      });

      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('type');
    });

    it('should not get workouts without authentication', async () => {
      await request(app)
        .get('/api/workouts')
        .expect(401);
    });
  });

  describe('PUT /api/workouts/:id', () => {
    let workoutId: number;

    beforeEach(async () => {
      // Create a workout for updating
      const workout = await Workout.create({
        userId: testUser.id,
        name: 'Afternoon Swim',
        type: 'swimming',
        duration: 45,
        calories: 300,
        date: new Date()
      });
      workoutId = workout.id;
    });

    it('should update an existing workout', async () => {
      const updatedData = {
        name: 'Updated Afternoon Swim',
        type: 'swimming',
        duration: 50,
        calories: 350,
        date: new Date().toISOString()
      };

      const response = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.duration).toBe(updatedData.duration);
      expect(response.body.calories).toBe(updatedData.calories);
    });

    it('should not update a workout without authentication', async () => {
      const updatedData = {
        name: 'Updated Afternoon Swim',
        type: 'swimming',
        duration: 50,
        calories: 350,
        date: new Date().toISOString()
      };

      await request(app)
        .put(`/api/workouts/${workoutId}`)
        .send(updatedData)
        .expect(401);
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    let workoutId: number;

    beforeEach(async () => {
      // Create a workout for deleting
      const workout = await Workout.create({
        userId: testUser.id,
        name: 'Night Yoga',
        type: 'yoga',
        duration: 30,
        calories: 150,
        date: new Date()
      });
      workoutId = workout.id;
    });

    it('should delete an existing workout', async () => {
      await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify workout is deleted
      const workout = await Workout.findByPk(workoutId);
      expect(workout).toBeNull();
    });

    it('should not delete a workout without authentication', async () => {
      await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .expect(401);
    });
  });
});