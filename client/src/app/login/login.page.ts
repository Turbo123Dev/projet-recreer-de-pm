import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importations essentielles pour les formulaires réactifs
import { RouterModule } from '@angular/router'; // Pour la navigation avec routerLink

// Importez IonicModule pour rendre tous les composants Ionic disponibles.
// Vous pouvez importer les composants individuels utilisés (IonHeader, etc.) pour une meilleure clarté
// et pour que l'éditeur de code vous aide avec l'autocomplétion.
// Les composants qui ne sont pas utilisés dans le template HTML généreront un avertissement (WARNING),
// mais ne bloqueront pas la compilation. J'ai inclus ceux qui sont probablement utilisés dans votre HTML.
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
  IonNote // <-- Indispensable pour les messages d'erreur de validation
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // Ceci indique à Angular que ce composant est autonome
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- C'est LE MODULE qui active les formulaires réactifs (et donc [formGroup])
    RouterModule,        // <-- Nécessaire si vous utilisez routerLink dans votre HTML
    IonicModule          // <-- C'est LE MODULE qui rend tous les composants Ionic (ion-input, ion-button, ion-note, etc.) reconnus
  ],
})
export class LoginPage implements OnInit { // Le nom de la classe doit correspondre à 'LoginPage'
  loginForm!: FormGroup; // Déclaration du formulaire réactif. Le '!' indique qu'il sera initialisé plus tard.

  // Injection du service FormBuilder pour construire le formulaire
  constructor(private fb: FormBuilder) {}

  // ngOnInit est un hook de cycle de vie Angular où l'on initialise le formulaire
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Champ email avec validation requise et format email
      password: ['', Validators.required], // Champ mot de passe avec validation requise
    });
  }

  // Getter 'f' pour accéder facilement aux contrôles du formulaire dans le template HTML
  // Par exemple, f['email'] au lieu de loginForm.controls['email']
  get f() {
    return this.loginForm.controls;
  }

  // Méthode appelée lorsque le formulaire est soumis
  onSubmit() {
    if (this.loginForm.valid) {
      // Si le formulaire est valide, affiche ses valeurs dans la console
      console.log('Login Form Submitted:', this.loginForm.value);
      // Ici, vous ajouteriez la logique pour envoyer les données au serveur
      // et gérer l'authentification (par exemple, appeler un service d'authentification)
    } else {
      // Si le formulaire est invalide, affiche un message et marque tous les champs comme "touchés"
      // Cela force l'affichage des messages d'erreur si l'utilisateur a essayé de soumettre un formulaire incomplet.
      console.log('Login form is invalid. Please check fields.');
      this.loginForm.markAllAsTouched();
    }
  }
}