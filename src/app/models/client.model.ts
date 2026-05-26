export class Client {
  id: any = 0;
  _id?: string;
  initials: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  rentals: number = 0;
  totalSpent: number = 0;
  status: 'vip' | 'active' | 'inactive' = 'active';
  avatarClass: string = '';

  constructor(data?: Partial<Client>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class RentalRecord {
  car: string = '';
  dates: string = '';
  amount: number = 0;
  days: number = 0;
  vehicleName: string = '';
  dotClass: string = '';

  constructor(data?: Partial<RentalRecord>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class SpendSegment {
  label: string = '';
  amount: number = 0;
  pct: number = 0;

  constructor(data?: Partial<SpendSegment>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
