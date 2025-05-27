import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { SwitchBoxComponent } from '../../components/shared/switch-box/switch-box.component';
import { ModulosService } from '../../services/modulos.service';
import { Modulo } from '../../interfaces/modulos.interface';
@Component({
  selector: 'app-permissions',
  imports: [TableModule, CommonModule, SwitchBoxComponent],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css',
})
export default class PermissionsComponent implements OnInit {
  modulosService = inject(ModulosService);
  permissionAsignation = signal<PermisionAsignation[]>([]);
  // permissionAsignation = signal<any>([]);

  ngOnInit(): void {
    this.getModules();
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

  asignarPermisos() {
    console.log(this.permissionAsignation(), 'PERMISOS DE MODULOS');
  }

  handlePermissionsOnChange(
    permission: Modulo & {
      type: 'write' | 'delete' | 'edit';
      submoduleId: string;
    }
  ) {
    console.log('se dispara', permission);

    const index = this.permissionAsignation().findIndex(
      (modulo: any) => modulo.id === permission.id
    );

    if (index >= 0) {
      if (permission.submoduleId) {
        const submoduleIndex =
          this.permissionAsignation()[index]?.submodules?.findIndex(
            (submodulo) => submodulo.id == permission.submoduleId
          ) ?? -1;

        if (submoduleIndex >= 0) {
          this.permissionAsignation.update((state: any) => {
            state[index] = {
              ...state[index],
              submodules: [
                ...state[index].submodules,
                {
                  ...state[index].submodules[submoduleIndex],
                  [permission.type]:
                    !state[index].submodules[submoduleIndex][permission.type],
                },
              ],
            };

            return state;
          });
        }
      } else {
        //cuando es un solo modulo
        this.permissionAsignation.update((state) => {
          state[index] = {
            ...state[index],
            [permission.type]: !state[index][permission.type],
          };

          return state;
        });
      }
    } else {
      if (permission.submoduleId) {
        // cuando son varios submodulos
        this.permissionAsignation.update((state) => {
          const submoduleIndex =
            this.permissionAsignation()[index]?.submodules?.findIndex(
              (submodulo) => submodulo.id == permission.submoduleId
            ) ?? -1;

          // const submodules =

          return [
            ...state,
            {
              id: permission.id,
              edit: false,
              delete: false,
              write: false,
              submodules: [
                ...this.permissionAsignation()[index]?.submodules!,
                {
                  id: permission.submoduleId,
                  edit: permission.type === 'edit' && true,
                  delete: permission.type === 'delete' && true,
                  write: permission.type === 'write' && true,
                },
              ],
            },
          ];
        });
      } else {
        // cuando es un solo modulo
        this.permissionAsignation.update((state: PermisionAsignation[]) => {
          return [
            ...state,
            {
              id: permission.id,
              edit: permission.type === 'edit' && true,
              delete: permission.type === 'delete' && true,
              write: permission.type === 'write' && true,
            },
          ] as PermisionAsignation[];
        });
      }
    }
  }
}

interface PermisionAsignation {
  id: string;
  edit: boolean;
  delete: boolean;
  write: boolean;
  submodules?: {
    id: string;
    edit: boolean;
    delete: boolean;
    write: boolean;
  }[];
}
