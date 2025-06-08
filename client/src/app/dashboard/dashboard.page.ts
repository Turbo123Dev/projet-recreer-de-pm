// src/app/dashboard/dashboard.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importez le service d'authentification
import { firstValueFrom } from 'rxjs'; // Pour convertir Observable en Promise
import { HttpErrorResponse } from '@angular/common/http'; // <-- AJOUTÉ : Importation de HttpErrorResponse

// Importations Ionic et des icônes
import {
  IonicModule,
  IonIcon,
  IonButton,
  IonBadge,
  IonCard,
  IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  schoolOutline,
  flashOutline,
  searchOutline,
  calendarOutline,
  chatbubblesOutline,
  helpCircleOutline,
  chevronForwardOutline,
  timeOutline,
  personOutline,
  addOutline,
  statsChartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class DashboardPage implements OnInit {

  userName: string = 'Invité'; // Valeur par défaut
  userRole: string = ''; // Pour potentiellement afficher différentes choses selon le rôle
  upcomingSessions: any[] = [];
  userStats: any = {
    totalSessions: 0,
    hoursLearned: 0,
    averageRating: 0
  };
  isLoadingData: boolean = true; // Pour afficher un spinner pendant le chargement

  constructor(
    private navCtrl: NavController,
    private authService: AuthService // Injectez AuthService
  ) {
    addIcons({
      schoolOutline,
      flashOutline,
      searchOutline,
      calendarOutline,
      chatbubblesOutline,
      helpCircleOutline,
      chevronForwardOutline,
      timeOutline,
      personOutline,
      addOutline,
      statsChartOutline
    });
  }

  ngOnInit() {
    this.loadDashboardData(); // Charge toutes les données du dashboard
  }

  async loadDashboardData() {
    this.isLoadingData = true;
    try {
      // Charger le profil de l'utilisateur
      const userProfile = await firstValueFrom(this.authService.getUserProfile());
      this.userName = userProfile.username;
      this.userRole = userProfile.role;
      // Vous pouvez stocker d'autres informations de l'utilisateur si nécessaire
      console.log('Profil utilisateur chargé:', userProfile);

      // Charger les sessions à venir
      this.upcomingSessions = await firstValueFrom(this.authService.getUpcomingSessions());
      console.log('Sessions à venir chargées:', this.upcomingSessions);

      // Charger les statistiques de l'utilisateur
      this.userStats = await firstValueFrom(this.authService.getUserStats());
      console.log('Statistiques utilisateur chargées:', this.userStats);

    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
      // Gérer l'erreur, par exemple rediriger vers la page de connexion si le token est invalide
      // DÉBUT DES MODIFICATIONS : Ajout de la vérification de type
      if (error instanceof HttpErrorResponse) { // <-- MODIFIÉ : Vérifie si c'est une HttpErrorResponse
        if (error.status === 401) { // Unauthorized
          this.authService.logout();
          this.navCtrl.navigateRoot('/login');
        }
      }
      // FIN DES MODIFICATIONS

      // Réinitialiser les données si une erreur survient, quel que soit le type d'erreur
      this.userName = 'Erreur';
      this.upcomingSessions = [];
      this.userStats = { totalSessions: 0, hoursLearned: 0, averageRating: 0 };
    } finally {
      this.isLoadingData = false;
    }
  }

  // Vos fonctions de navigation existantes
  goToSearch() {
    this.navCtrl.navigateForward('/search');
    console.log('Naviguer vers la recherche');
  }

  goToPlanning() {
    this.navCtrl.navigateForward('/planning');
    console.log('Naviguer vers la planification');
  }

  goToChat() {
    this.navCtrl.navigateForward('/chat');
    console.log('Naviguer vers le chat');
  }

  goToFAQ() {
    this.navCtrl.navigateForward('/faq');
    console.log('Naviguer vers la FAQ');
  }

  viewAllSessions() {
    this.navCtrl.navigateForward('/all-sessions');
    console.log('Voir toutes les sessions');
  }
}
