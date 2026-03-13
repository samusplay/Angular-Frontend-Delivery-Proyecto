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

  this.catalogService.obtenerCatalogo()
  .subscribe(data => {

    this.productos = data.sort((a, b) => a.id - b.id);

  });

}

  descontar(id: number) {

  this.catalogService.descontarStock(id, 1)
  .subscribe(() => {

    console.log("Stock descontado");

    this.cargarCatalogo();

  });

}


reponer(id: number) {

  this.catalogService.reponerStock(id, 1)
  .subscribe(() => {

    console.log("Stock repuesto");

    this.cargarCatalogo();

  });

}
}
