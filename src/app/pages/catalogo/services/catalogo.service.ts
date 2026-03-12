import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { CreateRequest } from '../Models/CreateRequest';
import { Observable } from 'rxjs';
import { CreateResponse } from '../Models/CreateResponse';
import { UpdateRequest } from '../Models/UpdateRequest';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private endpoint='api/catalog'

  //constructor
  constructor(private readonly backend:BackendService){}

  //crear metodo
  CreateProduct(request:CreateRequest):Observable<CreateResponse>{
    const path=`${this.endpoint}/create`
    return this.backend.post<CreateResponse>(path,request)

  }
  //actualizar
  UpdateProduct(id:number ,request:UpdateRequest):Observable<CreateResponse>{
    const path = `${this.endpoint}/${id}/update`
    return this.backend.put<CreateResponse>(path,request)
  }
// eliminar
DeleteProduct(id: number): Observable<void> {
   const path = `${this.endpoint}/${id}/delete`
  return this.backend.delete<void>(path)
}

  //ver por id
}
