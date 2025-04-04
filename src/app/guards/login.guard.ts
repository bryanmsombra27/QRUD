import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { environment } from '../../environments/environment.development';
const { llaveToken, llaveRole } = environment;

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const token = storageService.obtenerDeLocalStorage(llaveToken);
  const rol = storageService.obtenerDeLocalStorage(llaveRole);

  if (token && rol) {
    return true;
  } else {
    sessionStorage.clear();
    router.navigateByUrl('/login');
    return false;
  }
};
