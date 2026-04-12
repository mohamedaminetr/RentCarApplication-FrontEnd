import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BaseApiService } from './base-api.service';
import { PersistenceService } from './persistence.service';

import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth.model';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AppAuthService extends BaseApiService {
  private persistence = inject(PersistenceService);
  private router = inject(Router);

  public currentUser = signal<User | null>(this.persistence.get<User>('user'));
  public user$ = toObservable(this.currentUser);
  public isAuthenticated = signal<boolean>(!!this.persistence.get('token'));

  public async login(credentials: Credentials): Promise<AuthResponse> {
    const res = await firstValueFrom(this.post<AuthResponse>('/auth/login', credentials));
    this.persistence.set('token', res.token);
    this.persistence.set('user', res.user);
    this.currentUser.set(res.user);
    this.isAuthenticated.set(true);
    return res;
  }

  public async register(userData: any): Promise<any> {
    return await firstValueFrom(this.post<any>('/auth/register', userData));
  }

  public async logout(): Promise<void> {
    this.persistence.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
