import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-errores-frontend',
  imports: [CommonModule],
  templateUrl: './errores-frontend.component.html',
  styleUrl: './errores-frontend.component.css',
})
export class ErroresFrontendComponent {
  mensaje = input<string>('');
}
