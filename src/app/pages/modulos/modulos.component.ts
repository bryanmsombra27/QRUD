import {
  ChangeDetectorRef,
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
import { OpenCustomModalComponent } from '../../components/shared/open-custom-modal/open-custom-modal.component';
import { PaginacionComponent } from '../../components/shared/paginacion/paginacion.component';
import { CustomModalComponent } from '../../components/shared/custom-modal/custom-modal.component';
import { ModulosService } from '../../services/modulos.service';
import { Modulo } from '../../interfaces/modulos.interface';
import { CommonModule } from '@angular/common';
import { AccordeonComponent } from '../../components/shared/accordeon/accordeon.component';
import { TextComponent } from '../../components/shared/inputs/text/text.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CrearModuloComponent } from '../../components/formularios/crear-modulo/crear-modulo.component';
import { AlertaService } from '../../services/alerta.service';

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.css',
})
export default class ModulosComponent implements OnInit {
  @ViewChild(CustomModalComponent)
  customModal!: CustomModalComponent;
  modulos = signal<Modulo[]>([]);

  modulosService = inject(ModulosService);
  alertaService = inject(AlertaService);

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

  async resetModuleModal() {
    this.customModal.closeModal();
    // await this.modulosService.getAllModules();
    setTimeout(() => {
      this.alertaService.clearMessage();
    }, 1500);
  }
}
