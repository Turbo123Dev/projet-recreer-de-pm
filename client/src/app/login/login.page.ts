import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

import {
  IonicModule,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonNote,
  IonSpinner,
  IonToast,
  IonIcon // <-- NOUVEAU : Importez IonIcon pour l'icône de l'œil
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'danger';
  showPassword = false; // <-- NOUVEAU : Propriété pour contrôler la visibilité du mot de passe

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  presentToast(message: string, color: string = 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.isToastOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  // <-- NOUVELLE MÉTHODE : Pour basculer la visibilité du mot de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    this.isLoading = true;
    this.isToastOpen = false;

    if (this.loginForm.invalid) {
      console.log('Login form is invalid. Please check fields.');
      this.loginForm.markAllAsTouched();
      this.presentToast('Veuillez remplir tous les champs correctement.', 'danger');
      this.isLoading = false;
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const response = await firstValueFrom(this.authService.login({ email, password }));
      console.log('Connexion réussie :', response);
      this.presentToast('Connexion réussie ! Redirection...', 'success');

      // IMPORTANT : Assurez-vous que '/dashboard' est la bonne route pour votre tableau de bord
      // ou remplacez-la par l'URL correcte (ex: '/home')
      setTimeout(() => {
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      }, 1500);

    } catch (error: any) {
      console.error('Erreur lors de la connexion :', error);
      let errorMessage = 'Une erreur est survenue lors de la connexion.';
      if (error.error && error.error.msg) {
        errorMessage = error.error.msg;
      } else if (error.status === 0) {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion ou l'état du backend.";
      }
      this.presentToast(errorMessage, 'danger');
    } finally {
      this.isLoading = false;
    }
  }
}