export interface NotificationAdapter {
  show(title: string, body: string, options?: NotificationOptions): Promise<void>;
  requestPermission(): Promise<NotificationPermission>;
}

export class WebNotificationAdapter implements NotificationAdapter {
  async show(title: string, body: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, ...options });
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission();
  }
}
