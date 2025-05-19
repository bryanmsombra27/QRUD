import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { BuscadorComponent } from '../../components/shared/buscador/buscador.component';
import { PaginacionComponent } from '../../components/shared/paginacion/paginacion.component';
import { CustomModalComponent } from '../../components/shared/custom-modal/custom-modal.component';
import { ModulosService } from '../../services/modulos.service';
import { Modulo } from '../../interfaces/modulos.interface';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { CrearModuloComponent } from '../../components/formularios/crear-modulo/crear-modulo.component';
import { AlertaService } from '../../services/alerta.service';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { firstValueFrom } from 'rxjs';
import { ActualizarModuloComponent } from '../../components/formularios/actualizar-modulo/actualizar-modulo.component';

@Component({
  selector: 'app-modulos',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomModalComponent,
    ExitoComponent,
    CrearModuloComponent,
    SpinnerComponent,
    BuscadorComponent,
    PaginacionComponent,
    ActualizarModuloComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.css',
})
export default class ModulosComponent implements OnInit {
  @ViewChild(CustomModalComponent)
  customModal!: CustomModalComponent;

  @ViewChild('deleteModuleModal')
  deleteModuleModal!: CustomModalComponent;

  @ViewChild('editModuleModal')
  editModuleModal!: CustomModalComponent;

  modulos = signal<Modulo[]>([]);
  moduleConfirmation = signal<Modulo | null>(null);

  modulosService = inject(ModulosService);
  alertaService = inject(AlertaService);
  private ErrorServidor = inject(ErrorServidorService);

  ngOnInit(): void {
    this.getModules();
  }

  openModal() {
    this.customModal.showModal();
  }
  async getModules() {
    await this.modulosService.getAllModules();
    // this.modulos.set(this.modulosService.modulos());
  }

  expandRows(id: string) {
    const row = document.querySelector(`#expanded-row-${id}`);
    const accordeon = document.querySelector(`#accordeon-${id}`);
    const accordeonBody = document.querySelector(`#accordeon-body-${id}`);

    row?.classList.toggle('active');
    accordeon?.classList.toggle('active');
    accordeonBody?.classList.toggle('active');
  }

  deleteModuleConfirmation(module: Modulo) {
    const row = document.querySelector(`#expanded-row-${module.id}`);
    const accordeon = document.querySelector(`#accordeon-${module.id}`);
    const accordeonBody = document.querySelector(
      `#accordeon-body-${module.id}`
    );
    this.moduleConfirmation.set(module);

    this.deleteModuleModal.showModal();

    row?.classList.add('active');
    accordeon?.classList.add('active');
    accordeonBody?.classList.add('active');
  }
  cancelDeleteModuleModal() {
    this.deleteModuleModal.closeModal();
    this.moduleConfirmation.set(null);
  }

  async deleteModule() {
    try {
      const response = await firstValueFrom(
        this.modulosService.deleteModule(this.moduleConfirmation()!.id)
      );
      this.alertaService.setMessage(response.message);
      await this.modulosService.getAllModules();
      this.deleteModuleModal.closeModal();
      this.moduleConfirmation.set(null);
      setTimeout(() => {
        this.alertaService.clearMessage();
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  resetModuleModal() {
    this.customModal.closeModal();
    setTimeout(() => {
      this.alertaService.clearMessage();
    }, 1500);
  }
  closeEditModal() {
    this.editModuleModal.closeModal();
    setTimeout(() => {
      this.alertaService.clearMessage();
    }, 1500);
  }

  selectEditModule(module: Modulo) {
    const row = document.querySelector(`#expanded-row-${module.id}`);
    const accordeon = document.querySelector(`#accordeon-${module.id}`);
    const accordeonBody = document.querySelector(
      `#accordeon-body-${module.id}`
    );
    this.moduleConfirmation.set(module);

    this.editModuleModal.showModal();

    row?.classList?.add('active');
    accordeon?.classList?.add('active');
    accordeonBody?.classList?.add('active');
  }
}
