import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  imports: [CommonModule],
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css',
})
export class PaginacionComponent implements OnInit {
  totalPages = input<number>(1);
  actualPage = input<number>(1);
  arregloPaginas = signal<number[]>([]);
  changePage = output<number>();

  ngOnInit(): void {
    const pages = Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );
    this.arregloPaginas.set(pages);
  }

  prevOrNextPage(page: number) {
    const p = this.actualPage() + 1;

    if (p <= 1 || p - 1 > this.totalPages()) {
      return;
    }
    const newPage = this.actualPage() + page;

    this.changePage.emit(newPage);
  }

  /**
   * Con este metodo se muestra una pagina en especifico sin necesidad de ir cambiando con los botones de retroceso o siguiente
   * @param n recibe el numero de pagina que el usuario desea acceder
   *
   */
  saltoEntrePaginas(page: number) {
    this.changePage.emit(page);
  }
}
