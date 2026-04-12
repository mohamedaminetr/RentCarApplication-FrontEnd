export type DialogMode = 'new' | 'edit' | 'delete' | null;

export class Booking {
  id: number = 0;
  initials: string = '';
  clientName: string = '';
  bookingId: string = '';
  vehicleName: string = '';
  plate: string = '';
  pickup: string = '';
  returnDate: string = '';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' = 'Pending';
  amount: string = '0.00';

  constructor(data?: Partial<Booking>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
