import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected http = inject(HttpClient);
  protected apiUrl = 'http://localhost:3000'; // Replace with environment variable in production

  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  protected get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, { headers: this.getHeaders() });
  }

  protected post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, { headers: this.getHeaders() });
  }

  protected put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body, { headers: this.getHeaders() });
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`, { headers: this.getHeaders() });
  }
}
