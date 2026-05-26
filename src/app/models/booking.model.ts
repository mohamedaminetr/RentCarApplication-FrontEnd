export type DialogMode =
  | 'new'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'start'
  | 'complete'
  | 'cancel'
  | null;

export class Booking {
  id: any = 0;
  _id?: string;
  initials: string = '';
  clientName: string = '';
  bookingId: string = '';
  vehicleName: string = '';
  plate: string = '';
  pickup: string = '';
  returnDate: string = '';
  status: 'Pending' | 'Approved' | 'Active' | 'Completed' | 'Canceled' | 'Expired' = 'Pending';
  amount: string | number = '0.00';

  constructor(data?: Partial<Booking>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
