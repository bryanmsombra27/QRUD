import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorServidorService {
  errorServidor = signal(false);

  router = inject(Router);

  constructor() {}

  error() {
    this.errorServidor.set(true);
    this.router.navigateByUrl('/error');
  }
}
