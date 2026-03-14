import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { CreateRequest } from '../models/CreateRequest';
import { CreateResponse } from '../models/CreateResponse';
import { UpdateRequest } from '../models/UpdateRequest';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {

  private endpoint = 'api/catalog'

  constructor(private readonly backend: BackendService) {}

  // crear
  CreateProduct(request: CreateRequest): Observable<CreateResponse> {
    const path = `${this.endpoint}/create`
    return this.backend.post<CreateResponse>(path, request)
  }

  // actualizar
  UpdateProduct(id: number, request: UpdateRequest): Observable<CreateResponse> {
    const path = `${this.endpoint}/${id}/update`
    return this.backend.put<CreateResponse>(path, request)
  }

  // eliminar
  DeleteProduct(id: number): Observable<void> {
    const path = `${this.endpoint}/${id}/delete`
    return this.backend.delete<void>(path)
  }

  // obtener catalogo
obtenerCatalogo() {
  const path = `${this.endpoint}/all`
  return this.backend.get<any[]>(path)
}

  // DESCONTAR STOCK
  descontarStock(id: number, cantidad: number) {

    const path = `${this.endpoint}/${id}/descontar`

    return this.backend.put(path, {
      cantidad: cantidad
    })
  }

  // REPONER STOCK
  reponerStock(id: number, cantidad: number) {

    const path = `${this.endpoint}/${id}/reponer`

    return this.backend.put(path, {
      cantidad: cantidad
    })
  }

}