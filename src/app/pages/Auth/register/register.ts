import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import Swal from 'sweetalert2';
import { RegisterService } from './services/register.service';

@Component({
  selector: 'app-register',
  standalone:true,
  //modulos necesarios
  imports: [CommonModule,ReactiveFormsModule,RouterModule,NgxSonnerToaster],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  //declaramos el formulario
  form:FormGroup
  isLoading=false

  //inyectamos constructor
  constructor(
    private readonly fb:FormBuilder,
    private readonly registerService:RegisterService,
    private readonly router:Router

  ){
    //inicializa el formulario
    this.form=this.fb.group({
      //campos del formulario
      username:['',[Validators.required,Validators.minLength(4)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
  }
  //envio de datos
  onSubmit():void{
    //validar si no hay campos vacios
    if(this.form.invalid){
      this.form.markAllAsTouched();
      //alertas
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, llena todos los campos correctamente.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }
    //carga de estado
    this.isLoading=true
    const toastId=toast.loading('Creando tu cuenta ...',{
      description:'Por favor espera un momento'
    });
    //llamada al backend osea el servicio
    this.registerService.register(this.form.value).subscribe({
      next:(response)=>{
        //quitamos estado de carga
        this.isLoading=false;
        toast.dismiss(toastId)
        //resetea el formulario
        this.form.reset()

        //mostrar mensaje
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: response.message, // Aquí saldrá: "Usuario registrado. Por favor verifica..."
          confirmButtonColor: '#2563eb'
        }).then(()=>{
          //redirigir
          this.router.navigate(['/auth/verify']),{
            queryParams:{username:response.username}
          }
        });
      },
      //manejo de errores
      error:(err)=>{
        this.isLoading=false
        toast.dismiss(toastId)
        //manejar excepciones
        let message='Error al registrar el usuario';
        if(err.error?.message){
          message=err.error.message;   
        }
        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear la cuenta',
          text: message,
          confirmButtonColor: '#d33'
        });
        //debugeo
        //console.error('Error en Register,err)
      }
    });
  }
  //accder a los controles de html
  get f(){
    return this.form.controls;
  }

}
