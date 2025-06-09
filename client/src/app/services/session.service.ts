// src/app/services/session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Assurez-vous d'avoir ce fichier

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = environment.apiUrl; // L'URL de base de votre API backend

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Le token est stocké sous 'token' après la connexion
    return new HttpHeaders().set('x-auth-token', token || '');
  }

  // Méthode pour créer une nouvelle session
  createSession(sessionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/sessions`, sessionData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour récupérer tous les sujets disponibles
  getSubjects(): Observable<any[]> {
    // Les sujets sont généralement accessibles sans token si vous l'avez configuré ainsi dans le backend (subjects.js)
    return this.http.get<any[]>(`${this.apiUrl}/api/subjects`).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour récupérer les tuteurs avec des filtres optionnels
  getTutors(subjectId?: string, level?: string): Observable<any[]> {
    let params: any = {};
    if (subjectId) {
      params.subjectId = subjectId; // Nom du paramètre dans le backend (sessionController.js)
    }
    if (level) {
      params.level = level;
    }
    return this.http.get<any[]>(`${this.apiUrl}/api/users/tutors`, { params, headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour récupérer les sessions de l'utilisateur (utilisée par le dashboard)
  getUpcomingSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/dashboard/upcoming-sessions`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      errorMessage = `Erreur client/réseau: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur du serveur: ${error.status} - ${error.error?.msg || error.statusText}`;
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(errorMessage));
  }
}
