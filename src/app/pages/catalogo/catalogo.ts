import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { CatalogService } from './services/catalog.service';

@Component({
  selector: 'app-catalogo',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class CatalogoComponent  {

  //dependencias
  private catalogoService=inject(CatalogService)
   private queryClient = inject(QueryClient)

   //Consulta remplaza cargarCatalogo ngOnInit
   catalogoQuery=injectQuery(()=>({
    queryKey:['catalogo'], //llave unica
    queryFn:()=>lastValueFrom(this.catalogoService.obtenerCatalogo())
   }));

   //mutacion para descontar
   descontarMutation=injectMutation(()=>({
    mutationFn:(id:number)=>lastValueFrom(this.catalogoService.descontarStock(id,1)),
    onSuccess:()=>{
      Swal.fire({
        icon: 'success',
        title: '¡Stock actualizado!',
        text: 'Se ha descontado 1 unidad del inventario.',
        timer: 1500, // Se cierra solo rápido para no interrumpir el flujo
        showConfirmButton: false
      });
      //invalidamos hasta que tengamos
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
    },
    onError:(err:any)=>{
      const errorMessage = err.error?.message || 'Ocurrió un error al intentar descontar el stock.';
      
      Swal.fire({
        icon: 'error',
        title: 'No se pudo descontar',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });
    }
   }));

   //reponer
   reponerMutation=injectMutation(()=>({
    mutationFn:(id:number)=>lastValueFrom(this.catalogoService.reponerStock(id,1)),
    onSuccess:()=>{
      Swal.fire({
        icon: 'success',
        title: '¡Stock repuesto!',
        text: 'Se ha sumado 1 unidad al inventario.',
        timer: 1500,
        showConfirmButton: false
      });
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
    },
    onError:(err:any)=>{
      const errorMessage = err.error?.message || 'Ocurrió un error al intentar reponer el stock.';
      
      Swal.fire({
        icon: 'error',
        title: 'No se pudo reponer',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });

    }
   }));

   descontar(id: number) {
    this.descontarMutation.mutate(id);
  }

  reponer(id: number) {
    this.reponerMutation.mutate(id);
  }


}
