// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


// Définissez l'interface pour un sujet pour un meilleur typage
export interface Subject {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/api/auth`;
  private subjectsApiUrl = `${environment.apiUrl}/api/subjects`;
  private dashboardUrl = `${environment.apiUrl}/api/dashboard`

  private token: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.token = token;
      this.isAuthenticatedSubject.next(true);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère la liste des sujets depuis le backend.
   * La méthode est maintenant typée pour retourner un tableau d'objets { _id: string, name: string }.
   */
  getSubjects(): Observable<Subject[]> { // <-- CHANGEMENT ICI : Typage plus précis
    return this.http.get<Subject[]>(this.subjectsApiUrl).pipe( // <-- CHANGEMENT ICI : Requête HTTP typée
      catchError(this.handleError)
    );
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client/réseau: ${error.error.message}`;
    } else {
      errorMessage = `Erreur du serveur: ${error.status} - ${error.error?.msg || error.statusText}`;
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(errorMessage));
  }


  //logique pour recuperer le token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token ? token : '' // Ajoute le token à l'en-tête
    });
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.dashboardUrl}/me`, { headers });
  }

  getUpcomingSessions(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.dashboardUrl}/upcoming-sessions`, { headers });
  }

  getUserStats(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.dashboardUrl}/stats`, { headers });
  }

}
