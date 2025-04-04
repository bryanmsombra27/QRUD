import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegistroUsuario, UserResponse } from '../interfaces/usuario.interface';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage.service';
const { url, llaveToken } = environment;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  getAllUsers() {
    // return this.http.get()s
  }

  createUser(user: RegistroUsuario) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.post<UserResponse>(`${url}/user`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
