import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn',
  imports: [],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.css',
})
export class BtnComponent {
  text = input.required<string>();
}
