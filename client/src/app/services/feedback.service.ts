import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importez HttpClient
import { Observable } from 'rxjs'; // N'avons plus besoin de 'of' ici si on fait de vraies requêtes

// Assurez-vous que votre modèle correspond à la structure de vos données d'API
export interface Feedback {
  id?: number;
  rating: number;
  comment: string;
  date?: string; // Ajoutez cette propriété si elle est présente dans votre API
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:3000/feedbacks'; // L'URL de votre API backend

  constructor(private http: HttpClient) { } // Injectez HttpClient

  /**
   * Récupère tous les feedbacks depuis l'API.
   * @returns Un Observable de tableau de feedbacks.
   */
  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  /**
   * Ajoute un nouveau feedback à l'API.
   * @param feedback L'objet feedback à ajouter.
   * @returns Un Observable du feedback ajouté (souvent avec un ID généré par le backend).
   */
  addFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback);
  }

  // Si vous aviez des opérations de mise à jour ou suppression, elles iraient ici aussi
  // updateFeedback(id: number, feedback: Feedback): Observable<Feedback> {
  //   return this.http.put<Feedback>(`${this.apiUrl}/${id}`, feedback);
  // }
  // deleteFeedback(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}