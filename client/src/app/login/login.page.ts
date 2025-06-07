// src/app/login/login.page.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LoadingController,
  AlertController,
  ToastController,
  // Composants Ionic déjà présents :
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel,
  // *** NOUVEAUX IMPORTS À AJOUTER ICI ***
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonIcon // Ajout de IonIcon si tu l'utilises
} from '@ionic/angular/standalone'; // N'oublie pas le /standalone à la fin

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // Composants Ionic déjà présents dans le tableau imports :
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    // *** AJOUTE CES NOUVEAUX COMPOSANTS DANS LE TABLEAU imports ***
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonIcon // Ajoute IonIcon si tu l'utilises dans ton HTML
  ]
})
export class LoginPage implements OnInit {

  email!: string;
  password!: string;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // ...
  }

  async onLogin() {
    // ... (ton code onLogin() inchangé)
    if (!this.email || !this.password) {
      this.presentToast('Veuillez remplir tous les champs.', 'danger');
      return;
    }

    let loading: HTMLIonLoadingElement | null = null;

    try {
      loading = await this.loadingController.create({
        message: 'Connexion en cours...',
      });
      await loading.present();

      const loginData = {
        email: this.email,
        password: this.password
      };

      this.http.post('YOUR_BACKEND_API_URL/login', loginData).subscribe({
        next: async (response: any) => {
          if (loading) {
            await loading.dismiss();
          }
          if (response && response.success) {
            this.presentToast('Connexion réussie !', 'success');
            if (response.token) {
              localStorage.setItem('authToken', response.token);
            }
            this.router.navigateByUrl('/dashboard', { replaceUrl: true });
          } else {
            this.presentAlert('Erreur de connexion', response.message || 'Identifiants incorrects.');
          }
        },
        error: async (error) => {
          if (loading) {
            await loading.dismiss();
          }
          console.error('Erreur lors de la connexion :', error);
          if (error.status === 401) {
            this.presentAlert('Connexion échouée', 'Email ou mot de passe incorrect.');
          } else {
            this.presentAlert('Erreur réseau', 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
          }
        }
      });

    } catch (error) {
      if (loading) {
          await loading.dismiss();
      }
      console.error('Erreur inattendue :', error);
      this.presentAlert('Erreur', 'Une erreur inattendue est survenue.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}