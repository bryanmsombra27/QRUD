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
import { Modulo, Submodulo } from '../../interfaces/modulos.interface';
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
import { ActualizarSubmoduloComponent } from '../../components/formularios/actualizar-submodulo/actualizar-submodulo.component';

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
    ActualizarSubmoduloComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.css',
})
export default class ModulosComponent implements OnInit {
  // TODO:  refactorizar cdigo que se repite en varios lugares
  // TODO:  AÑADIR boton para crear submodulos
  // TODO: TERMINAR LA FUNCIONALIDAD PARA ELIMINAR SUBMODULOS EN EL FORMULARIO DE CREACION POR SI CREA MAS SUBMODULOS DE LOS QUE OCUPA
  // TODO: VERIFICAR BUG CUANDO SE ACTUALIZA UN MODULO/SUBMODULO YA QUE CUANDO SE MANDA VACIO EL CAMPO, EN EL BACKEND SE GUARDA COMO /null

  @ViewChild(CustomModalComponent)
  customModal!: CustomModalComponent;

  @ViewChild('deleteModuleModal')
  deleteModuleModal!: CustomModalComponent;

  @ViewChild('editModuleModal')
  editModuleModal!: CustomModalComponent;

  @ViewChild('editSubModuleModal')
  editSubModuleModal!: CustomModalComponent;

  @ViewChild('deleteSubModuleModal')
  deleteSubModuleModal!: CustomModalComponent;

  modulos = signal<Modulo[]>([]);
  moduleConfirmation = signal<Modulo | null>(null);
  submoduleConfirmation = signal<Submodulo | null>(null);
  moduleId = signal<string | null>(null);

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
    console.log(this.modulosService.modulos(), 'modulos actuales');

    // this.modulos.set(this.modulosService.modulos());
  }

  expandRows(id: string) {
    const row = document.querySelector(`#expanded-row-${id}`);
    const accordeon = document.querySelector(`#accordeon-${id}`);
    const accordeonBody = document.querySelectorAll(`.accordeon-body-${id}`);

    row?.classList.toggle('active');
    accordeon?.classList.toggle('active');

    if (accordeonBody.length > 0) {
      accordeonBody.forEach((item) => {
        item.classList.toggle('active');
      });
    }

    // accordeonBody?.classList.toggle('active');
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
  deleteSubModuleConfirmation(module: Submodulo, id: string) {
    const row = document.querySelector(`#expanded-row-${id}`);
    const accordeon = document.querySelector(`#accordeon-${id}`);
    const accordeonBody = document.querySelectorAll(`.accordeon-body-${id}`);

    this.submoduleConfirmation.set(module);
    this.moduleId.set(id);

    row?.classList?.remove('active');
    accordeon?.classList?.remove('active');

    if (accordeonBody.length > 0) {
      accordeonBody.forEach((item) => {
        item.classList.remove('active');
      });
    }

    this.deleteSubModuleModal.showModal();
  }
  cancelDeleteModuleModal() {
    this.deleteModuleModal.closeModal();
    this.moduleConfirmation.set(null);
  }

  cancelDeleteSubModuleModal() {
    this.deleteSubModuleModal.closeModal();
    this.moduleConfirmation.set(null);
  }

  editSubmodule(moduleId: string, submodule: Submodulo) {
    const row = document.querySelector(`#expanded-row-${moduleId}`);
    const accordeon = document.querySelector(`#accordeon-${moduleId}`);
    const submodules = document.querySelectorAll(`.accordeon-body-${moduleId}`);

    row?.classList.remove('active');
    accordeon?.classList.remove('active');
    submodules.forEach((item) => {
      item.classList.remove('active');
    });
    this.moduleId.set(moduleId);
    this.submoduleConfirmation.set(submodule);
    this.editSubModuleModal.showModal();
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
  async deleteSubModule() {
    try {
      const response = await firstValueFrom(
        this.modulosService.deleteSubmodule(this.submoduleConfirmation()!.id)
      );
      this.alertaService.setMessage(response.message);
      const row = document.querySelector(`#expanded-row-${this.moduleId()}`);
      const accordeon = document.querySelector(`#accordeon-${this.moduleId()}`);
      const submodules = document.querySelectorAll(
        `.accordeon-body-${this.moduleId()}`
      );

      row?.classList.toggle('active');
      accordeon?.classList.toggle('active');
      submodules.forEach((item) => {
        item.classList.toggle('active');
      });

      await this.modulosService.getAllModules();
      this.deleteSubModuleModal.closeModal();
      this.submoduleConfirmation.set(null);
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
  closeEditSubModuleModal() {
    this.editSubModuleModal.closeModal();
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

    row?.classList?.add('active');
    accordeon?.classList?.add('active');
    accordeonBody?.classList?.add('active');

    this.moduleConfirmation.set(module);
    this.editModuleModal.showModal();
  }
}
