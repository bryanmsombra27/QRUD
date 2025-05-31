import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextComponent } from '../../shared/inputs/text/text.component';
import {
  CreateModule,
  CreateSubmodule,
} from '../../../interfaces/modulos.interface';
import { ModulosService } from '../../../services/modulos.service';
import {
  CustomError,
  ErrorServidorService,
} from '../../../services/errorServidor.service';
import { firstValueFrom } from 'rxjs';
import { AlertaService } from '../../../services/alerta.service';

@Component({
  selector: 'app-crear-modulo',
  imports: [ReactiveFormsModule, CommonModule, TextComponent],
  templateUrl: './crear-modulo.component.html',
  styleUrl: './crear-modulo.component.css',
})
export class CrearModuloComponent implements OnInit {
  ngOnInit(): void {
    this.addModuleForm();
  }
  isSubmodule = signal<boolean>(false);
  form!: FormGroup;
  closeModal = output<boolean>();

  private fb = inject(FormBuilder);
  private moduloService = inject(ModulosService);
  private ErrorServidor = inject(ErrorServidorService);
  private alertaService = inject(AlertaService);

  // AGREGAR MODULO
  addModuleForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      route: [''],
      icon: ['', Validators.required],
      submodules: this.fb.array([]),
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

  get submodules(): FormGroup[] {
    return (this.form.get('submodules') as FormArray).controls as FormGroup[];
  }

  addSubmodule() {
    this.isSubmodule.set(true);
    const submodule = this.fb.array([
      ...this.submodules,
      this.addSubmoduleDynamicForm(),
    ]);
    this.form = this.fb.group({
      name: [this.form.get('name')?.value, Validators.required],
      icon: [this.form.get('icon')?.value, Validators.required],
      submodules: submodule,
    });
  }
  removeSubmodule(index: number) {
    (this.form.get('submodules') as FormArray).removeAt(index);
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { icon, name, route, submodules } = this.form.value as CreateModule;

    let submodulesWithSlash: CreateSubmodule[] = [];
    if (submodules!.length > 0) {
      submodulesWithSlash = submodules!.map((submodule) => ({
        name: submodule.name,
        icon: submodule.icon,
        route: `/${submodule.route}`,
      }));
    }

    try {
      const response = await firstValueFrom(
        this.moduloService.createModule({
          icon,
          name,
          route: route ? `/${route}` : undefined,
          submodules: submodulesWithSlash,
        })
      );
      this.alertaService.setMessage(response.message);
      await this.moduloService.getAllModules();

      this.closeModal.emit(true);
      this.form.reset();
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
}
