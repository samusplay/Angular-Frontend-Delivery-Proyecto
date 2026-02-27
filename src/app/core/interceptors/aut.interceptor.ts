import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Extraemos el token del localStorage
  const token = localStorage.getItem('token');

  // 2. Si el token existe, clonamos la petición y añadimos el Header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Enviamos la petición clonada con el token
    return next(cloned);
  }

  // 3. Si no hay token (ej: en el login), la petición sigue su curso normal
  return next(req);
};