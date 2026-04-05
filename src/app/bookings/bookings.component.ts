import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingDetailsComponent } from './bookings-dialog/booking-details.component';
import { TopbarComponent } from '../core/topbar/topbar.component';

// ── Shared interface ──────────────────────────────────────────────────────────
export interface Booking {
  initials: string;
  clientName: string;
  bookingId: string;
  carName: string;
  plate: string;
  pickup: string;
  return: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  amount: string;
}

export type DialogMode = 'new' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, MatIconModule, BookingDetailsComponent, TopbarComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsComponent {
  currentFilter = 'All';

  // Dialog state
  dialogMode: DialogMode = null;
  selectedBooking: Booking | null = null;

  get filteredBookings(): Booking[] {
    if (this.currentFilter === 'All') return this.mockBookings;
    return this.mockBookings.filter((b) => b.status === this.currentFilter);
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  // ── Open helpers ──────────────────────────────────────────────────────────
  openNewBooking() {
    this.selectedBooking = null;
    this.dialogMode = 'new';
  }

  openEditBooking(booking: Booking) {
    this.selectedBooking = { ...booking };
    this.dialogMode = 'edit';
  }

  openDeleteBooking(booking: Booking) {
    this.selectedBooking = { ...booking };
    this.dialogMode = 'delete';
  }

  // ── Dialog event handlers ─────────────────────────────────────────────────
  onDialogClose() {
    this.dialogMode = null;
    this.selectedBooking = null;
  }

  onDialogSave(booking: Booking) {
    if (this.dialogMode === 'new') {
      const names = booking.clientName.trim().split(' ');
      booking.initials = (names[0]?.[0] ?? '').toUpperCase() + (names[1]?.[0] ?? '').toUpperCase();
      this.mockBookings = [...this.mockBookings, booking];
    }

    if (this.dialogMode === 'edit') {
      this.mockBookings = this.mockBookings.map((b) =>
        b.bookingId === booking.bookingId ? { ...b, ...booking } : b,
      );
    }

    if (this.dialogMode === 'delete') {
      this.mockBookings = this.mockBookings.filter((b) => b.bookingId !== booking.bookingId);
    }

    this.onDialogClose();
  }

  mockBookings: Booking[] = [
    {
      initials: 'JD',
      clientName: 'John Doe',
      bookingId: 'BKG-0012',
      carName: 'Mercedes S-Class',
      plate: 'S-777-VIP',
      pickup: '12 Aug, 10:00',
      return: '15 Aug, 10:00',
      status: 'Confirmed',
      amount: '$450',
    },
    {
      initials: 'AS',
      clientName: 'Alice Smith',
      bookingId: 'BKG-0013',
      carName: 'BMW X5',
      plate: 'X-555-SUV',
      pickup: '14 Aug, 12:00',
      return: '20 Aug, 12:00',
      status: 'Pending',
      amount: '$820',
    },
    {
      initials: 'MJ',
      clientName: 'Mike Johnson',
      bookingId: 'BKG-0014',
      carName: 'Audi A6',
      plate: 'A-666-SED',
      pickup: '01 Aug, 09:00',
      return: '05 Aug, 09:00',
      status: 'Completed',
      amount: '$310',
    },
    {
      initials: 'EK',
      clientName: 'Emma King',
      bookingId: 'BKG-0015',
      carName: 'Porsche 911',
      plate: 'P-911-FST',
      pickup: '08 Aug, 14:00',
      return: '10 Aug, 14:00',
      status: 'Cancelled',
      amount: '$600',
    },
  ];
}
