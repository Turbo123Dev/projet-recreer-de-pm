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
  helpCircleOutline,
  chevronForwardOutline,
  timeOutline,
  personOutline,
  addOutline,
  statsChartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard', // Le sélecteur doit être app-dashboard si c'est ta route
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
      helpCircleOutline,
      chevronForwardOutline,
      timeOutline,
      personOutline,
      addOutline,
      statsChartOutline
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

    } catch (error: any) { // Typage de l'erreur pour éviter ts(7006)
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

  goToFAQ() {
    this.navCtrl.navigateForward('/faq');
    console.log('Naviguer vers la FAQ');
  }

  viewAllSessions() {
    this.navCtrl.navigateForward('/all-sessions');
    console.log('Voir toutes les sessions');
  }
}