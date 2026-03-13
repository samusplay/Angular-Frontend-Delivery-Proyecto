import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { CatalogoService } from './services/catalogo.service';
import { CreateRequest } from './models/CreateRequest';
import { UpdateRequest } from './models/UpdateRequest';
import Swal from 'sweetalert2';
@Component({
  
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxSonnerToaster],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
  
})

export class Catalogo {
  
// Formulario
  productoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private catalogoService: CatalogoService,
    private router: Router
  ) {

    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, Validators.required],
      stock: [0, Validators.required]
    });

  }

//Método Crear
  CreateProduct() {

    const request: CreateRequest = this.productoForm.value;

    this.catalogoService.CreateProduct(request)
      .subscribe({
        next: (response) => {
          console.log("Producto creado", response);
          this.productoForm.reset();
        },
        error: (error) => {
          console.error("Error al crear producto", error);
        }
      });

  }
 // Esta variable va porque se espera el id por la url: `${this.endpoint}/${id}/update`
  productId: number | null = null;
  UpdateProduct(){

  if(!this.productId) return;

  const request: UpdateRequest = {
    id: this.productId,
    ...this.productoForm.value
  };

  this.catalogoService.UpdateProduct(this.productId, request)
  .subscribe({
    next: () => {
      console.log("Producto actualizado");
    }
  }); 
}
 //Nuevo metodo que necesito para guardar el producto una vez lo edite
 loadProduct(id:number){

  this.catalogoService.findById(id)
  .subscribe(product => {

    this.productId = id;

    this.productoForm.patchValue({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock
    });

  });

}

// Este lo que hace es decidir con el botón qué hacer, si actualizar o crear un producto, entonces si tiene Id actualiza si no crea
saveProduct(){

  if(this.productId){
    this.UpdateProduct();
  }else{
    this.CreateProduct();
  }

}

}
