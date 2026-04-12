import { Component, Input, Output, EventEmitter, OnChanges, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { form, minLength, required, FormField } from '@angular/forms/signals';
import { Client, RentalRecord, SpendSegment } from '../../models/client.model';
import { inject } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'rentcar-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  imports: [CommonModule, TitleCasePipe, MatIcon, FormsModule, FormField],
})
export class ClientDetailsComponent implements OnChanges {
  @Input() public client!: Client;
  @Input() public mode: 'view' | 'edit' | 'add' = 'view';
  @Input() public isConfirming = false;

  @Output() public close = new EventEmitter<void>();
  @Output() public addClient = new EventEmitter<Client>();
  @Output() public updateClient = new EventEmitter<Client>();
  @Output() public deleteClient = new EventEmitter<Client>();
  @Output() public newRental = new EventEmitter<Client>();
  @Output() public messageClient = new EventEmitter<Client>();

  public activeTab: 'overview' | 'rentals' | 'notes' = 'overview';

  public newClient = signal<Client>(new Client());

  protected clientForm = form(this.newClient, (f) => {
    required(f.name);
    minLength(f.name, 2);
    required(f.email);
    required(f.phone);
    required(f.status);
  });

  public preferences = ['GPS required', 'Infant seat', 'Luxury class', 'Morning pickup'];

  // 1. Define the type using RentalRecord[]
  // 2. Map the raw data through the constructor we built
  public recentRentals: RentalRecord[] = [
    {
      car: 'Mercedes E-Class',
      dates: 'Mar 18 – Mar 22, 2026',
      amount: 480,
      days: 4,
      vehicleName: 'Mercedes E-Class', // Added to match class property
      dotClass: 'dot-green',
    },
    {
      car: 'BMW 5 Series',
      dates: 'Feb 10 – Feb 14, 2026',
      amount: 360,
      days: 4,
      vehicleName: 'BMW 5 Series',
      dotClass: 'dot-gold',
    },
    {
      car: 'Range Rover Sport',
      dates: 'Jan 3 – Jan 10, 2026',
      amount: 840,
      days: 7,
      vehicleName: 'Range Rover Sport',
      dotClass: 'dot-muted',
    },
    {
      car: 'Porsche Cayenne',
      dates: 'Dec 22 – Dec 28, 2025',
      amount: 920,
      days: 6,
      vehicleName: 'Porsche Cayenne',
      dotClass: 'dot-muted',
    },
    {
      car: 'Audi A6',
      dates: 'Nov 5 – Nov 8, 2025',
      amount: 270,
      days: 3,
      vehicleName: 'Audi A6',
      dotClass: 'dot-muted',
    },
  ];

  public spendSegments: SpendSegment[] = [
    { label: 'Luxury vehicles', amount: 3120, pct: 54 },
    { label: 'SUV / Premium', amount: 1840, pct: 31 },
    { label: 'Standard', amount: 880, pct: 15 },
  ];

  public bookingService = inject(BookingService);

  public ngOnChanges(): void {
    // Reset tab each time a new client is opened
    this.activeTab = 'overview';
    if (this.client) {
      this.newClient.set({ ...this.client });
      this.loadRealRentals();
    } else {
      this.newClient.set(new Client());
    }
  }

  private async loadRealRentals() {
    try {
      const allBookings = await this.bookingService.getBookings();
      const myBookings = allBookings.filter((b: any) => b.clientName === this.client.name);

      this.recentRentals = myBookings.map((b: any) => ({
        car: b.vehicleName,
        dates: `${b.pickup} – ${b.return}`,
        amount: parseFloat(String(b.amount).replace(/[^0-9.-]+/g, '')) || 0,
        days: 1, // simplified
        vehicleName: b.vehicleName,
        dotClass:
          b.status === 'Completed'
            ? 'dot-green'
            : b.status === 'Pending'
              ? 'dot-gold'
              : 'dot-muted',
      }));

      // Calculate realistic spendSegments based on rentals (Simplified mockup using real total numbers)
      const luxury = this.recentRentals
        .filter((r) => r.amount > 500)
        .reduce((a, b) => a + b.amount, 0);
      const regular = this.recentRentals
        .filter((r) => r.amount <= 500)
        .reduce((a, b) => a + b.amount, 0);
      const total = luxury + regular || 1;

      this.spendSegments = [
        { label: 'High-end / Luxury', amount: luxury, pct: Math.round((luxury / total) * 100) },
        { label: 'Standard / Regular', amount: regular, pct: Math.round((regular / total) * 100) },
      ];
    } catch (e) {}
  }

  public get avgPerRental(): number {
    if (!this.client || this.client.rentals === 0) return 0;
    return Math.round(this.client.totalSpent / this.client.rentals);
  }

  public updateAvatar(color: string): void {
    this.newClient.update((c) => {
      c.avatarClass = color;
      return { ...c };
    });
  }

  public onClose(): void {
    this.close.emit();
  }

  public onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.onClose();
    }
  }

  public onEdit(): void {
    this.mode = 'edit';
  }

  public onCancelEdit(): void {
    if (this.mode === 'add') {
      this.onClose();
    } else {
      this.mode = 'view';
      if (this.client) {
        this.newClient.set({ ...this.client });
      }
    }
  }

  public onSave(): void {
    const payload = this.newClient();
    // Simple validation
    if (!payload.name || !payload.email) return;

    // Generate initials for avatar if new
    if (this.mode === 'add') {
      const parts = payload.name.split(' ');
      payload.initials = parts
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      this.addClient.emit(payload);
    } else {
      this.updateClient.emit(payload);
    }
  }

  public onDelete(): void {
    this.deleteClient.emit(this.client);
  }

  public onCancelDelete(): void {
    this.isConfirming = false;
  }

  public onNewRental(): void {
    if (this.client) this.newRental.emit(this.client);
  }

  public onMessage(): void {
    if (this.client) this.messageClient.emit(this.client);
  }

  public formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }
}
