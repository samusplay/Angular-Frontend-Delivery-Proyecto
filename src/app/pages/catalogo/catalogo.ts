import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { CatalogService } from './services/catalog.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class CatalogoComponent {

  // 1. DEPENDENCIAS
  private catalogoService = inject(CatalogService);
  private queryClient = inject(QueryClient);
  private fb = inject(FormBuilder);

  // 2. ESTADOS DE LA UI (Signals)
  mostrarFormulario = signal<boolean>(false);
  productoEditandoId = signal<number | null>(null);

  // 3. FORMULARIO REACTIVO
  productoForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  // 4. CONSULTA AL BACKEND (Catálogo)
  catalogoQuery = injectQuery<any[]>(() => ({
    queryKey: ['catalogo'],
   queryFn: async () => {
  const data = await lastValueFrom(this.catalogoService.obtenerCatalogo());

  return data.sort((a, b) => a.id - b.id);
}
  }));

  // 5. MUTACIONES DE STOCK
  descontarMutation = injectMutation(() => ({
    mutationFn: (id: number) => lastValueFrom(this.catalogoService.descontarStock(id, 1)),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: '¡Stock actualizado!', text: 'Se ha descontado 1 unidad.', timer: 1500, showConfirmButton: false });
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
    },
    onError: (err: any) => {
      const msg = err.error?.message || 'Ocurrió un error al intentar descontar el stock.';
      Swal.fire({ icon: 'error', title: 'No se pudo descontar', text: msg, confirmButtonColor: '#d33' });
    }
  }));

  reponerMutation = injectMutation(() => ({
    mutationFn: (id: number) => lastValueFrom(this.catalogoService.reponerStock(id, 1)),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: '¡Stock repuesto!', text: 'Se ha sumado 1 unidad.', timer: 1500, showConfirmButton: false });
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
    },
    onError: (err: any) => {
      const msg = err.error?.message || 'Ocurrió un error al intentar reponer el stock.';
      Swal.fire({ icon: 'error', title: 'No se pudo reponer', text: msg, confirmButtonColor: '#d33' });
    }
  }));

  // 6. MUTACIONES CRUD (Crear, Actualizar, Eliminar)
  crearMutation = injectMutation(() => ({
    mutationFn: (nuevoProducto: any) => lastValueFrom(this.catalogoService.CreateProduct(nuevoProducto)),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Producto Creado', text: 'El producto se agregó al catálogo.', timer: 1500, showConfirmButton: false });
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
      this.cerrarFormulario();
    },
    onError: (err: any) => this.mostrarError('No se pudo crear el producto', err)
  }));

  actualizarMutation = injectMutation(() => ({
    mutationFn: (data: { id: number, request: any }) => lastValueFrom(this.catalogoService.UpdateProduct(data.id, data.request)),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Producto Actualizado', text: 'Los cambios se han guardado.', timer: 1500, showConfirmButton: false });
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
      this.cerrarFormulario();
    },
    onError: (err: any) => this.mostrarError('No se pudo actualizar', err)
  }));

  eliminarMutation = injectMutation(() => ({
    mutationFn: (id: number) => lastValueFrom(this.catalogoService.DeleteProduct(id)),
    onSuccess: () => {
      Swal.fire('¡Eliminado!', 'El producto ha sido borrado del catálogo.', 'success');
      this.queryClient.invalidateQueries({ queryKey: ['catalogo'] });
    },
    onError: (err: any) => this.mostrarError('No se pudo eliminar', err)
  }));

  // 7. MÉTODOS DE LA UI
  descontar(id: number) { this.descontarMutation.mutate(id); }
  
  reponer(id: number) { this.reponerMutation.mutate(id); }

  abrirFormularioCrear() {
    this.productoForm.reset({ precio: 0, stock: 0 });
    this.productoEditandoId.set(null);
    this.mostrarFormulario.set(true);
  }


  abrirFormularioEditar(producto: any) {
    this.productoForm.patchValue({
      name: producto.name,
      precio: producto.precio,
      stock: producto.stock // Asegúrate que el backend devuelva la propiedad 'stock'
    });
    this.productoEditandoId.set(producto.id);
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.productoForm.reset();
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formData = this.productoForm.value;
    const id = this.productoEditandoId();

    if (id) {
      this.actualizarMutation.mutate({ id, request: formData });
    } else {
      this.crearMutation.mutate(formData);
    }
  }

  confirmarEliminacion(id: number, nombre: string) {
    Swal.fire({
      title: `¿Eliminar ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarMutation.mutate(id);
      }
    });
  }

  // 8. HELPER PRIVADO DE ERRORES
  private mostrarError(titulo: string, err: any) {
    const msg = err.error?.message || 'Ocurrió un error en el servidor.';
    Swal.fire({ icon: 'error', title: titulo, text: msg, confirmButtonColor: '#d33' });
  }


}




