import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Guest guard - prevents authenticated users from accessing login/register pages.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (!auth.isLoggedIn()) {
    return true;
  }

  // Authenticated users should be redirected to their dashboard
  const target = auth.getRole() === 'ADMIN' ? '/admin' : '/dashboard';
  router.navigate([target]);
  return false;
};

