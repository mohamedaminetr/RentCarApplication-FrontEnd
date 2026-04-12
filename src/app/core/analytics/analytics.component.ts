import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TopbarComponent } from '../topbar/topbar.component';
import { VehicleService } from '../../services/vehicle.service';
import { ClientService } from '../../services/client.service';
import { Vehicle } from '../../models/vehicle.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, TopbarComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private clientService = inject(ClientService);

  public vehicles = signal<Vehicle[]>([]);
  public clients = signal<Client[]>([]);

  public async ngOnInit(): Promise<void> {
    const vTask = this.vehicleService.getVehicles();
    const cTask = this.clientService.getClients();
    
    const [v, c] = await Promise.all([vTask, cTask]);
    this.vehicles.set(v);
    this.clients.set(c);
  }

  public stats = computed(() => {
    const v = this.vehicles();
    const c = this.clients();

    const activeUsers = c.filter(client => client.status === 'active' || client.status === 'vip').length;
    const totalUtilization = v.reduce((sum, vec) => sum + vec.utilization, 0);
    const avgUtilization = v.length > 0 ? Math.round(totalUtilization / v.length) : 0;

    return {
      utilization: avgUtilization + '%',
      activeUsers: activeUsers.toString(),
      duration: '4.2 Days', // This technically needs historical booking data length, keeping mocked placeholder structure
      satisfaction: '4.8/5', // Review system mock
    };
  });

  public topVehicles = computed(() => {
    return [...this.vehicles()].sort((a, b) => b.utilization - a.utilization).slice(0, 5);
  });
}
