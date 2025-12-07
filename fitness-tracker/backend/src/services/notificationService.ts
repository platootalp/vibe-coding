import { getChannel } from '../config/rabbitmq';

interface NotificationPayload {
  userId: number;
  type: string;
  title: string;
  content: string;
  payload?: any;
}

const sendNotification = async (notification: NotificationPayload): Promise<void> => {
  try {
    const channel = getChannel();
    const queue = 'notifications';
    
    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });
    
    // Send the notification to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(notification)), {
      persistent: true
    });
    
    console.log(`Notification sent to queue: ${queue}`);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export { sendNotification, NotificationPayload };