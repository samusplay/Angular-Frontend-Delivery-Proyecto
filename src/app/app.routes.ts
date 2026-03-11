import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

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
    },
    {
        //layout dashboard donde va ordenes y pedidos
        path:'dashboard',
        component:DashboardLayout,
        canActivate:[authGuard],
        children:[
            {path:'pedidos',loadComponent:()=>import('./pages/pedidos/pedidos').then(m=>m.PedidosComponent)},
            {path:'catalogo',loadComponent:()=>import('./pages/catalogo/catalogo').then(m=>m.CatalogoComponent)}
        ]
    }
];
