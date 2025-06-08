// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Assurez-vous que le chemin vers votre AuthService est correct

@Injectable({
  providedIn: 'root' // Cela rend le service disponible dans toute l'application
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // La méthode canActivate est appelée par le routeur avant d'activer une route
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // 1. Vérifie si l'utilisateur est authentifié en utilisant la méthode de votre AuthService
    if (this.authService.isAuthenticated()) {
      return true; // L'utilisateur est authentifié, l'accès à la route est autorisé
    } else {
      // 2. Si l'utilisateur n'est PAS authentifié :
      //    a. Il est redirigé vers la page de connexion
      //    b. `router.parseUrl('/login')` crée une URLTree (une arborescence d'URL)
      //       qui indique au routeur où rediriger l'utilisateur.
      console.warn('Accès refusé : utilisateur non authentifié. Redirection vers la page de connexion.');
      return this.router.parseUrl('/login');
    }
  }
}