import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  imports: [],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.css',
})
export class CustomModalComponent {
  isOpenModal = signal<boolean>(false);

  showModal() {
    this.isOpenModal.set(true);
  }

  closeModal() {
    this.isOpenModal.set(false);
  }
}
