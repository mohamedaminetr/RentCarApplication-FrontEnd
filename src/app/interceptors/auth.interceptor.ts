import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PersistenceService } from '../services/persistence.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const persistence = inject(PersistenceService);
  const authService = inject(AuthService);
  // Get token from localStorage
  const token = persistence.get<string>('token');

  // Clone the request and add the authorization header if token exists
  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the response and catch 401 errors
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid - clear storage and redirect to login
        persistence.clear();
        router.navigate(['/login']);
        authService.isAuthenticated.set(false);
      }
      return throwError(() => error);
    }),
  );
};
