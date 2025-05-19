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
import { TextComponent } from '../../shared/inputs/text/text.component';
import { firstValueFrom } from 'rxjs';
import {
  CustomError,
  ErrorServidorService,
} from '../../../services/errorServidor.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModulosService } from '../../../services/modulos.service';
import { AlertaService } from '../../../services/alerta.service';
import { Submodulo, UpdateModule } from '../../../interfaces/modulos.interface';

@Component({
  selector: 'app-actualizar-submodulo',
  imports: [TextComponent, ReactiveFormsModule],
  templateUrl: './actualizar-submodulo.component.html',
  styleUrl: './actualizar-submodulo.component.css',
})
export class ActualizarSubmoduloComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.addModuleForm();
  }
  ngOnInit(): void {
    this.addModuleForm();
  }
  isSubmodule = signal<boolean>(false);
  form!: FormGroup;
  module = input.required<Submodulo>();
  moduleId = input.required<string>();

  closeModal = output<boolean>();

  private fb = inject(FormBuilder);
  private moduloService = inject(ModulosService);
  private ErrorServidor = inject(ErrorServidorService);
  private alertaService = inject(AlertaService);

  // AGREGAR MODULO
  addModuleForm() {
    this.form = this.fb.group({
      name: [this.module()?.name, Validators.required],
      route: [this.module()?.route, Validators.required],
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
      route: [this.form.get('route')?.value, Validators.required],
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
        this.moduloService.updateSubmodule(this.module().id, {
          icon,
          name,
          route: routeWithSlash,
        })
      );
      const row = document.querySelector(`#expanded-row-${this.moduleId()}`);
      const accordeon = document.querySelector(`#accordeon-${this.moduleId()}`);
      const submodules = document.querySelectorAll(
        `.accordeon-body-${this.moduleId()}`
      );

      row?.classList.toggle('active');
      accordeon?.classList.toggle('active');
      submodules.forEach((item) => {
        item.classList.toggle('active');
      });

      this.alertaService.setMessage(response.message);
      await this.moduloService.getAllModules();

      this.closeModal.emit(true);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
}
