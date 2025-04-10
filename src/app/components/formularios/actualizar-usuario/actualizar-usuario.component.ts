import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { ErroresFrontendComponent } from '../../shared/errores-frontend/errores-frontend.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistroUsuario, User } from '../../../interfaces/usuario.interface';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { firstValueFrom } from 'rxjs';
import {
  CustomError,
  ErrorServidorService,
} from '../../../services/errorServidor.service';
import { TextComponent } from '../../shared/inputs/text/text.component';

@Component({
  selector: 'app-actualizar-usuario',
  imports: [ReactiveFormsModule, CommonModule, TextComponent],
  templateUrl: './actualizar-usuario.component.html',
  styleUrl: './actualizar-usuario.component.css',
})
export class ActualizarUsuarioComponent {
  /**
   * propiedad que contiene el formulario reactivo
   */
  form!: FormGroup;
  usuario = input.required<User>();
  ocultar = output<boolean>();
  msgExito = output<string>();
  private fb = inject(FormBuilder);
  private userService = inject(UsuarioService);
  private errorService = inject(ErrorServidorService);

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
      nombre: [this.usuario().nombre, Validators.required],
      rfc: [
        this.usuario().rfc,
        [
          Validators.required,
          Validators.pattern(/^[ña-z]{3,4}[0-9]{6}[0-9a-z]{3}$/i),
        ],
      ],
      telefono: [
        this.usuario().telefono,
        [Validators.required, Validators.pattern(/^[0-9]\d{9}$/g)],
      ],
      direccion: [this.usuario().direccion, Validators.required],
      email: [this.usuario().email, [Validators.required, Validators.email]],
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

    const { email, direccion, nombre, rfc, telefono }: RegistroUsuario =
      this.form.value;

    const usuarioActualizado: RegistroUsuario = {
      email: email.trim().toLowerCase(),
      direccion: direccion.trim().toLowerCase(),
      nombre: nombre.trim().toLowerCase(),
      rfc: rfc.trim().toLowerCase(),
      telefono,
    };
    try {
      const response = await firstValueFrom(
        this.userService.updateUser(this.usuario().id, usuarioActualizado)
      );
      this.form.reset();
      this.msgExito.emit(response.message!);
      this.ocultar.emit(false);
    } catch (error) {
      this.errorService.invalidToken(error as CustomError);
    }
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
