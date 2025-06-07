import { enableProdMode } from '@angular/core'; // Garder cet import pour la production
import { bootstrapApplication } from '@angular/platform-browser';
// Fusionner les imports de @angular/router
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
// Ajouter les imports pour HttpClient
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    // Fusionner la configuration du routeur, en gardant withPreloading
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // Ajouter la configuration de HttpClient
    provideHttpClient(withInterceptorsFromDi())
  ],
});