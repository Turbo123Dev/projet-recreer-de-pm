// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone'; // Notez '/standalone' ici.

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(), // <<< C'EST ICI QUE IONIC EST CONFIGURÉ GLOBALEMENT POUR LES COMPOSANTS STANDALONE.
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});