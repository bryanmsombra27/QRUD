import { Component, input } from '@angular/core';

@Component({
  selector: 'app-errores-backend',
  imports: [],
  templateUrl: './errores-backend.component.html',
  styleUrl: './errores-backend.component.css',
})
export class ErroresBackendComponent {
  msgError = input<string>('', { alias: 'mensaje' });
}
