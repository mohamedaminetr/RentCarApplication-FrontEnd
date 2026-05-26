import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { form, minLength, required, FormField } from '@angular/forms/signals';
import { Booking, DialogMode } from '../../models/booking.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  imports: [CommonModule, FormsModule, MatIconModule, FormField],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent implements OnInit {
  @Input() mode!: DialogMode;
  @Input() booking: Booking | null = null;
  @Input() vehicles: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Booking>();

  private authService = inject(AuthService);

  statusOptions: Booking['status'][] = ['Pending', 'Approved', 'Active', 'Completed', 'Canceled', 'Expired'];

  get availableVehicles(): any[] {
    if (this.isNew) {
      return this.vehicles.filter((v) => v.status === 'Available');
    }
    return this.vehicles;
  }

  newBooking = signal<Booking>(new Booking());
  bookingForm = form(this.newBooking, (f) => {
    required(f.clientName);
    required(f.vehicleName);
    required(f.plate);
    required(f.pickup);
    required(f.returnDate);
    required(f.status);
    required(f.amount);
  });

  ngOnInit() {
    if (this.booking && this.mode !== 'new') {
      // Edit / Delete: populate form with existing booking
      this.newBooking.set(new Booking({ ...this.booking }));

      // If editing, find and set the rate of the already selected vehicle
      const vehicle = this.vehicles.find((v) => v.plate === this.booking?.plate);
      if (vehicle) {
        this.selectedRatePerDay = vehicle.ratePerDay ?? 0;
      }
    } else {
      // New: auto-generate a unique Booking ID
      const ts = Date.now().toString(36).toUpperCase();

      // Pre-fill from input if available (e.g. from RENT NOW)
      const initialData = this.booking ? { ...this.booking } : {};
      this.newBooking.set(
        new Booking({
          ...initialData,
          bookingId: `BKG-${ts}`,
          status: 'Pending',
        }),
      );

      // If plate is pre-selected, set the rate
      if (this.newBooking().plate) {
        const vehicle = this.vehicles.find((v) => v.plate === this.newBooking().plate);
        if (vehicle) {
          this.selectedRatePerDay = vehicle.ratePerDay ?? 0;
        }
      }

      // Handle client mode defaults
      const user = this.authService.currentUser();
      if (user?.role === 'client') {
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        this.newBooking.update((b) => ({
          ...b,
          clientName: fullName,
        }));
      }
    }
  }

  get isClientRole(): boolean {
    return this.authService.currentUser()?.role === 'client';
  }

  get isNew() {
    return this.mode === 'new';
  }
  get isEdit() {
    return this.mode === 'edit';
  }
  get isDelete() {
    return this.mode === 'delete';
  }

  get dialogTitle(): string {
    if (this.isNew) return 'New Booking';
    if (this.isEdit) return 'Edit Booking';
    return 'Delete Booking';
  }

  get confirmLabel(): string {
    if (this.isNew) return 'Create Booking';
    if (this.isEdit) return 'Save Changes';
    return 'Delete Booking';
  }

  get confirmIcon(): string {
    if (this.isNew) return 'add_circle';
    if (this.isEdit) return 'save';
    return 'delete_forever';
  }

  // Stores the rate/day of the currently selected vehicle.
  // Used to auto-calculate: amount = numberOfDays × ratePerDay
  private selectedRatePerDay: number = 0;

  public handleVehicleSelect(e: Event): void {
    const p = (e.target as HTMLSelectElement).value;
    if (!p) {
      this.newBooking.update((b) => ({ ...b, vehicleName: '', plate: '', amount: '0.00' }));
      return;
    }

    const vehicle = this.vehicles.find((v) => v.plate === p);
    if (vehicle) {
      this.selectedRatePerDay = vehicle.ratePerDay ?? 0;
      this.newBooking.update((b) => ({ ...b, vehicleName: vehicle.name, plate: vehicle.plate }));
      this.recalculateAmount();
    }
  }

  public handleDateChange(): void {
    this.recalculateAmount();
  }

  /**
   * Auto-calculates the booking amount from dates and vehicle rate.
   *
   * Formula:
   *   numberOfDays = ceil((returnDate - pickupDate) / milliseconds_per_day)
   *   amount       = numberOfDays × ratePerDay
   *
   * Where:
   *   ratePerDay  = vehicle.ratePerDay  (set in the Vehicles page, stored in DB)
   *   amount      = the total cost of the rental shown to the user
   *
   * Note: Uses Math.ceil so a partial day is billed as a full day.
   */
  private recalculateAmount(): void {
    const b = this.newBooking();

    // If missing dates or rate, reset amount to empty string (makes form invalid)
    if (!b.pickup || !b.returnDate || this.selectedRatePerDay <= 0) {
      this.newBooking.update((b) => ({ ...b, amount: '' }));
      return;
    }

    const pickupMs = new Date(b.pickup).getTime();
    const returnMs = new Date(b.returnDate).getTime();

    // If dates are invalid or return is before pickup, reset amount
    if (isNaN(pickupMs) || isNaN(returnMs) || returnMs <= pickupMs) {
      this.newBooking.update((b) => ({ ...b, amount: '' }));
      return;
    }

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.ceil((returnMs - pickupMs) / MS_PER_DAY);
    const amount = (numberOfDays * this.selectedRatePerDay).toFixed(2);

    this.newBooking.update((b) => ({ ...b, amount }));
  }

  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    const b = this.newBooking();
    if (!b.plate || !b.clientName || this.bookingForm().invalid()) {
      return;
    }
    this.save.emit({ ...b });
  }
}
