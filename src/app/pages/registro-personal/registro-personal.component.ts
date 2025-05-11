import { Component, inject, OnInit, output, signal } from '@angular/core';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
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
import { RegistroPersonal } from '../../interfaces/personal.interface';
import { PersonalService } from '../../services/personal.service';
import { CommonModule } from '@angular/common';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../interfaces/rol.interface';
import { firstValueFrom } from 'rxjs';
import { TextComponent } from '../../components/shared/inputs/text/text.component';
import { SelectComponent } from '../../components/shared/inputs/select/select.component';
import { BtnComponent } from '../../components/shared/btn/btn.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-registro-personal',
  imports: [
    ErroresBackendComponent,
    ExitoComponent,
    ReactiveFormsModule,
    CommonModule,
    TextComponent,
    SelectComponent,
    BtnComponent,
  ],
  templateUrl: './registro-personal.component.html',
  styleUrl: './registro-personal.component.css',
})
export default class RegistroPersonalComponent implements OnInit {
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


  /**
   * inyeccion de servicios
   */
  private fb = inject(FormBuilder);
  private ErrorServidor = inject(ErrorServidorService);
  private personalService = inject(PersonalService);
  private rolService = inject(RolService);
  private modalService = inject(ModalService);
  msgExito = signal<string>('');
  // roles = signal<Rol[]>([]);
  roles = signal<{ label: string; value: string }[]>([]);

  refresh = output<boolean>();

  /**
   * Inicializando el formulario reactivo y obtiene los roles del personal para mostrarlos en el formulario
   */
  ngOnInit(): void {
    this.obtenerRoles();
    this.FormularioPersonal();
  }
  /**
   * metodo que inicializa el formulario reactivo con sus respectivos campos y validaciones
   */
  FormularioPersonal() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]\d{9}$/g)],
      ],
      // password:["", Validators.required,Validators.pattern(/^(?=.\d)(?=.[\u0021-\u002b\u003c-\u0040])(?=.[A-Z])(?=.[a-z])\S{8,16}$/)],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rolId: ['', Validators.required],
    });
  }
  /**
   * metodo que registra el nuevo  personal
   */
  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, nombre, password, rolId, telefono }: RegistroPersonal =
      this.form.value;
    const personal = {
      email: email.trim().toLowerCase(),
      nombre: nombre.trim().toLowerCase(),
      password: password.trim(),
      rolId,
      telefono,
    };
    try {
      const response = await firstValueFrom(
        this.personalService.createPersonal(personal)
      );
      this.msgExito.set(response.message);
      setTimeout(() => {
        this.msgExito.set('');
      }, 2000);
      this.form.reset();
      this.modalService.closeModal();
      this.refresh.emit(true);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * metodo que obtiene los roles del personal
   */
  async obtenerRoles() {
    try {
      const response = await firstValueFrom(this.rolService.getAllRoles());
      this.rolService.meta = response.meta;
      this.rolService.allRoles = response.roles;

      const roles = response.roles.map((rol) => ({
        label: rol.name,
        value: rol.id,
      }));

      this.roles.set(roles);

      // this.roles.set(this.rolService.allRoles);
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
