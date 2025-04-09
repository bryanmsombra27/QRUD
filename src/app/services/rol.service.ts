import { inject, Injectable, signal } from '@angular/core';
import { Meta, Pagination } from '../interfaces/pagination';
import {
  ActualizarRol,
  CommonResponse,
  CreateRolResponse,
  GetAllRoles,
  RegistroRol,
  Rol,
} from '../interfaces/rol.interface';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

const { url, llaveToken } = environment;

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private pagination = signal<Pagination>({ limit: 5, page: 1, search: '' });
  private roles = signal<Rol[]>([]);
  private metaData = signal<Meta>({
    totalPages: 0,
    actualPage: 0,
    totalCount: 0,
  });

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

  get meta() {
    return this.metaData();
  }

  get allRoles() {
    return this.roles();
  }
  set allRoles(roles: Rol[]) {
    this.roles.set(roles);
  }

  set meta(meta: Meta) {
    this.metaData.set(meta);
  }

  getAllRoles() {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.get<GetAllRoles>(
      `${url}/roles?limit=${this.pagination().limit}&page=${
        this.pagination().page
      }&search=${this.pagination().search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  createRole(role: RegistroRol) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.post<CreateRolResponse>(`${url}/roles`, role, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteRol(id: string) {
    const token = this.storageService.desencriptar(llaveToken);
    return this.http.delete<CommonResponse>(`${url}/roles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  removeRol(id: string) {
    const token = this.storageService.desencriptar(llaveToken);
    return this.http.delete<CommonResponse>(`${url}/roles/def/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  activate(id: string) {
    const token = this.storageService.desencriptar(llaveToken);
    return this.http.patch<CommonResponse>(
      `${url}/roles/activate/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  updateRol(id: string, rol: ActualizarRol) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.patch<{ message: string }>(`${url}/roles/${id}`, rol, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
