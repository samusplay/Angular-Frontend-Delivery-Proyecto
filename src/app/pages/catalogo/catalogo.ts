import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { CatalogoService } from './services/catalogo.service';

@Component({
  selector: 'app-catalogo',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule, RouterModule, NgxSonnerToaster],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class CatalogoComponent {
  //definir formulario
  //form:FormGroup

  constructor(
    private readonly fb: FormBuilder,
    private readonly catalogoService: CatalogoService,
    private readonly router: Router
  ){
    //definir formulario esqueleto 

  }
  //tan stack}
  



}
