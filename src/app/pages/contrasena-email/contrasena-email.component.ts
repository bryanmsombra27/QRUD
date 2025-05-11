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
import { Router, RouterModule } from '@angular/router';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { PersonalService } from '../../services/personal.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TextComponent } from '../../components/shared/inputs/text/text.component';
import { BtnComponent } from '../../components/shared/btn/btn.component';

@Component({
  selector: 'app-contrasena-email',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExitoComponent,
    ErroresBackendComponent,
    TextComponent,
    RouterModule,
    BtnComponent,
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
  // msgError: string = '';

  /**
   * inyeccion de servicios en el constructor
   */
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private errorServidor = inject(ErrorServidorService);
  private personalService = inject(PersonalService);

  msgExito = signal<string>('');
  msgError = signal<string>('');
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
    } catch (error: any) {
      this.msgError.set(error.error.message);
      this.errorServidor.invalidToken(error as CustomError);

      setTimeout(() => {
        this.msgError.set('');
      }, 2000);
    }
  }
}
