// src/app/dashboard/dashboard.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Importez Router ici
import { AuthService } from '../services/auth.service'; // Importez le service d'authentification
import { firstValueFrom } from 'rxjs'; // Pour convertir Observable en Promise
import { HttpErrorResponse } from '@angular/common/http'; // Importation de HttpErrorResponse

// Importations Ionic et des icônes
import {
  IonicModule,
  IonIcon,
  IonButton,
  IonBadge,
  IonCard,
  IonLabel,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonContent,
  IonButtons
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
  statsChartOutline,
  logOutOutline
} from 'ionicons/icons';

// Ajoutez les icônes nécessaires. Gardez celles que vous utilisez réellement.
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
  statsChartOutline,
  logOutOutline
});

@Component({
  selector: 'app-home', // Ou 'app-dashboard' si c'est votre sélecteur
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule // Important pour routerLink
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
    private navCtrl: NavController, // Gardez NavController si vous l'utilisez pour d'autres navigations comme goToSearch
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router // Injectez Router pour la navigation Angular
  ) { }

  ngOnInit() {
    // Initialisation. Les données seront rechargées par ionViewWillEnter pour s'assurer qu'elles sont à jour.
  }

  // Cette méthode est appelée chaque fois que la vue est sur le point d'entrer en mode actif
  ionViewWillEnter() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoadingData = true;
    const loading = await this.loadingController.create({
      message: 'Chargement du tableau de bord...',
      duration: 0,
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Charger le profil de l'utilisateur
      const userProfile = await firstValueFrom(this.authService.getUserProfile());
      this.userName = userProfile.username;
      this.userRole = userProfile.role;

      // Charger les prochaines sessions
      const sessions = await firstValueFrom(this.authService.getUpcomingSessions());
      this.upcomingSessions = sessions;

      // Charger les statistiques de l'utilisateur
      const stats = await firstValueFrom(this.authService.getUserStats());
      this.userStats = stats;

      console.log('Données du tableau de bord chargées avec succès.');

    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) { // Non autorisé
          this.authService.logout();
          this.router.navigate(['/login'], { replaceUrl: true }); // <-- CORRECTION ICI
          this.presentAlert('Session Expirée', 'Votre session a expiré. Veuillez vous reconnecter.');
        } else {
          this.presentAlert('Erreur', 'Impossible de charger les données du tableau de bord. Veuillez réessayer.');
        }
      } else {
        this.presentAlert('Erreur Inconnue', 'Une erreur inattendue est survenue.');
      }
      // Réinitialiser les données en cas d'erreur
      this.userName = 'Erreur';
      this.upcomingSessions = [];
      this.userStats = { totalSessions: 0, hoursLearned: 0, averageRating: 0 };
    } finally {
      this.isLoadingData = false;
      loading.dismiss();
    }
  }

  goToSearch() {
    this.navCtrl.navigateForward('/search');
    console.log('Naviguer vers la recherche');
  }

  // goToPlanning() est supprimé car remplacé par routerLink dans le HTML

  goToChat() {
    this.navCtrl.navigateForward('/chat');
    console.log('Naviguer vers le chat');
  }

  goToFAQ() {
    this.navCtrl.navigateForward('/faq');
    console.log('Naviguer vers la FAQ');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Déconnexion',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true }); // <-- CORRECTION ICI
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
