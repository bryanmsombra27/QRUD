import { Component, input, output } from '@angular/core';
import { ErroresFrontendComponent } from '../../errores-frontend/errores-frontend.component';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text',
  imports: [ErroresFrontendComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css',
})
export class TextComponent {
  removeAlerts = output<boolean>();
  form = input.required<FormGroup>();
  fieldName = input.required<string>();
  label = input.required<string>();
  type = input<string>('text');
  frontendError = input.required({ alias: 'error' });

  campoValido(campo: string) {
    return !this.form().get(campo)?.valid && this.form().get(campo)?.touched;
  }

  removerAlertas() {
    this.removeAlerts.emit(false);
  }
}
