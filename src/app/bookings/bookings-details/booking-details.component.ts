import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { form, minLength, required, FormField } from '@angular/forms/signals';
import { Booking, DialogMode } from '../../models/booking.model';

@Component({
  selector: 'app-booking-details',
  imports: [CommonModule, FormsModule, MatIconModule, FormField],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent implements OnInit {
  @Input() mode!: DialogMode;
  @Input() booking: Booking | null = null;
  @Input() clients: any[] = [];
  @Input() vehicles: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Booking>();

  statusOptions: Booking['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

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
    if (this.booking) {
      // Edit / Delete: populate form with existing booking
      this.newBooking.set(new Booking({ ...this.booking }));
    } else {
      // New: auto-generate a unique Booking ID so the DB unique constraint is never violated
      const ts = Date.now().toString(36).toUpperCase();
      this.newBooking.update((b) => ({ ...b, bookingId: `BKG-${ts}` }));
    }
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
    if (!b.pickup || !b.returnDate || this.selectedRatePerDay <= 0) return;

    const pickupMs  = new Date(b.pickup).getTime();
    const returnMs  = new Date(b.returnDate).getTime();
    if (isNaN(pickupMs) || isNaN(returnMs) || returnMs <= pickupMs) return;

    const MS_PER_DAY   = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.ceil((returnMs - pickupMs) / MS_PER_DAY);
    const amount       = (numberOfDays * this.selectedRatePerDay).toFixed(2);

    this.newBooking.update((b) => ({ ...b, amount }));
  }

  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    this.save.emit({ ...this.newBooking() });
  }
}
