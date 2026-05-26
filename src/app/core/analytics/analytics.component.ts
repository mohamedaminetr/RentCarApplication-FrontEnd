import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TopbarComponent } from '../topbar/topbar.component';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, TopbarComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
  private vehicleService = inject(VehicleService);

  public vehicles = signal<Vehicle[]>([]);

  public async ngOnInit(): Promise<void> {
    const v = await this.vehicleService.getVehicles();
    this.vehicles.set(v);
  }

  public stats = computed(() => {
    const v = this.vehicles();

    const totalUtilization = v.reduce((sum, vec) => sum + vec.utilization, 0);
    const avgUtilization = v.length > 0 ? Math.round(totalUtilization / v.length) : 0;

    return {
      utilization: avgUtilization + '%',
      activeUsers: '12', // Placeholder since clients table is gone
      duration: '4.2 Days', 
      satisfaction: '4.8/5', 
    };
  });

  public topVehicles = computed(() => {
    return [...this.vehicles()].sort((a, b) => b.utilization - a.utilization).slice(0, 5);
  });
}
