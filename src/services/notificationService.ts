import { Notification } from '../types';

class NotificationService {
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private notifications: Notification[] = [];

  private generateId = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  private createNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error', duration?: number): Notification => {
    return {
      id: this.generateId(),
      message,
      type,
      duration: duration || 5000,
      read: false,
      timestamp: new Date()
    };
  };

  public show = (notification: { message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => {
    const newNotification = this.createNotification(notification.message, notification.type, notification.duration);
    this.notifications.push(newNotification);
    this.notifyListeners();

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  };

  public sendNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error', duration?: number) => {
    this.show({ message, type, duration });
  };

  public getNotifications = (): Notification[] => {
    return [...this.notifications];
  };

  public removeNotification = (id: number) => {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  };

  public clearAll = () => {
    this.notifications = [];
    this.notifyListeners();
  };

  public markAsRead = (id: number) => {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  };

  public subscribe = (listener: (notifications: Notification[]) => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  };

  private notifyListeners = () => {
    this.listeners.forEach(listener => listener(this.getNotifications()));
  };

  // Convenience methods for different types
  public success = (message: string, duration?: number) => {
    this.show({ message, type: 'success', duration });
  };

  public error = (message: string, duration?: number) => {
    this.show({ message, type: 'error', duration });
  };

  public warning = (message: string, duration?: number) => {
    this.show({ message, type: 'warning', duration });
  };

  public info = (message: string, duration?: number) => {
    this.show({ message, type: 'info', duration });
  };
}

const notificationService = new NotificationService();

export default notificationService;