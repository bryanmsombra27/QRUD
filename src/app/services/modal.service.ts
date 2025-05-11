import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  openModal = signal<boolean>(false);

  showModal() {
    this.openModal.set(true);
  }

  closeModal() {
    this.openModal.update(() => false);
  }
}
