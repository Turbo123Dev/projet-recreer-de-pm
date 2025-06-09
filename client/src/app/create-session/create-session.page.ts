// src/app/create-session/create-session.page.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // <-- Gardez RouterModule si vous utilisez routerLink dans le template
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  LoadingController,
  ToastController,
  IonicModule
} from '@ionic/angular';

import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';

import { addIcons } from 'ionicons';
import {
  calendarOutline,
  personOutline,
  bookOutline,
  timeOutline,
  cashOutline,
  locateOutline,
  globeOutline
} from 'ionicons/icons';

addIcons({
  calendarOutline,
  personOutline,
  bookOutline,
  timeOutline,
  cashOutline,
  locateOutline,
  globeOutline
});


@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.page.html',
  styleUrls: ['./create-session.page.scss'],
  standalone: true,
  imports: [ // <-- CORRECTION ICI : RETIRE Router de cette liste. Garde RouterModule si besoin de routerLink.
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule // Gardez RouterModule pour le <ion-back-button defaultHref="/dashboard"> et les futurs routerLink si vous en ajoutez.
  ]
})
export class CreateSessionPage implements OnInit {
  session: any = {
    subject: '',
    tutor: '',
    date: '',
    startTime: '',
    endTime: '',
    mode: '',
    level: ''
  };

  subjects: any[] = [];
  allTutors: any[] = [];
  filteredTutors: any[] = [];
  minDate: string;
  isStudent: boolean = false;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router, // <-- L'injection dans le constructeur est correcte
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.minDate = new Date().toISOString();
  }

  async ngOnInit() {
    await this.loadUserProfile();
    await this.loadSubjects();
    await this.loadTutors();
  }

  async loadUserProfile() {
    const loading = await this.loadingController.create({
      message: 'Chargement du profil...',
      duration: 0,
    });
    await loading.present();

    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.isStudent = user.role === 'student';
        loading.dismiss();
      },
      error: (err) => {
        loading.dismiss();
        this.presentAlert('Erreur', 'Impossible de charger le profil de l\'utilisateur.');
        console.error('Erreur chargement profil:', err);
      }
    });
  }

  async loadSubjects() {
    const loading = await this.loadingController.create({
      message: 'Chargement des sujets...',
      duration: 0,
    });
    await loading.present();

    this.sessionService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        loading.dismiss();
      },
      error: (err) => {
        loading.dismiss();
        this.presentAlert('Erreur', 'Impossible de charger les sujets. Veuillez réessayer.');
        console.error('Erreur de chargement des sujets:', err);
      }
    });
  }

  async loadTutors() {
    const loading = await this.loadingController.create({
      message: 'Chargement des tuteurs...',
      duration: 0,
    });
    await loading.present();

    this.sessionService.getTutors().subscribe({
      next: (data) => {
        this.allTutors = data;
        this.filterTutors();
        loading.dismiss();
      },
      error: (err) => {
        loading.dismiss();
        this.presentAlert('Erreur', 'Impossible de charger les tuteurs. Veuillez réessayer.');
        console.error('Erreur de chargement des tuteurs:', err);
      }
    });
  }

  onSubjectChange() {
    this.filterTutors();
  }

  onLevelChange() {
    this.filterTutors();
  }

  filterTutors() {
    let tempTutors = [...this.allTutors];

    if (this.session.subject) {
      tempTutors = tempTutors.filter(tutor =>
        tutor.subjects && tutor.subjects.some((s: any) => s._id === this.session.subject)
      );
    }

    if (this.isStudent && this.session.level) {
      tempTutors = tempTutors.filter(tutor =>
        tutor.level === this.session.level
      );
    }
    this.filteredTutors = tempTutors;

    if (this.session.tutor && !this.filteredTutors.some(t => t._id === this.session.tutor)) {
      this.session.tutor = '';
    }
  }

  async createSession() {
    const loading = await this.loadingController.create({
      message: 'Création de la session...',
    });
    await loading.present();

    let formattedDate = '';
    if (this.session.date) {
      formattedDate = new Date(this.session.date).toISOString().split('T')[0];
    } else {
      loading.dismiss();
      this.presentAlert('Erreur', 'Veuillez sélectionner une date pour la session.');
      return;
    }

    const sessionDataToSend = {
      subject: this.session.subject,
      tutor: this.session.tutor,
      date: formattedDate,
      startTime: this.session.startTime,
      endTime: this.session.endTime,
      mode: this.session.mode,
    };

    this.sessionService.createSession(sessionDataToSend).subscribe({
      next: async (res) => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Session créée avec succès!',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: async (err) => {
        loading.dismiss();
        const errorMessage = err.message || 'Une erreur est survenue lors de la création de la session.';
        this.presentAlert('Erreur de création', errorMessage);
        console.error('Erreur de création de session:', err);
      }
    });
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
