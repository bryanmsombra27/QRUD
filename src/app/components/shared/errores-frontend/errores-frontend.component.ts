import { Component, input } from '@angular/core';

@Component({
  selector: 'app-errores-frontend',
  imports: [],
  templateUrl: './errores-frontend.component.html',
  styleUrl: './errores-frontend.component.css',
})
export class ErroresFrontendComponent {
  mensaje = input<string>('');
}
