import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { SwitchBoxComponent } from '../../components/shared/switch-box/switch-box.component';
@Component({
  selector: 'app-permissions',
  imports: [TableModule, CommonModule, SwitchBoxComponent],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css',
})
export default class PermissionsComponent {
  products = [
    {
      code: 'aqos',
      name: 'koso',
      category: 'kjooso',
      quantity: 1200,
    },
  ];
  expandedRows: { [key: string]: boolean } = {};

  onRowExpand(event: TableRowExpandEvent) {}

  onRowCollapse(event: TableRowCollapseEvent) {}

  toggleRow(product: any) {
    this.expandedRows[product.id] = !this.expandedRows[product.id];
  }
}
