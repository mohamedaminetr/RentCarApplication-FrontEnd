import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { VehicleService } from '../services/vehicle.service';
import { BookingService } from '../services/booking.service';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'rentcar-homepage',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
  imports: [RouterOutlet, CommonModule, MatIconModule],
})
export class CoreComponent implements OnInit {
  public path = '';
  private vehicleService = inject(VehicleService);
  private bookingService = inject(BookingService);
  
  // States for real counts
  public vehicleCount = signal<number>(0);
  public bookingCount = signal<number>(0);
  
  public navItems = computed(() => {
    const role = this.auth.currentUser()?.role;
    const base = [
      { id: 'home', label: 'Dashboard', route: '/home', badge: null, icon: 'dashboard' },
      { id: 'calendar', label: 'Calendar', route: '/calendar', badge: null, icon: 'calendar_today' },
      {
        id: 'vehicles',
        label: 'Vehicles',
        route: '/vehicles',
        badge: this.vehicleCount() > 0 ? this.vehicleCount().toString() : null,
        icon: 'directions_car',
      },
      {
        id: 'bookings',
        label: 'Bookings',
        route: '/bookings',
        badge: this.bookingCount() > 0 ? this.bookingCount().toString() : null,
        icon: 'receipt_long',
      },
      { id: 'settings', label: 'Settings', route: '/settings', badge: null, icon: 'settings' },
    ];
    // Admin‑only items
    if (role === 'admin') {
      base.push(
                { id: 'revenue', label: 'Revenue', route: '/revenue', badge: null, icon: 'payments' },
        { id: 'analytics', label: 'Analytics', route: '/analytics', badge: null, icon: 'bar_chart' }
      );
    }
    return base;
  });

  public auth = inject(AuthService);
  public router = inject(Router);

  public async ngOnInit(): Promise<void> {
    this.path = this.router.url;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.path = event.url;
      });

    // Fetch real stats
    this.refreshStats();
  }

  private async refreshStats(): Promise<void> {
    const [v, b] = await Promise.all([
      this.vehicleService.getVehicles(),
      this.bookingService.getBookings(),
    ]);
    this.vehicleCount.set(v.length);
    this.bookingCount.set(b.filter((bk: any) => bk.status === 'Pending').length); // Or total, but 'Pending' makes more sense for a badge
  }

  public isMobileMenuOpen = false;

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  public selectedNavChanges(navId: string): void {
    const nav = this.navItems().find((n) => n.id === navId);
    if (nav) {
      this.router.navigate([nav.route]);
      this.closeMobileMenu();
    }
  }

  public isSelected(path: string): boolean {
    return this.path === path || this.path.startsWith(path + '/');
  }
}
