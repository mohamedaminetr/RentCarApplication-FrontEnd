import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { VehicleService, VehicleFilter } from '../../services/vehicle.service';
import { Vehicle, VehicleStatus } from '../../models/vehicle.model';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'rentcar-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
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
export class VehicleComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  public router = inject(Router);
  public auth = inject(AuthService);

  // State
  public vehicles = signal<Vehicle[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public searchQuery = signal<string>('');
  public activeFilter = signal<VehicleFilter>('all');

  // Computed
  public filteredVehicles = computed(() => {
    let vehicles = this.vehicles();

    // If client, only show Available cars
    if (this.auth.currentUser()?.role === 'client') {
      vehicles = vehicles.filter((v) => v.status === 'Available');
    }

    const filtered = this.vehicleService.filterVehicles(
      vehicles,
      this.activeFilter(),
      this.searchQuery(),
    );
    // Sort by last created first (descending by created_at)
    return filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  });

  public stats = computed(() => {
    return this.vehicleService.getStats(this.vehicles());
  });

  public utilization = computed(() => {
    return [...this.vehicles()].sort((a, b) => b.utilization - a.utilization);
  });

  public viewMode: 'grid' | 'list' = 'grid';
  public showAddModal = false;
  public selectedVehicle: Vehicle | null = null;
  public viewModeDetails: 'view' | 'edit' = 'view';
  public isDeleting = false;

  public route = inject(ActivatedRoute);

  public async ngOnInit(): Promise<void> {
    await this.loadVehicles();
    this.route.queryParams.subscribe((params: any) => {
      if (params['action'] === 'new') {
        this.showAddModal = true;
      }
      if (params['vehicleId']) {
        const id = Number(params['vehicleId']);
        const found = this.vehicles().find((v) => v.id === id);
        if (found) {
          this.selectVehicle(found, 'view');
        }
      }
    });
  }

  public async loadVehicles(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.vehicleService.getVehicles();
      this.vehicles.set(data);
      this.isLoading.set(false);
    } catch (err) {
      this.error.set('Failed to load vehicles');
      this.isLoading.set(false);
    }
  }

  public selectVehicle(v: Vehicle, mode: 'view' | 'edit' = 'view', isDeletion = false): void {
    this.selectedVehicle = v;
    this.viewModeDetails = mode;
    this.isDeleting = isDeletion;
  }

  public closeDetails(): void {
    this.selectedVehicle = null;
    this.isDeleting = false;
    this.viewModeDetails = 'view';
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
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

  public snackBar = inject(MatSnackBar);
  public notificationService = inject(NotificationService);

  public async onVehicleAdd(vehicle: any): Promise<void> {
    try {
      const newVehicle = await this.vehicleService.createVehicle(vehicle);
      this.vehicles.update((list) => [newVehicle, ...list]);
      this.showAddModal = false;
      this.snackBar.open('Vehicle added successfully!', 'Close', { duration: 3000 });
      this.notificationService.add(
        'New Vehicle Added',
        `Vehicle ${newVehicle.name} has been added.`,
        'success',
        'directions_car',
      );
    } catch (err) {
      this.error.set('Failed to add vehicle');
    }
  }

  public async onVehicleUpdate(id: any, vehicle: Partial<Vehicle>): Promise<void> {
    try {
      const updated = await this.vehicleService.updateVehicle(id, vehicle);
      this.vehicles.update((list) => list.map((v) => (v.id === id ? updated : v)));
      this.closeDetails();
      this.snackBar.open('Vehicle updated successfully!', 'Close', { duration: 3000 });
    } catch (err) {
      this.error.set('Failed to update vehicle');
    }
  }

  public async onVehicleDelete(id: any): Promise<void> {
    try {
      await this.vehicleService.deleteVehicle(id);
      this.vehicles.update((list) => list.filter((v) => v.id !== id));
      this.closeDetails();
      this.snackBar.open('Vehicle deleted successfully!', 'Close', { duration: 3000 });
    } catch (err) {
      this.error.set('Failed to delete vehicle');
    }
  }

  public utilizationColor(pct: number): string {
    if (pct >= 75) return 'fill-gold';
    if (pct >= 50) return 'fill-green';
    if (pct >= 30) return 'fill-blue';
    return 'fill-red';
  }

  public handlePrimaryAction(v: Vehicle): void {
    if (v.status === 'Available') {
      this.router.navigate(['/bookings'], { queryParams: { action: 'new', plate: v.plate } });
    } else {
      this.router.navigate(['/vehicle', v.id]);
    }
  }

  public primaryAction(v: Vehicle): string {
    if (v.status === 'Available') return 'Rent Now';
    if (v.status === 'Rented') return 'View Rental';
    return 'View Service';
  }

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
}
