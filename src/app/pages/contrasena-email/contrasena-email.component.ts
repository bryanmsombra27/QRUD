import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { ErroresFrontendComponent } from '../../components/shared/errores-frontend/errores-frontend.component';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { PersonalService } from '../../services/personal.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contrasena-email',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExitoComponent,
    ErroresFrontendComponent,
    ErroresBackendComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contrasena-email.component.html',
  styleUrl: './contrasena-email.component.css',
})
export default class ContrasenaEmailComponent {
  /**
   * propiedad que contiene el formulario reactivo
   */
  form!: FormGroup;
  /**
   * almacena y muestra el mensaje de exito proveido por el backend una vez el correo  se haya generado con exito
   */
  // msgExito: string = '';

  /**
   * almacena y muestra el mensaje de error proveido por el backend cuando el email no coincide  o   no exista un error en el servidor
   */
  msgError: string = '';

  /**
   * bandera que permite mostrar el mensaje de error solo si existe un error
   */
  existeError: boolean = false;

  /**
   * bandera que permite mostrar el mensaje de exito solo si se realizo la accion correctamente
   */
  existeMsgExito: boolean = false;

  /**
   * inyeccion de servicios en el constructor
   */
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private errorServidor = inject(ErrorServidorService);
  private personalService = inject(PersonalService);

  msgExito = signal<string>('');
  /**
   * inicializando el formulario reactivo una vez el componente es cargado
   */
  ngOnInit(): void {
    this.restablecerContrasena();
  }

  /**
   * configuracion inicial el formulario reactivo
   */
  restablecerContrasena() {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });
  }
  /**
   * cuando se presiona el boton de enviar se realiza la peticion al servidor para enviar el correo electronico para restablecer la contraseña
   */
  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value;

    try {
      const response = await firstValueFrom(
        this.personalService.forgotPassword(email)
      );

      this.msgExito.set(response.message);
      this.form.reset();
      setTimeout(() => {
        this.msgExito.set('');
        this.router.navigateByUrl('/login');
      }, 2000);
    } catch (error) {
      this.errorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * valida campos vacios del formulario reactivo si existen retorna un valor booleano true
   * @param campo recibe un campo del formulario para validar si contiene errores de validacion o no
   */
  campoValido(campo: string) {
    return !this.form.get(campo)?.valid && this.form.get(campo)?.touched;
  }
}
