import { Component, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'rentcar-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule, TitleCasePipe, MatIcon],
})
export class HomeComponent {
  public x: number = 0;
  today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  stats = [
    { label: 'Total Fleet', value: '24', change: '↑ 2 this month', up: true },
    { label: 'Active Rentals', value: '11', change: '↑ 3 vs last week', up: true },
    { label: 'Revenue (Mar)', value: '$84k', change: '↑ 12% vs Feb', up: true },
    { label: 'Pending Returns', value: '5', change: '↓ due today', up: false },
  ];

  fleet = [
    { name: 'Mercedes S-Class', plate: 'TN · 2847 AB', status: 'available' },
    { name: 'BMW 7 Series', plate: 'TN · 1193 CD', status: 'rented' },
    { name: 'Porsche Cayenne', plate: 'TN · 5521 EF', status: 'maintenance' },
    { name: 'Audi A8', plate: 'TN · 7734 GH', status: 'available' },
  ];

  bookings = [
    { initials: 'KA', name: 'Karim Ayari', car: 'Mercedes S-Class · 3 days', amount: '$540' },
    { initials: 'SB', name: 'Sonia Ben Ali', car: 'BMW 7 Series · 5 days', amount: '$875' },
    { initials: 'MH', name: 'Mohamed Hamdi', car: 'Audi A8 · 2 days', amount: '$320' },
    { initials: 'LT', name: 'Leila Trabelsi', car: 'Porsche Cayenne · 7 days', amount: '$1,470' },
  ];

  quickActions = [
    { label: 'New', title: 'Add Booking', route: '/bookings/new', icon: 'add_circle' },
    { label: 'Fleet', title: 'Add Vehicle', route: '/fleet/new', icon: 'directions_car' },
    { label: 'Client', title: 'Add Client', route: '/clients/new', icon: 'person_add' },
    { label: 'Reports', title: 'Analytics', route: '/analytics', icon: 'insights' },
    { label: 'Schedule', title: 'Calendar', route: '/calendar', icon: 'calendar_today' },
    { label: 'System', title: 'Settings', route: '/settings', icon: 'settings' },
  ];

  constructor(
    public router: Router,
    @Inject(AuthService) public auth: AuthService,
  ) {}

  public logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
