import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn',
  imports: [CommonModule],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.css',
})
export class BtnComponent {
  text = input.required<string>();
  center = input<boolean>(true);
}
