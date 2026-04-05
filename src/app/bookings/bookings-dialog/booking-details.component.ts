import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Booking, DialogMode } from '../bookings.component';

@Component({
  selector: 'app-booking-details',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent implements OnInit {
  @Input() mode!: DialogMode;
  @Input() booking: Booking | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Booking>();

  statusOptions: Booking['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  form: Booking = {
    initials: '',
    clientName: '',
    bookingId: '',
    carName: '',
    plate: '',
    pickup: '',
    return: '',
    status: 'Pending',
    amount: '',
  };

  ngOnInit() {
    if (this.booking) {
      this.form = { ...this.booking };
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

  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    this.save.emit({ ...this.form });
  }
}
