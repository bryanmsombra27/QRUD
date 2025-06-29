import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { PersonalLogin } from '../../interfaces/login.interface';
import { firstValueFrom } from 'rxjs';
import { ErrorServidorService } from '../../services/errorServidor.service';
import { CommonModule } from '@angular/common';
import { ErroresFrontendComponent } from '../../components/shared/errores-frontend/errores-frontend.component';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { TextComponent } from '../../components/shared/inputs/text/text.component';
import { BtnComponent } from '../../components/shared/btn/btn.component';
import { SpinnerScreenComponent } from '../../components/shared/spinner-screen/spinner-screen.component';
import { CustomModalComponent } from '../../components/shared/custom-modal/custom-modal.component';
import { LoginQrComponent } from '../login-qr/login-qr.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErroresBackendComponent,
    RouterModule,
    TextComponent,
    BtnComponent,
    SpinnerScreenComponent,
    CustomModalComponent,
    LoginQrComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loginExistoso = signal<boolean>(false);
  msgErrores = signal<string>('');

  @ViewChild(CustomModalComponent)
  customModal!: CustomModalComponent;

  // services
  private fb = inject(FormBuilder);
  private AuthService = inject(AuthService);
  private router = inject(Router);
  private StorageService = inject(StorageService);
  private ErrorServidor = inject(ErrorServidorService);

  ngOnInit(): void {
    this.formularioLogin();
  }
  formularioLogin() {
    this.form = this.fb.group({
      email: [
        'Sandrine84@hotmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['123456', [Validators.required]],
    });
  }

  async login() {
    if (this.form.invalid) {
      return;
    }

    const personal: PersonalLogin = this.form.value;

    this.loginExistoso.set(true);

    try {
      this.msgErrores.set('');
      const response = await this.AuthService.login(personal);
      this.StorageService.encryptar('nombre', response.personal.nombre);
      this.StorageService.encryptar(
        'menu',
        JSON.stringify(response.personal.rol.Permisos_modulos)
      );

      setTimeout(() => {
        this.loginExistoso.set(false);
        this.router.navigateByUrl('/');
      }, 1000);
    } catch (err: any) {
      if (err.error.message) {
        this.loginExistoso.set(false);
        this.msgErrores.set(err.error.message);
      } else {
        this.ErrorServidor.error();
      }
    }
  }

  removerAlertas() {
    this.msgErrores.set('');
  }

  openModal() {
    this.customModal.showModal();
  }
}
