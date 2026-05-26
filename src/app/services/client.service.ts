import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs'; // Import this
import { BaseApiService } from './base-api.service';
import { Client } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService extends BaseApiService {
  async getClients(): Promise<Client[]> {
    return await firstValueFrom(this.get<Client[]>('/clients'));
  }

  async getClientById(id: any): Promise<Client> {
    return await firstValueFrom(this.get<Client>(`/clients/${id}`));
  }

  async createClient(client: Partial<Client>): Promise<Client> {
    return await firstValueFrom(this.post<Client>('/clients', client));
  }

  async updateClient(id: any, client: Partial<Client>): Promise<Client> {
    return await firstValueFrom(this.put<Client>(`/clients/${id}`, client));
  }

  async deleteClient(id: any): Promise<any> {
    return await firstValueFrom(this.delete<any>(`/clients/${id}`));
  }
}
