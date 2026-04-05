import { Component, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { TopbarComponent } from '../core/topbar/topbar.component';

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
  image?: string;
}

@Component({
  selector: 'rentcar-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    TitleCasePipe,
    AddVehicleComponent,
    VehicleDetailsComponent,
    TopbarComponent,
  ],
})
export class FleetComponent {
  searchQuery = '';
  activeFilter: 'all' | VehicleStatus = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  showAddModal = false;
  selectedVehicle: Vehicle | null = null;

  public selectVehicle(v: Vehicle) {
    this.selectedVehicle = v;
  }

  public stats = [
    { label: 'Total Vehicles', value: '24', change: '↑ 2 added this month', up: true },
    { label: 'Available Now', value: '11', change: '46% of fleet', up: true },
    { label: 'Currently Rented', value: '10', change: '↑ 3 vs last week', up: true },
    { label: 'In Service', value: '3', change: '2 overdue', up: false },
  ];

  public vehicles: Vehicle[] = [
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
      image:
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
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
      image:
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
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
      image:
        'https://di-uploads-pod2.dealerinspire.com/waltersporsche/uploads/2024/06/2024-porsche-cayenne.jpg',
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
      image:
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800',
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
      image:
        'https://di-uploads-pod11.dealerinspire.com/reevesimportmotorcars/uploads/2019/07/2019-range-rover-sport-1024x588.jpg',
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
      image:
        'https://www.lexus.com.kh/content/dam/lexus-v3-blueprint/models/sedan/ls/ls-500/my21/overview/ls500-overview.jpg.jpg',
    },
  ];

  public serviceSchedule = [
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

  public get filteredVehicles(): Vehicle[] {
    return this.vehicles.filter((v) => {
      const matchFilter = this.activeFilter === 'all' || v.status === this.activeFilter;
      const matchSearch =
        v.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.plate.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  public get utilization(): Vehicle[] {
    return [...this.vehicles].sort((a, b) => b.utilization - a.utilization);
  }

  public setFilter(f: 'all' | VehicleStatus): void {
    this.activeFilter = f;
  }
  public setView(v: 'grid' | 'list'): void {
    this.viewMode = v;
  }

  public formatMileage(km: number): string {
    return km.toLocaleString() + ' km';
  }
  public formatCurrency(n: number): string {
    return '$' + n.toLocaleString();
  }

  public onVehicleAdd(vehicle: Vehicle) {
    this.vehicles.unshift(vehicle);
    this.showAddModal = false;
  }

  public utilizationColor(pct: number): string {
    if (pct >= 75) return 'fill-gold';
    if (pct >= 50) return 'fill-green';
    if (pct >= 30) return 'fill-blue';
    return 'fill-red';
  }

  public primaryAction(v: Vehicle): string {
    if (v.status === 'available') return 'Rent Now';
    if (v.status === 'rented') return 'View Rental';
    return 'View Service';
  }
  public logout(): void {
    // Logout logic is now handled in TopbarComponent
  }
}
