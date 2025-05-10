import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ErroresFrontendComponent } from '../../errores-frontend/errores-frontend.component';
import { CommonModule } from '@angular/common';

export interface SelectOptions {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [ErroresFrontendComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  form = input.required<FormGroup>();
  fieldName = input.required<string>();
  label = input<string>();
  selectedValue = input<string>();
  removeAlerts = output<boolean>();
  options = input.required<SelectOptions[]>();
  frontendError = input.required({ alias: 'error' });

  campoValido(campo: string) {
    return !this.form().get(campo)?.valid && this.form().get(campo)?.touched;
  }

  removerAlertas() {
    this.removeAlerts.emit(false);
  }

  selectValue(value: string) {
    return this.selectedValue() == value ? true : false;
  }
}
