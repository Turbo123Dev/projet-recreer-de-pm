import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Changé de NavController à Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonicModule
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
    IonicModule
  ]
})
export class DashboardPage implements OnInit { // Renommé de DashboardPage à HomePage si ton fichier est home.page.ts

  userName: string = 'Samy';

  upcomingSessions: any[] = [];

  userStats: any = {
    totalSessions: 0,
    hoursLearned: 0,
    averageRating: 0
  };

  constructor(private router: Router) { // Injecter le Router
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
    this.loadUserData();
    this.loadUpcomingSessions();
    this.loadUserStats();
  }

  loadUserData() {
    // Simule le chargement du nom d'utilisateur
  }

  loadUpcomingSessions() {
    // Simule le chargement de sessions à venir
    this.upcomingSessions = [
      { day: '15', month: 'Juin', subject: 'Mathématiques', tutor: 'M. Dupont', time: '14:00 - 15:30', mode: 'Présentiel' },
      { day: '17', month: 'Juin', subject: 'Physique', tutor: 'Mme. Dubois', time: '10:00 - 11:00', mode: 'En ligne' },
      { day: '20', month: 'Juin', subject: 'Informatique', tutor: 'M. Jean', time: '09:00 - 10:30', mode: 'Présentiel' },
    ];

    // Pour tester le cas sans sessions, décommentez la ligne ci-dessous:
    // this.upcomingSessions = [];
  }

  loadUserStats() {
    // Simule le chargement des statistiques de l'utilisateur
    this.userStats = {
      totalSessions: 12,
      hoursLearned: 18,
      averageRating: 4.8
    };
  }

  // --- Fonctions de navigation (appelées par les clics dans le HTML) ---

  goToSearch() {
    this.router.navigate(['/search']); // Utilisation du Router
    console.log('Naviguer vers la recherche');
  }

  goToPlanning() {
    this.router.navigate(['/request-session']); // Assurez-vous que cette route existe dans app.routes.ts
    console.log('Naviguer vers la planification');
  }

  goToChat() {
    this.router.navigate(['/chat']);
    console.log('Naviguer vers le chat');
  }

  goToFAQ() {
    this.router.navigate(['/faq']);
    console.log('Naviguer vers la FAQ');
  }

  viewAllSessions() {
    this.router.navigate(['/all-sessions']);
    console.log('Voir toutes les sessions');
  }

}