import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService {
  
  public async updateUser(id: any, userData: Partial<User>): Promise<User> {
    return await firstValueFrom(this.put<User>(`/users/${id}`, userData));
  }
}
