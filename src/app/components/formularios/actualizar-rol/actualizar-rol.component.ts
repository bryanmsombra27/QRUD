import { Component, inject, input, output, signal } from '@angular/core';
import { ErroresFrontendComponent } from '../../shared/errores-frontend/errores-frontend.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CustomError,
  ErrorServidorService,
} from '../../../services/errorServidor.service';
import { ActualizarRol, Rol } from '../../../interfaces/rol.interface';
import { firstValueFrom } from 'rxjs';
import { RolService } from '../../../services/rol.service';
import { TextComponent } from '../../shared/inputs/text/text.component';

@Component({
  selector: 'app-actualizar-rol',
  imports: [ErroresFrontendComponent, ReactiveFormsModule, TextComponent],
  templateUrl: './actualizar-rol.component.html',
  styleUrl: './actualizar-rol.component.css',
})
export class ActualizarRolComponent {
  /**
   * propiedad que contiene el formulario reactivo
   */
  form!: FormGroup;
  rol = input.required<Rol>();
  //  roles = signal<Rol[]>([]);
  ocultar = output<boolean>();
  msgExito = output<string>();
  private fb = inject(FormBuilder);
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
    this.FormularioUsuario();
  }

  /**
   * metodo que inicializa el formulario reactivo con sus respectivos campos y validaciones
   */
  FormularioUsuario() {
    this.form = this.fb.group({
      name: [this.rol().name, Validators.required],
      description: [this.rol().description, [Validators.required]],
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

    const { description, name }: ActualizarRol = this.form.value;

    const usuarioActualizado: ActualizarRol = {
      name: name.trim().toLowerCase(),
      description: description.trim().toLowerCase(),
    };
    try {
      const response = await firstValueFrom(
        this.rolesService.updateRol(this.rol().id, usuarioActualizado)
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
