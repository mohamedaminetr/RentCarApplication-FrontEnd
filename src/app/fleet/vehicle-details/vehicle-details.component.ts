import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Vehicle } from '../fleet.component';

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule, MatIconModule],
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss'],
})
export class VehicleDetailsComponent {
  @Input() vehicle!: Vehicle;
  @Output() close = new EventEmitter<void>();

  public onCancel() {
    this.close.emit();
  }

  public get statusLabel(): string {
    if (this.vehicle.status === 'service') return 'In Service';
    return this.vehicle.status.charAt(0).toUpperCase() + this.vehicle.status.slice(1);
  }

  public get statusClass(): string {
    return 'badge-' + this.vehicle.status;
  }

  public formatMileage(km: number): string {
    return km.toLocaleString() + ' km';
  }

  public formatCurrency(n: number): string {
    return '$' + n.toLocaleString();
  }

  public utilizationColor(pct: number): string {
    if (pct >= 75) return 'fill-gold';
    if (pct >= 50) return 'fill-green';
    if (pct >= 30) return 'fill-blue';
    return 'fill-red';
  }
}
