import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TopbarComponent } from '../topbar/topbar.component';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, MatIconModule, TopbarComponent],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
})
export class RevenueComponent implements OnInit {
  private bookingService = inject(BookingService);
  public bookings = signal<Booking[]>([]);

  public async ngOnInit(): Promise<void> {
    const data = await this.bookingService.getBookings();
    this.bookings.set(data);
  }

  public stats = computed(() => {
    const b = this.bookings();
    let totalRevenue = 0;
    let pending = 0;

    b.forEach((bk) => {
      const amt = parseFloat(String(bk.amount).replace(/[^0-9.-]+/g, '')) || 0;
      if (bk.status === 'Completed' || bk.status === 'Confirmed') {
        totalRevenue += amt;
      } else if (bk.status === 'Pending') {
        pending += amt;
      }
    });

    const netProfit = totalRevenue * 0.65; // Simulated 65% margin
    const avgBooking =
      totalRevenue /
      (b.filter((bk) => bk.status === 'Completed' || bk.status === 'Confirmed').length || 1);

    return {
      revenue: '$' + totalRevenue.toLocaleString(),
      pending: '$' + pending.toLocaleString(),
      profit: '$' + netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      avg: '$' + avgBooking.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    };
  });
}
