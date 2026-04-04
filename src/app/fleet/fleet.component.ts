import { Component, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';

export type VehicleStatus = 'available' | 'rented' | 'service';

export interface Vehicle {
  id: string;
  plate: string;
  name: string;
  type: string;
  year: number;
  ratePerDay: number;
  mileage: number;
  fuel: string;
  status: VehicleStatus;
  returnDate?: string;
  readyDate?: string;
  utilization: number;
}

@Component({
  selector: 'rentcar-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TitleCasePipe],
})
export class FleetComponent {
  searchQuery = '';
  activeFilter: 'all' | VehicleStatus = 'all';
  viewMode: 'grid' | 'list' = 'grid';

  stats = [
    { label: 'Total Vehicles', value: '24', change: '↑ 2 added this month', up: true },
    { label: 'Available Now', value: '11', change: '46% of fleet', up: true },
    { label: 'Currently Rented', value: '10', change: '↑ 3 vs last week', up: true },
    { label: 'In Service', value: '3', change: '2 overdue', up: false },
  ];

  vehicles: Vehicle[] = [
    {
      id: '1',
      plate: 'TN · 2847 AB',
      name: 'Mercedes S-Class',
      type: 'Luxury Sedan',
      year: 2023,
      ratePerDay: 180,
      mileage: 14200,
      fuel: 'Diesel',
      status: 'available',
      utilization: 88,
    },
    {
      id: '2',
      plate: 'TN · 1193 CD',
      name: 'BMW 7 Series',
      type: 'Executive Sedan',
      year: 2022,
      ratePerDay: 175,
      mileage: 28500,
      fuel: 'Diesel',
      status: 'rented',
      returnDate: 'Apr 06',
      utilization: 71,
    },
    {
      id: '3',
      plate: 'TN · 5521 EF',
      name: 'Porsche Cayenne',
      type: 'Luxury SUV',
      year: 2023,
      ratePerDay: 210,
      mileage: 9800,
      fuel: 'Petrol',
      status: 'service',
      readyDate: 'Apr 08',
      utilization: 34,
    },
    {
      id: '4',
      plate: 'TN · 7734 GH',
      name: 'Audi A8',
      type: 'Luxury Sedan',
      year: 2022,
      ratePerDay: 165,
      mileage: 22100,
      fuel: 'Hybrid',
      status: 'available',
      utilization: 58,
    },
    {
      id: '5',
      plate: 'TN · 3312 IJ',
      name: 'Range Rover Sport',
      type: 'Premium SUV',
      year: 2023,
      ratePerDay: 220,
      mileage: 6400,
      fuel: 'Petrol',
      status: 'rented',
      returnDate: 'Apr 10',
      utilization: 76,
    },
    {
      id: '6',
      plate: 'TN · 9901 KL',
      name: 'Lexus LS 500',
      type: 'Luxury Sedan',
      year: 2022,
      ratePerDay: 155,
      mileage: 18750,
      fuel: 'Hybrid',
      status: 'available',
      utilization: 62,
    },
  ];

  serviceSchedule = [
    {
      name: 'Porsche Cayenne',
      detail: 'Engine maintenance · TN · 5521 EF',
      date: 'In service',
      dotClass: 'dot-red',
    },
    { name: 'BMW 7 Series', detail: 'Annual inspection due', date: 'Apr 15', dotClass: 'dot-gold' },
    { name: 'Range Rover Sport', detail: 'Tire rotation', date: 'Apr 20', dotClass: 'dot-gold' },
    { name: 'Audi A8', detail: 'Oil change', date: 'May 02', dotClass: 'dot-blue' },
    { name: 'Mercedes S-Class', detail: 'Full service', date: 'May 18', dotClass: 'dot-green' },
  ];

  constructor(
    public router: Router,
    @Inject(AuthService) public auth: AuthService,
  ) {}

  get filteredVehicles(): Vehicle[] {
    return this.vehicles.filter((v) => {
      const matchFilter = this.activeFilter === 'all' || v.status === this.activeFilter;
      const matchSearch =
        v.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.plate.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  get utilization(): Vehicle[] {
    return [...this.vehicles].sort((a, b) => b.utilization - a.utilization);
  }

  setFilter(f: 'all' | VehicleStatus): void {
    this.activeFilter = f;
  }
  setView(v: 'grid' | 'list'): void {
    this.viewMode = v;
  }

  formatMileage(km: number): string {
    return km.toLocaleString() + ' km';
  }
  formatCurrency(n: number): string {
    return '$' + n.toLocaleString();
  }

  utilizationColor(pct: number): string {
    if (pct >= 75) return 'fill-gold';
    if (pct >= 50) return 'fill-green';
    if (pct >= 30) return 'fill-blue';
    return 'fill-red';
  }

  primaryAction(v: Vehicle): string {
    if (v.status === 'available') return 'Rent Now';
    if (v.status === 'rented') return 'View Rental';
    return 'View Service';
  }
  public logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
