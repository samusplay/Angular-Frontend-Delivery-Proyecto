import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/query-core';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/aut.interceptor';

//instaciamos queryclient
const queryClient = new QueryClient();
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //para escuchar las peticiones al backend
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    //Provedor tanStack
   provideTanStackQuery(queryClient)
  ]
};
