import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

@Component({
  selector: 'rentcar-notification',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  @Output() close = new EventEmitter<void>();

  notifications: AppNotification[] = [
    {
      id: '1',
      icon: 'check_circle',
      title: 'Booking Confirmed',
      message: 'Mercedes E-Class booking #B-8832 is now active.',
      time: '2m ago',
      unread: true,
      type: 'success',
    },
    {
      id: '2',
      icon: 'warning',
      title: 'Payment Overdue',
      message: 'Client Karim Ayari has an outstanding balance of $320.',
      time: '45m ago',
      unread: true,
      type: 'warning',
    },
    {
      id: '3',
      icon: 'person_add',
      title: 'New Client Registered',
      message: 'Sonia Ben Ali just created a new account.',
      time: '2h ago',
      unread: false,
      type: 'info',
    },
    {
      id: '4',
      icon: 'car_repair',
      title: 'Maintenance Alert',
      message: 'Porsche Cayenne is due for service in 140km.',
      time: '5h ago',
      unread: false,
      type: 'alert',
    },
  ];

  markAsRead(id: string): void {
    const notify = this.notifications.find((n) => n.id === id);
    if (notify) notify.unread = false;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => (n.unread = false));
  }

  onClose(): void {
    this.close.emit();
  }
}
