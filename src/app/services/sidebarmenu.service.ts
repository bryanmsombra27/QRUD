import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ModulosResponse } from '../interfaces/modulos.interface';
import { environment } from '../../environments/environment';

const { url, llaveToken } = environment;

@Injectable({
  providedIn: 'root',
})
export class SidebarmenuService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  constructor() {}

  getModulesForsidebar() {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.get<ModulosResponse>(`${url}/modulos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
