import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { CreateRquest } from '../models/CreateRequest';
import { Observable } from 'rxjs';
import { CreateResponse } from '../models/CreateResponse';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private endpoint='api/catalog'

  //constructor
  constructor(private readonly backend:BackendService){}

  //crear metodo
  CreateProduct(request:CreateRquest):Observable<CreateResponse>{
    const path=`${this.endpoint}/create`
    return this.backend.post<CreateRquest>(path,request)

  }
  //actualizar

  //eliminar

  //ver por id

  //demas metodos
  
}
