import { Injectable, signal, computed } from '@angular/core';

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public notifications = signal<AppNotification[]>([]);
  public unreadCount = computed(() => this.notifications().filter(n => n.unread).length);

  public add(title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info', icon?: string) {
    let defaultIcon = 'info';
    if (type === 'success') defaultIcon = 'check_circle';
    if (type === 'warning') defaultIcon = 'warning';
    if (type === 'alert') defaultIcon = 'error';

    const newNotification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      icon: icon || defaultIcon,
      title,
      message,
      time: 'Just now',
      unread: true,
      type
    };

    this.notifications.update(current => [newNotification, ...current]);
  }

  public markAsRead(id: string) {
    this.notifications.update(current => 
      current.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  }

  public markAllRead() {
    this.notifications.update(current => 
      current.map(n => ({ ...n, unread: false }))
    );
  }

  public clearAll() {
    this.notifications.set([]);
  }
}
