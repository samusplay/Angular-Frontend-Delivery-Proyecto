import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  //inyectamos router para redirecionar
  const router=inject(Router)

  const token=localStorage.getItem('token')

  //redirigir
  if(token){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
};
