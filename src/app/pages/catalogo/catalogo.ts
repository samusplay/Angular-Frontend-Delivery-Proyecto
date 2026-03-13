import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CatalogService } from './services/catalog.service';

@Component({
  selector: 'app-catalogo',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class CatalogoComponent implements OnInit {

  productos: any[] = [];

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.catalogService.obtenerCatalogo().subscribe({
      next: (data: any) => {
        this.productos = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  descontar(id: number) {

    const cantidad = 1;

    this.catalogService.descontarStock(id, cantidad).subscribe({
      next: () => {
        alert("Stock descontado correctamente");
        this.cargarCatalogo();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  reponer(id: number) {

    const cantidad = 1;

    this.catalogService.reponerStock(id, cantidad).subscribe({
      next: () => {
        alert("Stock repuesto correctamente");
        this.cargarCatalogo();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
