import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
        //layout de autenticacionn con rutas
        path:'auth',
        component: AuthLayout,
        children:[
            {path:'login',loadComponent:()=>import('./pages/Auth/login/login').then(m=>m.LoginComponent)},
            {path:'register',loadComponent:()=>import('./pages/Auth/register/register').then(m=>m.RegisterComponent)},
            {path:'verify',loadComponent:()=>import('./pages/Auth/verify/verify').then(m=>m.VerifyComponent)},
            //redirige por default a login
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    }
];
