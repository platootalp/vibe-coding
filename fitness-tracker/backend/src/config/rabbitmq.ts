import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let channel: amqp.Channel | null = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    
    // Handle connection close
    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      channel = null;
    });
    
    // Handle connection error
    connection.on('error', (err: Error) => {
      console.error('RabbitMQ connection error:', err);
      channel = null;
    });
    
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
};

export { connectRabbitMQ, getChannel };