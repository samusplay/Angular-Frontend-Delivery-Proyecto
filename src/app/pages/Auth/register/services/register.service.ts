import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../../services/backend.service';
import { RegisterRequest } from '../models/RegisterRequest';
import { RegisterResponse } from '../models/RegisterResponse';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private endpoint='api/auth'

  constructor(private readonly backend:BackendService){}

  //metodo
  register(request:RegisterRequest):Observable<RegisterResponse>{
    const path=`${this.endpoint}/register`
    return this.backend.post<RegisterResponse>(path,request);
  }
  
}
