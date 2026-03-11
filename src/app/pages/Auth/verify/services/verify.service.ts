import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../../services/backend.service';
import { VerifyRequest } from '../models/VerifyRequest';

@Injectable({
  providedIn: 'root',
})
export class VerifyService {
  private endpoint='api/auth'

  constructor(private readonly backend:BackendService){}

  //funcionalidad
  verify(request:VerifyRequest):Observable<any>{
    const path = `${this.endpoint}/verify`;
    return this.backend.post<any>(path, request);
  }

  
}
