import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Booking } from '../models/booking.model';

export type BookingFilter =
  | 'All'
  | 'Pending'
  | 'Approved'
  | 'Active'
  | 'Completed'
  | 'Canceled'
  | 'Expired';

@Injectable({ providedIn: 'root' })
export class BookingService extends BaseApiService {
  public async getBookings(): Promise<Booking[]> {
    return await firstValueFrom(this.get<Booking[]>('/bookings'));
  }

  public async getBookingById(id: any): Promise<Booking> {
    return await firstValueFrom(this.get<Booking>(`/bookings/${id}`));
  }

  public async createBooking(booking: Partial<Booking>): Promise<Booking> {
    return await firstValueFrom(this.post<Booking>('/bookings', booking));
  }

  public async updateBooking(id: any, booking: Partial<Booking>): Promise<Booking> {
    return await firstValueFrom(this.put<Booking>(`/bookings/${id}`, booking));
  }

  public async approveBooking(id: any): Promise<Booking> {
    return await firstValueFrom(this.put<Booking>(`/bookings/${id}/approve`, {}));
  }

  public async startBooking(id: any): Promise<Booking> {
    return await firstValueFrom(this.put<Booking>(`/bookings/${id}/start`, {}));
  }

  public async completeBooking(id: any): Promise<Booking> {
    return await firstValueFrom(this.put<Booking>(`/bookings/${id}/complete`, {}));
  }

  public async cancelBooking(id: any): Promise<Booking> {
    return await firstValueFrom(this.put<Booking>(`/bookings/${id}/cancel`, {}));
  }

  public async deleteBooking(id: any): Promise<void> {
    await firstValueFrom(this.delete<any>(`/bookings/${id}`));
  }

  public filterBookings(bookings: Booking[], filter: BookingFilter): Booking[] {
    if (filter === 'All') return bookings;
    return bookings.filter((b) => b.status === filter);
  }
}
