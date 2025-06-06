import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; // Importation standard de NavController pour les projets Ionic
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngIf, *ngFor
import { FormsModule } from '@angular/forms';   // Utile si vous avez des formulaires ou ngModel

// Importation de IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBadge etc.
// Ces composants Ionic doivent être importés individuellement si le composant est standalone.
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonIcon, 
  IonButton, 
  IonBadge 
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

  // Configuration pour les composants standalone
   
  imports: [
    CommonModule,     // Pour *ngIf et *ngFor
    FormsModule,      // Pour ngModel et autres fonctionnalités de formulaire
    
    // Importez tous les composants Ionic que vous utilisez dans le template
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,          // C'est celui-ci qui manquait et causait l'erreur "element inconnu"
    IonButton,
    IonBadge
    // Ajoutez d'autres composants Ionic si vous les utilisez (ex: IonCard, IonList, etc.)
  ]
})
export class HomePage implements OnInit {

  // Propriétés pour l'affichage dans le HTML
  userName: string = 'Samy'; 
  
  upcomingSessions: any[] = []; // Tableau pour stocker les sessions à venir
  
  userStats: any = { // Objet pour stocker les statistiques de l'utilisateur
    totalSessions: 0,
    hoursLearned: 0,
    averageRating: 0
  };

  constructor(private navCtrl: NavController) {
    // Appelez addIcons dans le constructeur pour enregistrer les icônes
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
    // Initialisation des données lorsque le composant est chargé
    this.loadUserData();
    this.loadUpcomingSessions();
    this.loadUserStats();
  }

  // --- Fonctions de chargement des données (Exemples) ---
  // Ces données viendraient normalement d'un service qui les récupère d'une API ou d'un stockage local.

  loadUserData() {
    // Ici, vous feriez un appel à un service pour récupérer le nom de l'utilisateur connecté
    // Pour l'instant, on utilise une valeur fixe.
    // Exemple : this.userName = this.authService.getCurrentUserName(); 
  }

  loadUpcomingSessions() {
    // Simule le chargement de sessions à venir
    this.upcomingSessions = [
      { day: '15', month: 'Juin', subject: 'Mathématiques', tutor: 'M. Dupont', time: '14:00 - 15:30', mode: 'Présentiel' },
      { day: '17', month: 'Juin', subject: 'Physique', tutor: 'Mme. Dubois', time: '10:00 - 11:00', mode: 'En ligne' },
      { day: '20', month: 'Juin', subject: 'Informatique', tutor: 'M. Jean', time: '09:00 - 10:30', mode: 'Présentiel' },
    ];

    // Si vous voulez tester le cas sans sessions :
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
    this.navCtrl.navigateForward('/search'); // Remplacez '/search' par le chemin réel de votre page
    console.log('Naviguer vers la recherche');
  }

  goToPlanning() {
    this.navCtrl.navigateForward('/planning'); // Remplacez '/planning' par le chemin réel de votre page
    console.log('Naviguer vers la planification');
  }

  goToChat() {
    this.navCtrl.navigateForward('/chat'); // Remplacez '/chat' par le chemin réel de votre page
    console.log('Naviguer vers le chat');
  }

  goToFAQ() {
    this.navCtrl.navigateForward('/faq'); // Remplacez '/faq' par le chemin réel de votre page
    console.log('Naviguer vers la FAQ');
  }

  viewAllSessions() {
    this.navCtrl.navigateForward('/all-sessions'); // Remplacez '/all-sessions' par le chemin réel
    console.log('Voir toutes les sessions');
  }
}