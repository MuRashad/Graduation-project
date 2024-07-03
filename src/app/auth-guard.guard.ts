import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('userToken') != null) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
