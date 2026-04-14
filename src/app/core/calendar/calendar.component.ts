import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { TopbarComponent } from '../topbar/topbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, TopbarComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  public bookings = signal<Booking[]>([]);
  public currentDate = signal<Date>(new Date());
  
  public monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  public async ngOnInit(): Promise<void> {
    const data = await this.bookingService.getBookings();
    console.log('Calendar loaded bookings:', data.length);
    this.bookings.set(data);
  }

  private parseLocalDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    // Handle YYYY-MM-DD format manually to avoid UTC shift
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  public daysInMonth = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    
    // Previous month days to fill the first row
    const prevMonthDays = new Date(year, month, 0).getDate();
    const paddingStart = Array.from({ length: firstDay }, (_, i) => ({
      day: prevMonthDays - firstDay + i + 1,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - firstDay + i + 1)
    }));
    
    const currentMonthDays = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
      date: new Date(year, month, i + 1)
    }));
    
    // Next month days to fill the last row
    const totalDays = paddingStart.length + currentMonthDays.length;
    const paddingEndCount = (7 - (totalDays % 7)) % 7;
    const paddingEnd = Array.from({ length: paddingEndCount }, (_, i) => ({
      day: i + 1,
      currentMonth: false,
      date: new Date(year, month + 1, i + 1)
    }));
    
    return [...paddingStart, ...currentMonthDays, ...paddingEnd];
  });

  public getBookingsForDate(date: Date): Booking[] {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dTime = d.getTime();

    return this.bookings().filter(b => {
      const s = this.parseLocalDate(b.pickup);
      const e = this.parseLocalDate(b.returnDate);
      if (!s || !e) return false;
      
      s.setHours(0, 0, 0, 0);
      e.setHours(0, 0, 0, 0);
      
      const sTime = s.getTime();
      const eTime = e.getTime();
      
      return dTime >= sTime && dTime <= eTime;
    });
  }

  public nextMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  public prevMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  public goToToday(): void {
    this.currentDate.set(new Date());
  }

  public isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  public viewBooking(booking: Booking): void {
    this.router.navigate(['/bookings'], { queryParams: { id: booking.id } });
  }
}
