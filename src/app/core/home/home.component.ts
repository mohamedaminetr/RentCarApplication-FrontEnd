import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppAuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { TopbarComponent } from '../topbar/topbar.component';
import { BookingService } from '../../services/booking.service';
import { VehicleService } from '../../services/vehicle.service';
import { Booking } from '../../models/booking.model';
import { Vehicle } from '../../models/vehicle.model';
import { computed, signal, OnInit } from '@angular/core';

@Component({
  selector: 'rentcar-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule, TitleCasePipe, MatIcon, TopbarComponent],
})
export class HomeComponent implements OnInit {
  public router = inject(Router);
  public auth = inject(AppAuthService);
  private bookingService = inject(BookingService);
  private vehicleService = inject(VehicleService);

  public x: number = 0;
  public today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  public allVehicles = signal<Vehicle[]>([]);
  public allBookings = signal<Booking[]>([]);

  public async ngOnInit(): Promise<void> {
    const vTask = this.vehicleService.getVehicles();
    const bTask = this.bookingService.getBookings();

    const [vehicles, bookings] = await Promise.all([vTask, bTask]);
    this.allVehicles.set(vehicles);
    this.allBookings.set(bookings);
  }

  public stats = computed(() => {
    const v = this.allVehicles();
    const b = this.allBookings();

    const totalVehicles = v.length;
    const activeRentals = v.filter((vec) => vec.status === 'rented').length;

    let totalRevenue = 0;
    b.forEach((bk) => {
      if (bk.status === 'Completed' || bk.status === 'Confirmed') {
        const amt = parseFloat(String(bk.amount).replace(/[^0-9.-]+/g, '')) || 0;
        totalRevenue += amt;
      }
    });

    const pendingReturns = b.filter((bk) => bk.status === 'Pending').length;

    return [
      { label: 'Total Vehicle', value: totalVehicles.toString(), change: 'Live', up: true },
      { label: 'Active Rentals', value: activeRentals.toString(), change: 'Live', up: true },
      {
        label: 'Total Revenue',
        value: '$' + totalRevenue.toLocaleString(),
        change: 'Live',
        up: true,
      },
      { label: 'Pending Bookings', value: pendingReturns.toString(), change: 'Live', up: false },
    ];
  });

  public vehicleList = computed(() => {
    return this.allVehicles().slice(0, 4);
  });

  public bookingsList = computed(() => {
    return this.allBookings()
      .slice(-4)
      .reverse()
      .map((b) => ({
        initials: b.initials || 'CB',
        name: b.clientName,
        vehicleName: b.vehicleName,
        amount:
          '$' + (parseFloat(String(b.amount).replace(/[^0-9.-]+/g, '')) || 0).toLocaleString(),
      }));
  });

  public quickActions = [
    {
      label: 'New',
      title: 'Add Booking',
      route: '/bookings',
      queryParams: { action: 'new' },
      icon: 'add_circle',
    },
    {
      label: 'Vehicle',
      title: 'Add Vehicle',
      route: '/vehicles',
      queryParams: { action: 'new' },
      icon: 'directions_car',
    },
    {
      label: 'Client',
      title: 'Add Client',
      route: '/clients',
      queryParams: { action: 'new' },
      icon: 'person_add',
    },
    {
      label: 'Reports',
      title: 'Analytics',
      route: '/analytics',
      queryParams: {},
      icon: 'insights',
    },
    {
      label: 'Schedule',
      title: 'Calendar',
      route: '/calendar',
      queryParams: {},
      icon: 'calendar_today',
    },
    { label: 'System', title: 'Settings', route: '/settings', queryParams: {}, icon: 'settings' },
  ];

  public selectVehicle(v: Vehicle): void {
    this.router.navigate(['/vehicles'], { queryParams: { vehicleId: v.id } });
  }

  public logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
