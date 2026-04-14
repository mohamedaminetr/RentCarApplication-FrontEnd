import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PersistenceService } from '../services/persistence.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const persistence = inject(PersistenceService);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    // Optionally check for token expiration here if your backend provides exp claim
    const user = persistence.get<any>('user');
    if (user && user.exp) {
      const now = Date.now() / 1000;
      if (user.exp < now) {
        // Token expired
        persistence.clear();
        authService.isAuthenticated.set(false);
        router.navigate(['/login']);
        return false;
      }
    }
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
