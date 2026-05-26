import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingDetailsComponent } from './bookings-details/booking-details.component';
import { TopbarComponent } from '../core/topbar/topbar.component';
import { BookingService, BookingFilter } from '../services/booking.service';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking, DialogMode } from '../models/booking.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Vehicle } from '../models/vehicle.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, MatIconModule, BookingDetailsComponent, TopbarComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsComponent implements OnInit {
  public bookingService = inject(BookingService);
  public authService = inject(AuthService);
  public vehicleService = inject(VehicleService);

  // State
  public bookings = signal<Booking[]>([]);
  public vehiclesList = signal<any[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public currentFilter = signal<BookingFilter>('All');

  // Computed
  public filteredBookings = computed(() => {
    // First filter by status using the existing service method
    const statusFiltered = this.bookingService.filterBookings(
      this.bookings(),
      this.currentFilter(),
    );
    // If the logged‑in user is a client, further restrict to their own bookings
    const currentUser = this.authService.currentUser();
    if (currentUser?.role === 'client') {
      const fullName = `${currentUser.firstName} ${currentUser.lastName}`.trim();
      return statusFiltered.filter((b) => b.clientName === fullName);
    }
    return statusFiltered;
  });

  // Dialog state
  public dialogMode: DialogMode = null;
  public selectedBooking: Booking | null = null;

  private route = inject(ActivatedRoute);

  public async ngOnInit(): Promise<void> {
    await this.loadBookings();
    this.vehicleService.getVehicles().then((data: Vehicle[]) => {
      this.vehiclesList.set(data);

      // Check query params after vehicles are loaded
      this.route.queryParams.subscribe((params: any) => {
        if (params['action'] === 'new') {
          this.openNewBooking(params['plate']);
        }
      });
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
  public openNewBooking(plate?: string): void {
    if (plate) {
      const vehicle = this.vehiclesList().find((v) => v.plate === plate);
      this.selectedBooking = new Booking({
        plate: plate,
        vehicleName: vehicle?.name || '',
      });
    } else {
      this.selectedBooking = null;
    }
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

  // ── Status Actions ────────────────────────────────────────────────────────
  public async onApproveBooking(booking: Booking): Promise<void> {
    const result = await Swal.fire({
      title: 'Approve Reservation?',
      text: `Confirm approval for ${booking.clientName}'s reservation.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d4a843',
      confirmButtonText: 'Yes, Approve',
      background: '#1a1611',
      color: '#f5f0e8',
    });

    if (result.isConfirmed) {
      try {
        const updated = await this.bookingService.approveBooking(booking.id);
        this.updateBookingInList(updated);
        this.notifySuccess('Reservation Approved', `Booking #${updated.id} is now Approved.`);
      } catch (err: any) {
        this.notifyError('Approval Failed', err.message);
      }
    }
  }

  public async onStartBooking(booking: Booking): Promise<void> {
    const result = await Swal.fire({
      title: 'Start Trip?',
      text: `Mark this reservation as Active (car picked up).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2196f3',
      cancelButtonColor: '#d4a843',
      confirmButtonText: 'Yes, Start',
      background: '#1a1611',
      color: '#f5f0e8',
    });

    if (result.isConfirmed) {
      try {
        const updated = await this.bookingService.startBooking(booking.id);
        this.updateBookingInList(updated);
        this.notifySuccess('Trip Started', `Booking #${updated.id} is now Active.`);
      } catch (err: any) {
        this.notifyError('Start Failed', err.message);
      }
    }
  }

  public async onCompleteBooking(booking: Booking): Promise<void> {
    const result = await Swal.fire({
      title: 'Complete Reservation?',
      text: `Mark this trip as Completed (car returned).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d4a843',
      cancelButtonColor: '#444',
      confirmButtonText: 'Yes, Complete',
      background: '#1a1611',
      color: '#f5f0e8',
    });

    if (result.isConfirmed) {
      try {
        const updated = await this.bookingService.completeBooking(booking.id);
        this.updateBookingInList(updated);
        this.notifySuccess('Trip Completed', `Booking #${updated.id} is now Completed.`);
      } catch (err: any) {
        this.notifyError('Completion Failed', err.message);
      }
    }
  }

  public async onCancelBooking(booking: Booking): Promise<void> {
    const result = await Swal.fire({
      title: 'Cancel Reservation?',
      text: `Are you sure you want to cancel this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f06060',
      cancelButtonColor: '#d4a843',
      confirmButtonText: 'Yes, Cancel',
      background: '#1a1611',
      color: '#f5f0e8',
    });

    if (result.isConfirmed) {
      try {
        const updated = await this.bookingService.cancelBooking(booking.id);
        this.updateBookingInList(updated);
        this.notifySuccess('Reservation Canceled', `Booking #${updated.id} has been canceled.`);
      } catch (err: any) {
        this.notifyError('Cancellation Failed', err.message);
      }
    }
  }

  private updateBookingInList(updated: Booking): void {
    this.bookings.update((list) => list.map((b) => (b.id === updated.id ? updated : b)));
  }

  private notifySuccess(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#d4a843',
      background: '#1a1611',
      color: '#f5f0e8',
    });
    this.notificationService.add(title, text, 'success', 'check_circle');
  }

  private notifyError(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d4a843',
      background: '#1a1611',
      color: '#f5f0e8',
    });
  }

  // ── Dialog event handlers ─────────────────────────────────────────────────
  public onDialogClose(): void {
    this.dialogMode = null;
    this.selectedBooking = null;
  }

  public snackBar = inject(MatSnackBar);
  public notificationService = inject(NotificationService);

  public async onDialogSave(booking: any): Promise<void> {
    try {
      if (this.dialogMode === 'new') {
        const names = booking.clientName.trim().split(' ');
        booking.initials =
          (names[0]?.[0] ?? '').toUpperCase() + (names[1]?.[0] ?? '').toUpperCase();

        // Remove id: 0 to let the database generate a real ID
        const { id, ...bookingToCreate } = booking;

        const newBooking = await this.bookingService.createBooking(bookingToCreate);
        this.bookings.update((list) => [...list, newBooking]);

        Swal.fire({
          title: 'Booking Created!',
          text: `New booking for ${booking.clientName} has been successfully added.`,
          icon: 'success',
          confirmButtonColor: '#d4a843',
          background: '#1a1611',
          color: '#f5f0e8',
        });

        this.notificationService.add(
          'Booking Created',
          `New booking for ${booking.clientName}`,
          'success',
          'calendar_today',
        );
      }

      if (this.dialogMode === 'edit' && this.selectedBooking && this.selectedBooking.id != null) {
        const updated = await this.bookingService.updateBooking(this.selectedBooking.id, booking);
        this.bookings.update((list) => list.map((b) => (b.id === updated.id ? updated : b)));

        Swal.fire({
          title: 'Booking Updated!',
          text: `Booking #${updated.id} status is now ${updated.status}`,
          icon: 'success',
          confirmButtonColor: '#d4a843',
          background: '#1a1611',
          color: '#f5f0e8',
        });

        this.notificationService.add(
          'Booking Updated',
          `Booking #${updated.id} status is now ${updated.status}`,
          'info',
          'edit',
        );
      }

      if (
        this.dialogMode === 'delete' &&
        this.selectedBooking &&
        this.selectedBooking.id !== undefined &&
        this.selectedBooking.id !== 0
      ) {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#f06060',
          cancelButtonColor: '#d4a843',
          confirmButtonText: 'Yes, delete it!',
          background: '#1a1611',
          color: '#f5f0e8',
        });

        if (result.isConfirmed) {
          await this.bookingService.deleteBooking(this.selectedBooking.id);
          const deletedId = this.selectedBooking.id;
          this.bookings.update((list) => list.filter((b) => b.id !== deletedId));

          Swal.fire({
            title: 'Deleted!',
            text: 'Your booking has been deleted.',
            icon: 'success',
            confirmButtonColor: '#d4a843',
            background: '#1a1611',
            color: '#f5f0e8',
          });
        }
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Operation failed. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d4a843',
        background: '#1a1611',
        color: '#f5f0e8',
      });
      this.error.set('Operation failed');
    }

    this.onDialogClose();
  }
}
