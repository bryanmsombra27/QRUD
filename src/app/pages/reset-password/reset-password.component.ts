import { Component, inject, signal } from '@angular/core';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { ErroresFrontendComponent } from '../../components/shared/errores-frontend/errores-frontend.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { EmailUpdatePassword } from '../../interfaces/personal.interface';
import { firstValueFrom } from 'rxjs';
import { PersonalService } from '../../services/personal.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    ExitoComponent,
    ErroresBackendComponent,
    ErroresFrontendComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export default class ResetPasswordComponent {
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
  msgError: string = '';

  /**
   * propiedad que contiene el mensaje de exito proveido por el backend solo si se realiza el cambio de constraseña exitosamente
   */
  // msgExito: string = '';
  /**
   * propiedad para mostrar mensajes de exito solo si se realiza el cambio de constraseña exitosamente
   */
  // existemsgExito: boolean = false;

  /**
   * proiedad privada que almacena  el token que viene en el url
   */
  // private token: any;
  /**
   * propiedad privada  que contiene el id del usuario que se va a restablecer la contraseña el cual se recibe por la url
   */
  // private id: any;

  /**
   * inyectando servicios
   */
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private errorService = inject(ErrorServidorService);
  private personalService = inject(PersonalService);

  private token = signal<string>('');
  private id = signal<string>('');
  msgExito = signal<string>('');

  /**
   * cuando se inicializa el componente se obtienen los datos del url para realizar el cambio de contrasena y se inicializa el formulario reactivo
   */
  ngOnInit(): void {
    this.cambiarContrasena();
    this.route.queryParams.subscribe((data: any) => {
      this.token.set(data.token);
      this.id.set(data.id);
    });
  }
  /**
   * metodo que inicializa el formulario reactivo con sus respectivos campos y validaciones
   */
  cambiarContrasena() {
    this.form = this.fb.group(
      {
        new_password: [
          '',
          [
            Validators.required,
            // Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/),
          ],
        ],
        new_password_confirmation: ['', [Validators.required]],
      },
      {
        validators: this.passwordsIguales(
          'new_password',
          'new_password_confirmation'
        ),
      }
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
    const actualizarContrasena: EmailUpdatePassword = this.form.value;
    try {
      const response = await firstValueFrom(
        this.personalService.updateEmailPassword(
          this.id(),
          this.token(),
          actualizarContrasena
        )
      );

      this.msgExito.set(response.message);
      this.form.reset();

      setTimeout(() => {
        this.msgExito.set('');
        this.router.navigateByUrl('/login');
      }, 2000);
    } catch (error) {
      this.errorService.invalidToken(error as CustomError);
    }

    //  this.QRUDService.restablecerContrasenaCorreo(actualizarContrasena,this.id,this.token).then((data:any) => {
    //    this.msgExito = data.msg
    //    this.form.reset();
    //    this.existemsgExito = true;

    //    setTimeout(() => {
    //      this.existemsgExito = false;
    //      this.router.navigateByUrl("/login")
    //    },1500)

    //  }).catch(err => {

    //      if(err.error.err){
    //        this.msgError = err.error.err;
    //        this.existeError = true;
    //        setTimeout(() =>{
    //          this.existeError = false;
    //        },1500)
    //        return;
    //      }

    //      this.ErrorServidor.error();

    //  })
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
}
