import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendService } from '../../../../../services/backend.service';
import { AuthRequest } from '../models/AuthRequest';
import { AuthResponse } from '../models/AuthResponse';
//import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  //la ruta general de Gateway
  private endpoint = 'api/auth';

  //Verificar si hay token primero
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  //Escuchar todos los componentes
  //public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  //constructor
  constructor(private readonly backend: BackendService) {}

  //metodos 
  login(request:AuthRequest):Observable<AuthResponse>{
    const path=`${this.endpoint}/login`;

    return this.backend.post<AuthResponse>(path,request).pipe(
      tap((response:AuthResponse)=>{
        this.saveToken(response.token)
        //emitimos true
        this.isLoggedInSubject.next(true)
      })
    )

  }
  //metodos privados
  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
  //comprobar si hay token
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  //metodo cerrar sesion
  logout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false);
  }

}
