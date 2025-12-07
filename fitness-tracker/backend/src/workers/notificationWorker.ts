import amqp from 'amqplib';
import dotenv from 'dotenv';
import Notification from '../models/Notification';
import { connectRabbitMQ, getChannel } from '../config/rabbitmq';

dotenv.config();

const NOTIFICATION_QUEUE = 'notifications';

// Process notification from queue
const processNotification = async (msg: amqp.ConsumeMessage | null) => {
  if (!msg) return;

  try {
    // Parse the notification data
    const notificationData = JSON.parse(msg.content.toString());
    console.log('Processing notification:', notificationData);

    // Create notification in database
    const notification = await Notification.create({
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      content: notificationData.content,
      payload: notificationData.payload,
      sentAt: new Date(),
    });

    console.log('Notification created:', notification.id);
    
    // Acknowledge the message
    getChannel().ack(msg);
  } catch (error) {
    console.error('Error processing notification:', error);
    
    // Reject the message and requeue it
    getChannel().nack(msg, false, true);
  }
};

// Start the notification worker
const startNotificationWorker = async () => {
  try {
    // Connect to RabbitMQ
    await connectRabbitMQ();
    
    const channel = getChannel();
    
    // Assert the queue
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
    
    // Set prefetch to 1 to ensure fair dispatch
    channel.prefetch(1);
    
    console.log('Notification worker is waiting for messages...');
    
    // Consume messages from the queue
    channel.consume(NOTIFICATION_QUEUE, processNotification, { noAck: false });
  } catch (error) {
    console.error('Error starting notification worker:', error);
  }
};

export { startNotificationWorker };