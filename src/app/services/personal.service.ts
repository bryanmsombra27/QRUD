import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Meta, Pagination } from '../interfaces/pagination';
import {
  createPersonalResponse,
  GetAllPersonal,
  Personal,
  RegistroPersonal,
} from '../interfaces/personal.interface';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
const { url, llaveToken } = environment;
@Injectable({
  providedIn: 'root',
})
export class PersonalService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private pagination = signal<Pagination>({ limit: 5, page: 1, search: '' });
  private personal = signal<Personal[]>([]);
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

  get allPersonal() {
    return this.personal();
  }

  constructor() {
    // this.getAllPersonal();
  }

  async getAllPersonal() {
    const token = this.storageService.desencriptar(llaveToken);

    const response = await firstValueFrom(
      this.http.get<GetAllPersonal>(
        `${url}/personal?limit=${this.pagination().limit}&page=${
          this.pagination().page
        }&search=${this.pagination().search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );
    this.personal.set(response.personal);
    this.metaData.set(response.meta);
  }

  createPersonal(body: RegistroPersonal) {
    const token = this.storageService.desencriptar(llaveToken);

    return this.http.post<createPersonalResponse>(`${url}/personal`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
