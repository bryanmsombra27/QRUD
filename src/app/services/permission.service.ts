import { inject, Injectable, signal } from '@angular/core';
import {
  PermisionAsignation,
  PermissionAsssignationByRolResponse,
} from '../interfaces/permission.interface';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Meta, Pagination } from '../interfaces/pagination';
import { environment } from '../../environments/environment';
const { url, llaveToken } = environment;
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private pagination = signal<Pagination>({ limit: 15, page: 1, search: '' });
  private metaData = signal<Meta>({
    totalPages: 0,
    actualPage: 0,
    totalCount: 0,
  });

  assignPermission(roleId: string, permissions: PermisionAsignation[]) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.post<{ message: string }>(
      `${url}/permissions/${roleId}`,
      permissions,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getAssinatedModulesByRole(roleId: string) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.get<PermissionAsssignationByRolResponse>(
      `${url}/permissions/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
