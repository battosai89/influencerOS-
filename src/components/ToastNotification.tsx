import { useEffect } from 'react';
import { Notification } from '../types';

interface ToastNotificationProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const ToastNotification = ({ notifications, removeNotification }: ToastNotificationProps) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 space-y-4">
      {notifications.map((notification: Notification) => (
        <Toast key={notification.id} notification={notification} onDismiss={() => removeNotification(notification.id)} />
      ))}
    </div>
  );
};

const Toast = ({ notification, onDismiss }: { notification: Notification; onDismiss: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  const typeStyles = {
    success: 'bg-green-500/20 text-green-300 border-green-700',
    error: 'bg-red-500/20 text-red-300 border-red-700',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-700',
    info: 'bg-blue-500/20 text-blue-300 border-blue-700',
  };

  return (
    <div className={`w-full max-w-sm p-4 rounded-lg border shadow-lg animate-toast-in ${typeStyles[notification.type]}`}>
      <p className="font-semibold text-white">{notification.message}</p>
    </div>
  );
};

export default ToastNotification;
