import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorServidorService {
  errorServidor = signal(false);

  router = inject(Router);
  authService = inject(AuthService);

  constructor() {}

  error() {
    this.errorServidor.set(true);
    this.router.navigateByUrl('/error');
  }
  invalidToken(error: CustomError) {
    console.log(error, 'ESTA EN EL SERVICIO DE INVALID TOKEN');

    if (error.statusText == 'Unauthorized' && error.status == 401) {
      this.authService.logout();
    }
  }
}

export interface CustomError extends HttpErrorResponse {
  error: {
    error: string;
    message: string;
    statuscode: number;
  };
}
