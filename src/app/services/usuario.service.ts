import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  RegistroUsuario,
  UpdateUserResponse,
  User,
  UserResponse,
} from '../interfaces/usuario.interface';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage.service';
import { Pagination } from '../interfaces/pagination';
const { url, llaveToken } = environment;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private pagination = signal<Pagination>({ limit: 5, page: 1, search: '' });

  set page(page: number) {
    this.pagination.update((prevState) => ({ ...prevState, page }));
  }

  set limit(limit: number) {
    this.pagination.update((prevState) => ({ ...prevState, limit }));
  }

  set search(search: string) {
    this.pagination.update((prevState) => ({ ...prevState, search }));
  }

  get page() {
    return this.pagination().page;
  }

  get limit() {
    return this.pagination().limit;
  }
  get search() {
    return this.pagination().search;
  }

  getAllUsers() {
    const token = this.storageService.desencriptar(llaveToken);
    return this.http.get<GetAllUsersResponse>(
      `${url}/user?limit=${this.pagination().limit}&page=${
        this.pagination().page
      }&search=${this.pagination().search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  createUser(user: RegistroUsuario) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.post<UserResponse>(`${url}/user`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteUser(id: string) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.delete<DeleteUserResponse>(`${url}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateUser(id: string, data: RegistroUsuario) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.patch<UpdateUserResponse>(`${url}/user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
