import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VerifyService } from './services/verify.service';
//enviar datos
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify',
  imports: [RouterModule],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class VerifyComponent {
  //tomamos el email
  email=signal<string>('');

  //arreglo de casillas
  codeDigits=signal<string[]>(['', '', '', '', '', ''])

  constructor(
    private route:ActivatedRoute,
    private verifyService:VerifyService,
    private router:Router
  ){
    //carga la pagina y atrapamos el email
    const emailParam=this.route.snapshot.queryParams['email']

    //si no tiene un email
    if(!emailParam){
      //redirige a register
      this.router.navigate(['/auth/register'])
    }else{
      this.email.set(emailParam)
    }
  }
  //mutacion para peticiones y su estado , va hablar con el backend 
  verifyMutation=injectMutation(()=>({
    mutationFn:(fullCode:string)=>{
      //retornamos el metodo del service con promise
      return lastValueFrom(
        this.verifyService.verify({
          //verifica los campos
        email:this.email(),
        code:fullCode
      }))
    },
    onSuccess:()=>{
      Swal.fire({
        icon: 'success',
        title: '¡Cuenta verificada!',
        text: 'Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.',
        confirmButtonColor: '#2563eb'
      }).then(() => this.router.navigate(['/auth/login']));
    },
    onError:(err:any)=>{
      const msg = err.error?.message || 'El código es incorrecto o ha expirado.';
      Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#d33' });
    }
  }));

  //envio
  onSubmit(){
    //jutamos en el arreglo un solo string
    const fullcode=this.codeDigits().join('')

    if(fullcode.length===6){
      this.verifyMutation.mutate(fullcode)
    }else{
      Swal.fire({ 
        icon: 'warning', 
        title: 'Código incompleto', 
        text: 'Ingresa los 6 dígitos.' });
    }
  }
  //metodo para escribir de corrido
  onInput(event:any,index:number){
    const input=event.target

    // Actualizamos el valor en nuestro arreglo de signals
    this.codeDigits.update(digits => {
      digits[index] = input.value;
      return [...digits];
    });

    // Movemos el foco a la siguiente casilla si escribió un número
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  }
  //borrar y regresar a la casilla anterior
  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.codeDigits()[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  }

}
