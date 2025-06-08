import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Nécessaire pour [(ngModel)]
import { IonicModule } from '@ionic/angular'; // Tous les composants Ionic

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  standalone: true, // Indique que c'est un composant standalone
  imports: [IonicModule, CommonModule, FormsModule] // Importe les modules nécessaires
})
export class FeedbackPage implements OnInit {
  rating: number = 0; // Note sélectionnée par l'utilisateur (0 à 5)
  comment: string = ''; // Commentaire de l'utilisateur
  oldFeedbacks: any[] = []; // Tableau pour stocker les anciens feedbacks

  constructor() { }

  ngOnInit() {
    // Dans un cas réel, vous feriez un appel API ici pour récupérer les anciens feedbacks
    // Pour le moment, nous utilisons des données fictives.
    this.loadOldFeedbacks();
  }

  setRating(star: number) {
    this.rating = star;
  }

  async submitFeedback() {
    if (this.rating === 0) {
      // Afficher une alerte ou un message à l'utilisateur
      alert("Veuillez donner une note (nombre d'étoiles) avant de soumettre.");
      return;
    }

    // Ici, nous simulerions l'envoi du feedback à l'API.
    // Plus tard, cette partie sera remplacée par un appel à un service API.
    const newFeedback = {
      rating: this.rating,
      comment: this.comment || 'Aucun commentaire fourni.', // Si le commentaire est vide
      userName: 'Utilisateur Actuel', // Remplacer par le nom de l'utilisateur connecté
      date: new Date()
    };

    console.log('Feedback à soumettre:', newFeedback);

    // Ajouter le nouveau feedback aux anciens feedbacks pour l'affichage immédiat (simulé)
    this.oldFeedbacks.unshift(newFeedback); // Ajoute au début du tableau

    // Réinitialiser le formulaire après soumission
    this.rating = 0;
    this.comment = '';

    // Afficher une confirmation
    alert("Votre feedback a été soumis avec succès !");
  }

  // Simule le chargement des anciens feedbacks depuis une API
  loadOldFeedbacks() {
    // Ceci serait un appel API réel dans l'étape suivante
    this.oldFeedbacks = [
      { rating: 4, comment: "Très bonne séance, j'ai beaucoup appris.", userName: "John Doe", date: new Date('2025-05-20T10:00:00') },
      { rating: 5, comment: "Excellent tuteur, très clair et patient !", userName: "Jane Smith", date: new Date('2025-05-18T14:30:00') },
      { rating: 3, comment: "Séance correcte, quelques points à améliorer.", userName: "Peter Jones", date: new Date('2025-05-15T09:00:00') }
    ];
  }
}