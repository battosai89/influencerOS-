const notificationService = {
  show: (notification: { message: string; type: 'info' | 'success' | 'warning' | 'error' }) => {
    console.log(`Sending ${notification.type} notification: ${notification.message}`);
  },
  sendNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    console.log(`Sending ${type} notification: ${message}`);
  },
  getNotifications: () => {
    return [];
  },
};

export default notificationService;