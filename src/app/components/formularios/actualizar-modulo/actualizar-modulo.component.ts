import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
import { ModulosService } from '../../../services/modulos.service';
import { AlertaService } from '../../../services/alerta.service';
import { TextComponent } from '../../shared/inputs/text/text.component';
import {
  CreateModule,
  Modulo,
  UpdateModule,
} from '../../../interfaces/modulos.interface';

@Component({
  selector: 'app-actualizar-modulo',
  imports: [ReactiveFormsModule, CommonModule, TextComponent],
  templateUrl: './actualizar-modulo.component.html',
  styleUrl: './actualizar-modulo.component.css',
})
export class ActualizarModuloComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.addModuleForm();
  }
  ngOnInit(): void {
    this.addModuleForm();
  }
  isSubmodule = signal<boolean>(false);
  form!: FormGroup;
  module = input.required<Modulo>();

  closeModal = output<boolean>();

  private fb = inject(FormBuilder);
  private moduloService = inject(ModulosService);
  private ErrorServidor = inject(ErrorServidorService);
  private alertaService = inject(AlertaService);

  // AGREGAR MODULO
  addModuleForm() {
    console.log(this.module(), 'editar');

    this.form = this.fb.group({
      name: [this.module()?.name, Validators.required],
      route: [this.module()?.route],
      icon: [this.module()?.icon, Validators.required],
    });
  }
  // AGREGAR SUBMODULOS DE FORMA DINAMICA
  addSubmoduleDynamicForm() {
    return this.fb.group({
      name: ['', Validators.required],
      route: ['', Validators.required],
      icon: ['', Validators.required],
    });
  }

  addSubmodule() {
    this.isSubmodule.set(true);

    this.form = this.fb.group({
      name: [this.form.get('name')?.value, Validators.required],
      icon: [this.form.get('icon')?.value, Validators.required],
    });
  }
  removeSubmodule(index: number) {}

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const { icon, name, route } = this.form.value as UpdateModule;

    const routeWithSlash = route?.includes('/') ? route : `/${route}`;

    try {
      const response = await firstValueFrom(
        this.moduloService.updateModule(this.module().id, {
          icon,
          name,
          route: routeWithSlash,
        })
      );

      this.alertaService.setMessage(response.message);
      await this.moduloService.getAllModules();

      this.closeModal.emit(true);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
}
