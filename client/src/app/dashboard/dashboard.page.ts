import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Si vous utilisez routerLink pour la navigation, ajoutez-le.

// Importations Ionic - Vous avez déjà IonicModule, qui contient tout.
// Il n'est pas nécessaire d'importer IonIcon, IonHeader, etc. individuellement ici si vous importez IonicModule.
// Mais pour une meilleure autocomplétion et clarté de ce qui est utilisé, vous pouvez les laisser.
import {
  IonicModule,
  // IonHeader, // Pas strictement nécessaire si IonicModule est importé
  // IonToolbar, // Pas strictement nécessaire si IonicModule est importé
  // IonTitle,   // Pas strictement nécessaire si IonicModule est importé
  // IonContent, // Pas strictement nécessaire si IonicModule est importé
  IonIcon,    // <--- C'est la clé, mais déjà couverte par IonicModule. Maintenez-le pour la clarté.
  IonButton,
  IonBadge,
  // Ajoutez IonCard, IonLabel, etc. si vous souhaitez que votre IDE les reconnaisse explicitement
  IonCard,
  IonLabel
} from '@ionic/angular';

// Importez la fonction addIcons
import { addIcons } from 'ionicons';

// Importez TOUTES les icônes que vous utilisez dans votre dashboard.page.html
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
  selector: 'app-home', // Le sélecteur de votre composant
  templateUrl: './dashboard.page.html', // Le chemin vers votre fichier HTML
  styleUrls: ['./dashboard.page.scss'], // Le chemin vers votre fichier SCSS
  standalone: true, // Configuration pour les composants standalone
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // <--- C'est ce module qui rend les <ion-icon> fonctionnels
    RouterModule // Ajoutez ceci si vous utilisez des routerLink dans votre HTML de dashboard
  ]
})
export class DashboardPage implements OnInit {

  userName: string = 'Samy';
  upcomingSessions: any[] = [];
  userStats: any = {
    totalSessions: 0,
    hoursLearned: 0,
    averageRating: 0
  };

  constructor(private navCtrl: NavController) {
    // Appelez addIcons dans le constructeur pour enregistrer les icônes
    // C'est la bonne pratique pour les composants standalone.
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
    // Logique pour charger le nom de l'utilisateur
  }

  loadUpcomingSessions() {
    this.upcomingSessions = [
      { day: '15', month: 'Juin', subject: 'Mathématiques', tutor: 'M. Dupont', time: '14:00 - 15:30', mode: 'Présentiel' },
      { day: '17', month: 'Juin', subject: 'Physique', tutor: 'Mme. Dubois', time: '10:00 - 11:00', mode: 'En ligne' },
      { day: '20', month: 'Juin', subject: 'Informatique', tutor: 'M. Jean', time: '09:00 - 10:30', mode: 'Présentiel' },
    ];
  }

  loadUserStats() {
    this.userStats = {
      totalSessions: 12,
      hoursLearned: 18,
      averageRating: 4.8
    };
  }

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