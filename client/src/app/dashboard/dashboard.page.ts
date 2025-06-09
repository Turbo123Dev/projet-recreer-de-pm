// src/app/dashboard/dashboard.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import {
  IonicModule,
  IonIcon,
  IonButton,
  IonBadge,
  IonCard,
  IonLabel,
  IonSpinner,
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  schoolOutline,
  flashOutline,
  searchOutline,
  calendarOutline,
  chatbubblesOutline,
  // Ajout des icônes pour les étoiles du feedback si elles ne sont pas déjà ajoutées globalement
  star, starOutline,
  helpCircleOutline, // Garde cette icône pour la FAQ si tu ne la remplaces pas entièrement
  chevronForwardOutline,
  timeOutline,
  personOutline,
  addOutline,
  statsChartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
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

  userName: string = 'Invité';
  userRole: string = '';
  upcomingSessions: any[] = [];
  userStats: any = {
    totalSessions: 0,
    hoursLearned: 0,
    averageRating: 0
  };
  isLoadingData: boolean = true;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    addIcons({
      schoolOutline,
      flashOutline,
      searchOutline,
      calendarOutline,
      chatbubblesOutline,
      helpCircleOutline, // Icône pour FAQ
      chevronForwardOutline,
      timeOutline,
      personOutline,
      addOutline,
      statsChartOutline,
      star, // Ajout de l'icône étoile pleine
      starOutline // Ajout de l'icône étoile vide
    });
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoadingData = true;
    try {
      const userProfile = await firstValueFrom(this.authService.getUserProfile());
      this.userName = userProfile.username || userProfile.name || 'Utilisateur';
      this.userRole = userProfile.role || '';
      console.log('Profil utilisateur chargé:', userProfile);

      this.upcomingSessions = await firstValueFrom(this.authService.getUpcomingSessions());
      console.log('Sessions à venir chargées:', this.upcomingSessions);

      this.userStats = await firstValueFrom(this.authService.getUserStats());
      console.log('Statistiques utilisateur chargées:', this.userStats);

    } catch (error: any) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.authService.logout();
          this.navCtrl.navigateRoot('/login');
        }
      }
      this.userName = 'Erreur';
      this.upcomingSessions = [];
      this.userStats = { totalSessions: 0, hoursLearned: 0, averageRating: 0 };
    } finally {
      this.isLoadingData = false;
    }
  }

  goToSearch() {
    this.navCtrl.navigateForward('/search');
    console.log('Naviguer vers la recherche');
  }

  goToPlanning() {
    this.navCtrl.navigateForward('/request-session');
    console.log('Naviguer vers la planification');
  }

  goToChat() {
    this.navCtrl.navigateForward('/chat');
    console.log('Naviguer vers le chat');
  }

  // MODIFIÉ : goToFAQ mènera maintenant à la page de feedback
  goToFAQ() {
    this.navCtrl.navigateForward('/feedback'); // Navigue vers la page de feedback
    console.log('Naviguer vers le feedback (anciennement FAQ)');
  }

  viewAllSessions() {
    this.navCtrl.navigateForward('/all-sessions');
    console.log('Voir toutes les sessions');
  }
}