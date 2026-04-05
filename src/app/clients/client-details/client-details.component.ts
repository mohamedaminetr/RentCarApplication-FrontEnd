import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Client } from '../clients.component';

export interface RentalRecord {
  car: string;
  dates: string;
  amount: number;
  days: number;
  dotClass: 'dot-green' | 'dot-gold' | 'dot-muted';
}

export interface SpendSegment {
  label: string;
  amount: number;
  pct: number;
}

@Component({
  selector: 'rentcar-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  imports: [CommonModule, TitleCasePipe, MatIcon, FormsModule],
})
export class ClientDetailsComponent implements OnChanges {
  @Input() client!: Client;
  @Input() mode: 'view' | 'edit' | 'add' = 'view';
  @Input() isConfirming = false;

  @Output() close = new EventEmitter<void>();
  @Output() addClient = new EventEmitter<Client>();
  @Output() updateClient = new EventEmitter<Client>();
  @Output() deleteClient = new EventEmitter<Client>();
  @Output() newRental = new EventEmitter<Client>();
  @Output() messageClient = new EventEmitter<Client>();

  activeTab: 'overview' | 'rentals' | 'notes' = 'overview';
  formData: Client = {} as Client;

  preferences = ['GPS required', 'Infant seat', 'Luxury class', 'Morning pickup'];

  recentRentals: RentalRecord[] = [
    {
      car: 'Mercedes E-Class',
      dates: 'Mar 18 – Mar 22, 2026',
      amount: 480,
      days: 4,
      dotClass: 'dot-green',
    },
    {
      car: 'BMW 5 Series',
      dates: 'Feb 10 – Feb 14, 2026',
      amount: 360,
      days: 4,
      dotClass: 'dot-gold',
    },
    {
      car: 'Range Rover Sport',
      dates: 'Jan 3 – Jan 10, 2026',
      amount: 840,
      days: 7,
      dotClass: 'dot-muted',
    },
    {
      car: 'Porsche Cayenne',
      dates: 'Dec 22 – Dec 28, 2025',
      amount: 920,
      days: 6,
      dotClass: 'dot-muted',
    },
    { car: 'Audi A6', dates: 'Nov 5 – Nov 8, 2025', amount: 270, days: 3, dotClass: 'dot-muted' },
  ];

  spendSegments: SpendSegment[] = [
    { label: 'Luxury vehicles', amount: 3120, pct: 54 },
    { label: 'SUV / Premium', amount: 1840, pct: 31 },
    { label: 'Standard', amount: 880, pct: 15 },
  ];

  ngOnChanges(): void {
    // Reset tab each time a new client is opened
    this.activeTab = 'overview';
    if (this.client) {
      this.formData = { ...this.client };
    }
  }

  get avgPerRental(): number {
    if (!this.client || this.client.rentals === 0) return 0;
    return Math.round(this.client.totalSpent / this.client.rentals);
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.onClose();
    }
  }

  onEdit(): void {
    this.mode = 'edit';
  }

  onCancelEdit(): void {
    if (this.mode === 'add') {
      this.onClose();
    } else {
      this.mode = 'view';
      this.formData = { ...this.client };
    }
  }

  onSave(): void {
    // Simple validation
    if (!this.formData.name || !this.formData.email) return;

    // Generate initials for avatar if new
    if (this.mode === 'add') {
      const parts = this.formData.name.split(' ');
      this.formData.initials = parts
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      this.addClient.emit(this.formData);
    } else {
      this.updateClient.emit(this.formData);
    }
  }

  onDelete(): void {
    this.deleteClient.emit(this.client);
  }

  onCancelDelete(): void {
    this.isConfirming = false;
  }

  onNewRental(): void {
    if (this.client) this.newRental.emit(this.client);
  }

  onMessage(): void {
    if (this.client) this.messageClient.emit(this.client);
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }
}
