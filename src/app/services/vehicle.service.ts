import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Vehicle, VehicleStatus } from '../models/vehicle.model';

export type VehicleFilter = 'all' | VehicleStatus;

export interface VehicleStats {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

@Injectable({ providedIn: 'root' })
export class VehicleService extends BaseApiService {
  public async getVehicles(): Promise<Vehicle[]> {
    return await firstValueFrom(this.get<Vehicle[]>('/vehicles'));
  }

  public async getVehicleById(id: any): Promise<Vehicle> {
    return await firstValueFrom(this.get<Vehicle>(`/vehicles/${id}`));
  }

  public async createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return await firstValueFrom(this.post<Vehicle>('/vehicles', vehicle));
  }

  public async updateVehicle(id: any, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return await firstValueFrom(this.put<Vehicle>(`/vehicles/${id}`, vehicle));
  }

  public async deleteVehicle(id: any): Promise<void> {
    await firstValueFrom(this.delete<any>(`/vehicles/${id}`));
  }

  public filterVehicles(
    vehicles: Vehicle[],
    filter: VehicleFilter,
    searchQuery: string,
  ): Vehicle[] {
    return vehicles.filter((v) => {
      const matchFilter = filter === 'all' || v.status === filter;
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  public getStats(vehicles: Vehicle[]): VehicleStats[] {
    return [
      {
        label: 'Total Vehicles',
        value: vehicles.length.toString(),
        change: 'Real-time data',
        up: true,
      },
      {
        label: 'Available Now',
        value: vehicles.filter((v) => v.status === 'Available').length.toString(),
        change: 'Live',
        up: true,
      },
      {
        label: 'Currently Rented',
        value: vehicles.filter((v) => v.status === 'Rented').length.toString(),
        change: 'Live',
        up: true,
      },
      {
        label: 'Reserved',
        value: vehicles.filter((v) => v.status === 'Reserved').length.toString(),
        change: 'Live',
        up: true,
      },
      {
        label: 'Maintenance',
        value: vehicles.filter((v) => v.status === 'Maintenance').length.toString(),
        change: 'Live',
        up: false,
      },
    ];
  }
}
