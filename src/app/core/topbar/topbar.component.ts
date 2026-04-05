import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { MatIcon } from '@angular/material/icon';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'rentcar-topbar',
  standalone: true,
  imports: [CommonModule, MatIcon, NotificationComponent, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Input() title = '';
  @Input() eyebrow = 'Management';
  @Input() searchPlaceholder = 'Search...';
  @Input() searchText = '';
  @Output() searchChange = new EventEmitter<string>();

  isNotificationOpen = false;

  constructor(
    public router: Router,
    @Inject(AuthService) public auth: AuthService,
  ) {}

  toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  closeNotifications(): void {
    this.isNotificationOpen = false;
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
