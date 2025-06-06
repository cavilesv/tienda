// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from './token.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  try {
    const loggedIn = await tokenService.isLoggedIn();
    const valid = await tokenService.isTokenValid();


    if (loggedIn && valid) {
        return true;
    }

  } catch {
    return router.createUrlTree(['/login']);
  }
  

  // Si no hay token, redirige al login
  return router.createUrlTree(['/login']);
};
