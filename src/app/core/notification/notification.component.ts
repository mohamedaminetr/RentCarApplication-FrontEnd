import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NotificationService, AppNotification } from '../../services/notification.service';

@Component({
  selector: 'rentcar-notification',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  public notificationService = inject(NotificationService);
  
  @Output() public close = new EventEmitter<void>();

  public get notifications() {
    return this.notificationService.notifications();
  }

  public get unreadCount() {
    return this.notificationService.unreadCount();
  }

  public markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  public markAllRead(): void {
    this.notificationService.markAllRead();
  }

  public onClose(): void {
    this.close.emit();
  }
}
