import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsComponent {
  currentFilter = 'All';

  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  get filteredBookings() {
    if (this.currentFilter === 'All') return this.mockBookings;
    return this.mockBookings.filter(b => b.status === this.currentFilter);
  }

  mockBookings = [
    {
      initials: 'JD',
      image: 'https://catalogue.automobile.tn/big/2025/11/47224.jpg?t=1',
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
      image: 'https://catalogue.automobile.tn/big/2025/11/47224.jpg?t=1',
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
      image: 'https://catalogue.automobile.tn/big/2025/11/47224.jpg?t=1',
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
      image: 'https://catalogue.automobile.tn/big/2025/11/47224.jpg?t=1',
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
