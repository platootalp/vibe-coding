import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import workoutRoutes from './routes/workoutRoutes';
import deviceRoutes from './routes/deviceRoutes';
import tenantRoutes from './routes/tenantRoutes';
import healthRoutes from './routes/healthRoutes';
import workoutPlanRoutes from './routes/workoutPlanRoutes';
import nutritionRoutes from './routes/nutritionRoutes';
import socialRoutes from './routes/socialRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import { startNotificationWorker } from './workers/notificationWorker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// Connect to RabbitMQ
connectRabbitMQ().catch(console.error);

// Start notification worker
startNotificationWorker().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});