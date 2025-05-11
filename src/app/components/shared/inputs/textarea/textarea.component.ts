import { Component, input, output } from '@angular/core';
import { ErroresFrontendComponent } from '../../errores-frontend/errores-frontend.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [ErroresFrontendComponent, ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
})
export class TextareaComponent {
  removeAlerts = output<boolean>();
  form = input.required<FormGroup>();
  fieldName = input.required<string>();
  frontendError = input.required({ alias: 'error' });

  campoValido(campo: string) {
    return !this.form().get(campo)?.valid && this.form().get(campo)?.touched;
  }

  removerAlertas() {
    this.removeAlerts.emit(false);
  }
}
