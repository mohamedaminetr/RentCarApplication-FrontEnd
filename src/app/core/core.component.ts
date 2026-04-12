import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AppAuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'rentcar-homepage',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
  imports: [RouterOutlet, CommonModule, MatIconModule],
})
export class CoreComponent implements OnInit {
  public path = '';

  public navItems = [
    { id: 'home', label: 'Dashboard', route: '/home', badge: null, icon: 'dashboard' },
    { id: 'vehicles', label: 'Vehicles', route: '/vehicles', badge: '24', icon: 'directions_car' },
    { id: 'bookings', label: 'Bookings', route: '/bookings', badge: '7', icon: 'receipt_long' },
    { id: 'clients', label: 'Clients', route: '/clients', badge: '142', icon: 'group' },
    { id: 'revenue', label: 'Revenue', route: '/revenue', badge: null, icon: 'payments' },
    { id: 'analytics', label: 'Analytics', route: '/analytics', badge: null, icon: 'bar_chart' },
    { id: 'settings', label: 'Settings', route: '/settings', badge: null, icon: 'settings' },
  ];

  public auth = inject(AppAuthService);
  public router = inject(Router);

  public ngOnInit(): void {
    this.path = this.router.url;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.path = event.url;
      });
  }

  public isMobileMenuOpen = false;

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  public selectedNavChanges(navId: string): void {
    const nav = this.navItems.find((n) => n.id === navId);
    if (nav) {
      this.router.navigate([nav.route]);
      this.closeMobileMenu();
    }
  }

  public isSelected(path: string): boolean {
    return this.path === path || this.path.startsWith(path + '/');
  }
}
