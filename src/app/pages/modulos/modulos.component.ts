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
import { OpenCustomModalComponent } from '../../components/shared/open-custom-modal/open-custom-modal.component';
import { PaginacionComponent } from '../../components/shared/paginacion/paginacion.component';
import { CustomModalComponent } from '../../components/shared/custom-modal/custom-modal.component';
import { ModulosService } from '../../services/modulos.service';
import { Modulo } from '../../interfaces/modulos.interface';
import { CommonModule } from '@angular/common';
import { AccordeonComponent } from '../../components/shared/accordeon/accordeon.component';

@Component({
  selector: 'app-modulos',
  imports: [
    CommonModule,
    ExitoComponent,
    SpinnerComponent,
    BuscadorComponent,
    OpenCustomModalComponent,
    PaginacionComponent,
    CustomModalComponent,
    AccordeonComponent,
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

  ngOnInit(): void {
    this.getModules();
  }

  openModal() {
    this.customModal.showModal();
  }
  async getModules() {
    await this.modulosService.getAllModules();
    this.modulos.set(this.modulosService.modules);
  }

  expandRows(id: string) {
    const row = document.querySelector(`#expanded-row-${id}`);
    const accordeon = document.querySelector(`#accordeon-${id}`);
    const accordeonBody = document.querySelector(`#accordeon-body-${id}`);

    row?.classList.toggle('active');
    accordeon?.classList.toggle('active');
    accordeonBody?.classList.toggle('active');
  }
}
