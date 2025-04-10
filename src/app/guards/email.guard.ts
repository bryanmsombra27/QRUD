import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const emailGuard: CanActivateFn = (route, state) => {
  const { token, id } = route.queryParams;
  const router = inject(Router);

  if (token && token.length > 0 && id && id.length > 0) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};
