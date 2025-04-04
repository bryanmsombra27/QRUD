import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorServidorService } from '../../services/errorServidor.service';
import { RegistroUsuario } from '../../interfaces/usuario.interface';
import { ErroresFrontendComponent } from '../../components/shared/errores-frontend/errores-frontend.component';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { CommonModule } from '@angular/common';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro-usuario',
  imports: [
    ErroresFrontendComponent,
    ErroresBackendComponent,
    CommonModule,
    ReactiveFormsModule,
    ExitoComponent,
  ],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css',
})
export default class RegistroUsuarioComponent {
  existeError: boolean = false;
  errores!: [{ msg: string }];

  form!: FormGroup;
  msgExito = signal<string>('');
  errorServidor = signal<string>('');

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private AuthService = inject(AuthService);
  private ErrorServidor = inject(ErrorServidorService);
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.FormularioUsuario();
  }

  FormularioUsuario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      rfc: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[ña-z]{3,4}[0-9]{6}[0-9a-z]{3}$/i),
        ],
      ],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]\d{9}$/g)],
      ],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, direccion, nombre, rfc, telefono }: RegistroUsuario =
      this.form.value;

    const usuario: RegistroUsuario = {
      email: email.trim().toLowerCase(),
      direccion: direccion.trim().toLowerCase(),
      nombre: nombre.trim().toLowerCase(),
      rfc: rfc.trim().toLowerCase(),
      telefono,
    };

    try {
      const response = await firstValueFrom(
        this.usuarioService.createUser(usuario)
      );

      this.msgExito.set(response.message);
      this.form.reset();
      setTimeout(() => {
        this.msgExito.set('');
      }, 2000);
    } catch (err: any) {
      this.errorServidor.set(err.error.message);
      setTimeout(() => {
        this.errorServidor.set('');
      }, 2500);
    }
  }

  campoValido(campo: string) {
    return !this.form.get(campo)?.valid && this.form.get(campo)?.touched;
  }

  removerAlertas() {
    this.existeError = false;
    this.errorServidor.set('');
  }
}
