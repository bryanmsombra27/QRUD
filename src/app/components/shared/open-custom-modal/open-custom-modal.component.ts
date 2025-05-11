import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-open-custom-modal',
  imports: [CommonModule],
  templateUrl: './open-custom-modal.component.html',
  styleUrl: './open-custom-modal.component.css',
})
export class OpenCustomModalComponent {
  modalService = inject(ModalService);

  showModal() {
    this.modalService.showModal();
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
