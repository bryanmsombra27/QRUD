import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordeon',
  imports: [],
  templateUrl: './accordeon.component.html',
  styleUrl: './accordeon.component.css',
})
export class AccordeonComponent implements OnInit {
  ngOnInit(): void {
    this.accoredon();
  }

  accoredon() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach((header) => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item?.querySelector('.accordion-content');

        // Cerrar todos los contenidos abiertos
        document.querySelectorAll('.accordion-content').forEach((c) => {
          if (c !== content) {
            c.classList.remove('open');
          }
        });

        // Alternar el actual
        content?.classList.toggle('open');
      });
    });
  }
}
