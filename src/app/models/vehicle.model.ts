export type VehicleStatus = 'Available' | 'Reserved' | 'Rented' | 'Maintenance';

export class Vehicle {
  public id: any = 0;
  public _id?: string;
  public plate: string = '';
  public name: string = '';
  public type: string = '';
  public year: number = 0;
  public ratePerDay: number = 0;
  public mileage: number = 0;
  public fuel: string = '';
  public status: VehicleStatus = 'Available';
  public utilization: number = 0;
  public image: string = '';
  public returnDate: string = '';
  public readyDate: string = '';
  public created_at: Date | string = '';
  constructor(data?: Partial<Vehicle>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
