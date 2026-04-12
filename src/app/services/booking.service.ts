import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Booking } from '../models/booking.model';

export type BookingFilter = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

@Injectable({ providedIn: 'root' })
export class BookingService extends BaseApiService {
  public async getBookings(): Promise<Booking[]> {
    return await firstValueFrom(this.get<Booking[]>('/bookings'));
  }

  public async getBookingById(id: number): Promise<Booking> {
    return await firstValueFrom(this.get<Booking>(`/bookings/${id}`));
  }

  public async createBooking(booking: Partial<Booking>): Promise<Booking> {
    return await firstValueFrom(this.post<Booking>('/bookings', booking));
  }

  public async updateBooking(id: number, booking: Partial<Booking>): Promise<Booking> {
    return await firstValueFrom(this.put<Booking>(`/bookings/${id}`, booking));
  }

  public async deleteBooking(id: number): Promise<void> {
    await firstValueFrom(this.delete<any>(`/bookings/${id}`));
  }

  public filterBookings(bookings: Booking[], filter: BookingFilter): Booking[] {
    if (filter === 'All') return bookings;
    return bookings.filter((b) => b.status === filter);
  }
}
