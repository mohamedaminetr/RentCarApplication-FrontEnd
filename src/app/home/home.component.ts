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
    {
      label: 'New',
      title: 'Add Booking',
      route: '/bookings/new',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    },
    {
      label: 'Fleet',
      title: 'Add Vehicle',
      route: '/fleet/new',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/></svg>`,
    },
    {
      label: 'Client',
      title: 'Add Client',
      route: '/clients/new',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
    },
    {
      label: 'Reports',
      title: 'Analytics',
      route: '/analytics',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    },
    {
      label: 'Schedule',
      title: 'Calendar',
      route: '/calendar',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    },
    {
      label: 'System',
      title: 'Settings',
      route: '/settings',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
    },
  ];

  constructor(
    public router: Router,
    @Inject(AuthService) public auth: AuthService,
  ) {}

  public logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
