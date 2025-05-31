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
import { PermissionService } from '../../services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { AlertaService } from '../../services/alerta.service';
import {
  ModuleType,
  Permisos_modulos,
} from '../../interfaces/permission.interface';
@Component({
  selector: 'app-permissions',
  imports: [TableModule, CommonModule, SwitchBoxComponent, ExitoComponent],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css',
})
export default class PermissionsComponent implements OnInit {
  modulosService = inject(ModulosService);
  permisosService = inject(PermissionService);
  alertaService = inject(AlertaService);
  private ErrorServidor = inject(ErrorServidorService);
  router = inject(ActivatedRoute);

  permissionAsignation = signal<PermisionAsignation[]>([]);
  // permissionAsignation = signal<any>([]);
  rolAssignation = signal<Permisos_modulos[]>([]);

  ngOnInit(): void {
    this.getModules();
    this.asignationByRol();
  }

  async getModules() {
    await this.modulosService.getAllModules();
    // console.log(this.modulosService.modulos(), 'modulos actuales');

    // this.modulos.set(this.modulosService.modulos());
  }

  async asignationByRol() {
    try {
      const roleId = this.router.snapshot.params['id'];
      const response = await firstValueFrom(
        this.permisosService.getAssinatedModulesByRole(roleId)
      );
      this.rolAssignation.set(response.permisos);

      // console.log(response.permisos, 'PERMISOS ASIGNADOR POR ROL');
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
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

  // console.log(this.router., 'ROLE ID');
  async asignarPermisos() {
    console.log(this.permissionAsignation(), 'PERMISOS DE MODULOS');
    const roleId = this.router.snapshot.params['id'];
    try {
      const response = await firstValueFrom(
        this.permisosService.assignPermission(
          roleId,
          this.permissionAsignation()
        )
      );
      this.alertaService.setMessage(response.message);

      setTimeout(() => {
        this.alertaService.clearMessage();
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  handlePermissionsOnChange(
    permission: Modulo & {
      type: ModuleType;
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
            state[index].submodules[submoduleIndex] = {
              ...state[index].submodules[submoduleIndex],
              [permission.type]:
                !state[index].submodules[submoduleIndex][permission.type],
            };

            state[index] = {
              ...state[index],
              submodules: [...state[index].submodules],
            };

            return state;
          });
        } else {
          this.permissionAsignation.update((state: any) => {
            state[index] = {
              ...state[index],
              submodules: [
                ...state[index].submodules,
                {
                  edit: permission.type === 'edit' ? true : false,
                  delete: permission.type === 'delete' ? true : false,
                  write: permission.type === 'write' ? true : false,
                  read: permission.type === 'read' ? true : false,
                  id: permission.submoduleId,
                  [permission.type]: !state[index][permission.type],
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
          return [
            ...state,
            {
              id: permission.id,
              edit: false,
              delete: false,
              write: false,
              read: false,
              submodules: [
                // ...this.permissionAsignation()[index]?.submodules!,
                {
                  id: permission.submoduleId,
                  edit: permission.type === 'edit' && true,
                  delete: permission.type === 'delete' && true,
                  read: permission.type === 'read' ? true : false,
                  write: permission.type === 'write' && true,
                },
              ],
            },
          ];
        });
      } else {
        // cuando es un solo modulo
        this.permissionAsignation.update((state: PermisionAsignation[]) => {
          // si el permiso ya fue asignado  pasar la referencia
          const moduleFound = this.rolAssignation().find(
            (asignation) => asignation.module_id === permission.id
          )!;

          return [
            ...state,
            {
              id: permission.id,
              edit: moduleFound.edit,
              delete: moduleFound.delete,
              write: moduleFound.write,
              read: moduleFound.read,
              [permission.type]: !moduleFound[permission.type],
            },
          ] as PermisionAsignation[];
        });
      }
    }
  }

  moduleIsAlreadyAssigned(
    module: Modulo,
    type: ModuleType,
    submodule?: string
  ) {
    const moduleFound = this.rolAssignation().find(
      (asignation) => asignation.module_id === module.id
    )!;

    if (submodule) {
      const submoduleFound = moduleFound.Permisos_submodulos.find(
        (submodulo) => submodulo.submodule_id == submodule
      );

      return submoduleFound && submoduleFound[type] ? true : false;
    }

    return moduleFound && moduleFound[type] ? true : false;
  }
}

interface PermisionAsignation {
  id: string;
  read: boolean;
  edit: boolean;
  delete: boolean;
  write: boolean;
  submodules?: {
    id: string;
    edit: boolean;
    delete: boolean;
    write: boolean;
    read: boolean;
  }[];
}
