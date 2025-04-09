import { Component, inject, input, output, signal } from '@angular/core';
import { ErroresFrontendComponent } from '../../shared/errores-frontend/errores-frontend.component';
import {
  CustomError,
  ErrorServidorService,
} from '../../../services/errorServidor.service';
import { firstValueFrom } from 'rxjs';
import {
  ActualizarRegistroPersonal,
  Personal,
  RegistroPersonal,
} from '../../../interfaces/personal.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PersonalService } from '../../../services/personal.service';
import { Rol } from '../../../interfaces/rol.interface';
import { RolService } from '../../../services/rol.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-personal',
  imports: [ErroresFrontendComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-personal.component.html',
  styleUrl: './actualizar-personal.component.css',
})
export class ActualizarPersonalComponent {
  /**
   * propiedad que contiene el formulario reactivo
   */
  form!: FormGroup;
  personal = input.required<Personal>();
  roles = signal<Rol[]>([]);
  ocultar = output<boolean>();
  msgExito = output<string>();
  private fb = inject(FormBuilder);
  private personalService = inject(PersonalService);
  private errorService = inject(ErrorServidorService);
  private rolesService = inject(RolService);

  /**
   * propiedad para mostrar mensajes de error solo si existe
   */
  existeError: boolean = false;
  /**
   * propiedad que contiene un arreglo con los mensajes de error proveido por las validaciones del backend
   */
  errores!: [{ msg: string }];

  ngOnInit(): void {
    this.getRoles();
    this.FormularioUsuario();
  }

  async getRoles() {
    try {
      const response = await firstValueFrom(this.rolesService.getAllRoles());

      this.roles.set(response.roles);
    } catch (error) {
      this.errorService.invalidToken(error as CustomError);
    }
  }

  /**
   * metodo que inicializa el formulario reactivo con sus respectivos campos y validaciones
   */
  FormularioUsuario() {
    this.form = this.fb.group({
      nombre: [this.personal().nombre, Validators.required],
      telefono: [
        this.personal().telefono,
        [Validators.required, Validators.pattern(/^[0-9]\d{9}$/g)],
      ],
      rol: [this.personal().rol.id, Validators.required],
    });
  }
  /**
   * metodo que actualiza el usuario en el backend
   */
  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, telefono, rolId }: ActualizarRegistroPersonal =
      this.form.value;

    const usuarioActualizado: ActualizarRegistroPersonal = {
      nombre: nombre.trim().toLowerCase(),
      telefono,
      rolId,
    };
    try {
      const response = await firstValueFrom(
        this.personalService.updateUser(this.personal().id, usuarioActualizado)
      );
      this.form.reset();
      this.msgExito.emit(response.message!);
      this.ocultar.emit(false);
    } catch (error) {
      this.errorService.invalidToken(error as CustomError);
    }
  }

  /**
   * valida campos vacios del formulario reactivo si existen retorna un valor booleano true
   * @param campo recibe un campo del formulario para validar si contiene errores de validacion o no
   */
  campoValido(campo: string) {
    return !this.form.get(campo)?.valid && this.form.get(campo)?.touched;
  }
  /**
   * metodo que remueve los mensajes de error solo si existen
   */
  removerAlertas() {
    this.existeError = false;
  }
  /**
   * metodo que oculta el modal del formulario reactivo
   */
  ocultarFormulario() {
    this.ocultar.emit(false);
  }
}
