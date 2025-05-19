import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Meta, Pagination } from '../interfaces/pagination';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import {
  CreateModule,
  CreateModuleResponse,
  DeleteModuleResponse,
  Modulo,
  ModulosResponse,
  UpdateModule,
  UpdateModuleResponse,
} from '../interfaces/modulos.interface';
const { url, llaveToken } = environment;

@Injectable({
  providedIn: 'root',
})
export class ModulosService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private pagination = signal<Pagination>({ limit: 5, page: 1, search: '' });
  private metaData = signal<Meta>({
    totalPages: 0,
    actualPage: 0,
    totalCount: 0,
  });
  modulos = signal<Modulo[]>([]);

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

  // get modules() {
  //   return this.modulos();
  // }

  async getAllModules() {
    const token = this.storageService.desencriptar(llaveToken);
    const request = this.http.get<ModulosResponse>(
      `${url}/modulos?limit=${this.pagination().limit}&page=${
        this.pagination().page
      }&search=${this.pagination().search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await firstValueFrom(request);

    this.metaData.update((prevState) => ({
      ...prevState,
      totalPages: response.meta.totalPages,
      totalCount: response.meta.totalCount,
      actualPage: response.meta.actualPage,
    }));

    this.modulos.set(response.modulos);
  }
  createModule(module: CreateModule) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.post<CreateModuleResponse>(`${url}/modulos`, module, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteModule(id: string) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.delete<DeleteModuleResponse>(`${url}/modulos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  deleteSubmodule(id: string) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.delete<DeleteModuleResponse>(`${url}/submodulos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateModule(id: string, module: UpdateModule) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.patch<UpdateModuleResponse>(
      `${url}/modulos/${id}`,
      module,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
