import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { ErroresFrontendComponent } from '../../components/shared/errores-frontend/errores-frontend.component';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { UpdatePassword } from '../../interfaces/personal.interface';
import { PersonalService } from '../../services/personal.service';
import { firstValueFrom } from 'rxjs';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { TextComponent } from '../../components/shared/inputs/text/text.component';

@Component({
  selector: 'app-cambio-contrasena',
  imports: [
    ErroresBackendComponent,
    ReactiveFormsModule,
    CommonModule,
    ExitoComponent,
    TextComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cambio-contrasena.component.html',
  styleUrl: './cambio-contrasena.component.css',
})
export default class CambioContrasenaComponent {
  /**
   * propiedad que contiene el formulario reactivo
   */
  form!: FormGroup;
  /**
   * propiedad para mostrar mensajes de error solo si existe
   */
  existeError: boolean = false;
  /**
   * propiedad que contiene el mensaje de error proveido por las validaciones del backend
   */
  error: string = '';

  /**
   * inyeccion de dependencias
   */
  private fb = inject(FormBuilder);
  private ErrorServidor = inject(ErrorServidorService);
  private StorageService = inject(StorageService);
  private personalService = inject(PersonalService);
  msgExito = signal<string>('');
  nombreUsuario = signal<string>('');

  /**
   * inicializando el formulario reactivo y obteniendo el nombre del usuario
   */
  ngOnInit(): void {
    this.cambiarContrasena();
    this.nombre();
  }
  /**
   * metodo que inicializa el formulario reactivo con sus respectivos campos y validaciones
   */
  cambiarContrasena() {
    this.form = this.fb.group(
      {
        last_password: [
          '',
          [
            Validators.required,
            // Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/),
          ],
        ],
        new_password: [
          '',
          [
            Validators.required,
            // Validators.pattern(
            //   /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/g
            // ),
          ],
        ],
        new_password_confirmation: ['', [Validators.required]],
      },
      { validators: this.passwordsIguales('newpwd', 'newpwd2') }
    );
  }
  /**
   * metodo que se encarga de realizar el cambio de contraseña y enviar el mensaje de exito o error al usuario en caso de que se haya realizado o no
   */
  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const actualizarContrasena: UpdatePassword = this.form.value;

    try {
      const response = await firstValueFrom(
        this.personalService.updatePassword(actualizarContrasena)
      );

      this.msgExito.set(response.message);
      this.form.reset();
      setTimeout(() => {
        this.msgExito.set('');
      }, 2000);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * validacion personalizada que se encarga de validar que las contraseñas sean iguales
   */
  passwordsIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsigual: true });
      }
    };
  }

  /**
   * metodo que remueve los mensajes de error solo si existen
   */
  removerAlertas() {
    this.existeError = false;
  }
  /**
   * obtiene el nombre del usuario que desea cambiar la contraseña
   */
  nombre() {
    this.nombreUsuario.set(this.StorageService.desencriptar('nombre'));
  }
}
