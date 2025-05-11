import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { ErroresFrontendComponent } from '../../components/shared/errores-frontend/errores-frontend.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { RegistroRol } from '../../interfaces/rol.interface';
import { firstValueFrom } from 'rxjs';
import { RolService } from '../../services/rol.service';
import { TextComponent } from '../../components/shared/inputs/text/text.component';
import { TextareaComponent } from '../../components/shared/inputs/textarea/textarea.component';
import { BtnComponent } from '../../components/shared/btn/btn.component';

@Component({
  selector: 'app-registro-rol',
  imports: [
    ErroresBackendComponent,
    ExitoComponent,
    CommonModule,
    ReactiveFormsModule,
    TextComponent,
    TextareaComponent,
    BtnComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './registro-rol.component.html',
  styleUrl: './registro-rol.component.css',
})
export default class RegistroRolComponent {
  /**
   * propiedad que contiene el formulario reactivo
   */
  form!: FormGroup;

  /**
   * propiedad para mostrar mensajes de error solo si existe
   */
  existeError: boolean = false;

  /**
   * propiedad que contiene un arreglo con los mensajes de error proveido por las validaciones del backend
   */
  errores!: [{ msg: string }];

  /**
   * propiedad que contiene el mensaje de exito
   */
  // msgExito: string = '';

  msgExito = signal<string>('');

  /**
   * inyeccion de servicios
   */
  private fb = inject(FormBuilder);
  private ErrorServidor = inject(ErrorServidorService);
  private rolService = inject(RolService);

  /**
   * Inicializando el formulario reactivo una vez se inicie el componente
   */
  ngOnInit(): void {
    this.FormularioRol();
  }

  /**
   * metodo que inicializa el formulario reactivo con sus respectivos campos y validaciones
   */
  FormularioRol() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['rol', Validators.required],
    });
  }

  /**
   * metodo que registra el nuevo  rol
   */
  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { description, name }: RegistroRol = this.form.value;

    const rol = {
      name: name.toLowerCase().trim(),
      description: description.trim().toLowerCase(),
    };

    try {
      const response = await firstValueFrom(this.rolService.createRole(rol));

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
   * metodo que remueve los mensajes de error solo si existen
   */
  removerAlertas() {
    this.existeError = false;
  }
}
