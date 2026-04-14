import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NotificationComponent } from '../notification/notification.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'rentcar-topbar',
  standalone: true,
  imports: [CommonModule, MatIcon, NotificationComponent, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Input() public title = '';
  @Input() public eyebrow = 'Management';
  @Input() public searchPlaceholder = 'Search...';
  @Input() public searchText = '';
  @Output() public searchChange = new EventEmitter<string>();

  public auth = inject(AuthService);
  public router = inject(Router);

  public isNotificationOpen = false;

  public toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  public closeNotifications(): void {
    this.isNotificationOpen = false;
  }

  public logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  public onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
