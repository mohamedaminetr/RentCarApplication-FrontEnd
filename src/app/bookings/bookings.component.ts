import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingDetailsComponent } from './bookings-details/booking-details.component';
import { TopbarComponent } from '../core/topbar/topbar.component';
import { BookingService, BookingFilter } from '../services/booking.service';
import { ClientService } from '../services/client.service';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking, DialogMode } from '../models/booking.model';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, MatIconModule, BookingDetailsComponent, TopbarComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private clientService = inject(ClientService);
  private vehicleService = inject(VehicleService);

  // State
  public bookings = signal<Booking[]>([]);
  public clientsList = signal<any[]>([]);
  public vehiclesList = signal<any[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public currentFilter = signal<BookingFilter>('All');

  // Computed
  public filteredBookings = computed(() => {
    return this.bookingService.filterBookings(this.bookings(), this.currentFilter());
  });

  // Dialog state
  public dialogMode: DialogMode = null;
  public selectedBooking: Booking | null = null;

  private route = inject(ActivatedRoute);

  public async ngOnInit(): Promise<void> {
    await this.loadBookings();
    this.clientService.getClients().then((data) => this.clientsList.set(data));
    this.vehicleService.getVehicles().then((data) => this.vehiclesList.set(data));
    
    this.route.queryParams.subscribe((params: any) => {
      if (params['action'] === 'new') {
        this.openNewBooking();
      }
    });
  }

  public async loadBookings(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.bookingService.getBookings();
      this.bookings.set(data);
      this.isLoading.set(false);
    } catch (err) {
      this.error.set('Failed to load bookings');
      this.isLoading.set(false);
    }
  }

  // ── Open helpers ──────────────────────────────────────────────────────────
  public openNewBooking(): void {
    this.selectedBooking = null;
    this.dialogMode = 'new';
  }

  public openEditBooking(booking: Booking): void {
    this.selectedBooking = { ...booking };
    this.dialogMode = 'edit';
  }

  public openDeleteBooking(booking: Booking): void {
    this.selectedBooking = { ...booking };
    this.dialogMode = 'delete';
  }

  // ── Dialog event handlers ─────────────────────────────────────────────────
  public onDialogClose(): void {
    this.dialogMode = null;
    this.selectedBooking = null;
  }

  public snackBar = inject(MatSnackBar);

  public async onDialogSave(booking: any): Promise<void> {
    try {
      if (this.dialogMode === 'new') {
        const names = booking.clientName.trim().split(' ');
        booking.initials = (names[0]?.[0] ?? '').toUpperCase() + (names[1]?.[0] ?? '').toUpperCase();
        const newBooking = await this.bookingService.createBooking(booking);
        this.bookings.update((list) => [...list, newBooking]);
        this.snackBar.open('Booking added successfully!', 'Close', { duration: 3000 });
      }

      if (this.dialogMode === 'edit' && this.selectedBooking && this.selectedBooking.id != null) {
        const updated = await this.bookingService.updateBooking(this.selectedBooking.id, booking);
        this.bookings.update((list) => list.map((b) => (b.id === updated.id ? updated : b)));
        this.snackBar.open('Booking updated successfully!', 'Close', { duration: 3000 });
      }

      if (
        this.dialogMode === 'delete' &&
        this.selectedBooking &&
        this.selectedBooking.id !== undefined
      ) {
        await this.bookingService.deleteBooking(this.selectedBooking.id);
        this.bookings.update((list) => list.filter((b) => b.id !== this.selectedBooking?.id));
        this.snackBar.open('Booking deleted successfully!', 'Close', { duration: 3000 });
      }
    } catch (err) {
      this.error.set('Operation failed');
    }

    this.onDialogClose();
  }
}
