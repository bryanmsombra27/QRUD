import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { LoginResponse, PersonalLogin } from '../interfaces/login.interface';
import { environment } from '../../environments/environment.development';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, tap } from 'rxjs';

const { url, llaveToken, llaveRole } = environment;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private StorageService = inject(StorageService);

  constructor() {}

  login(personal: PersonalLogin) {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${url}/auth/login`, personal).pipe(
        tap((response) => {
          this.StorageService.encryptar(llaveToken, response.token);
          this.StorageService.encryptar(llaveRole, response.personal.rol.name);
        })
      )
    );
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
