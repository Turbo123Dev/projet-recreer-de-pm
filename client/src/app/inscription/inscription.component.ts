// src/app/inscription/inscription.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Assurez-vous d'importer NgForm si vous voulez utiliser la référence de template pour la validité du formulaire
import { FormsModule, NgForm } from '@angular/forms'; // <-- Ajout de NgForm si besoin pour la validité du formulaire
import { Router, RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

// IMPORTS DES COMPOSANTS IONIC UTILISÉS
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList, // Vérifié si utilisé dans le template, sinon c'est un avertissement
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonCheckbox, // Vérifié si utilisé dans le template, sinon c'est un avertissement
  IonSpinner,
  IonToast,
  IonFab, // Vérifié si utilisé dans le template, sinon c'est un avertissement
  IonFabButton, // Vérifié si utilisé dans le template, sinon c'est un avertissement
  IonIcon,
  IonNote,
  IonButtons,
  IonBackButton,
  IonTextarea,
  IonCardContent, // <-- AJOUTÉ pour résoudre 'ion-card-content' unknown element
  IonText // <-- AJOUTÉ pour résoudre 'ion-text' unknown element
} from '@ionic/angular/standalone';

// Importez firstValueFrom
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonSpinner,
    IonToast,
    IonFab,
    IonFabButton,
    IonIcon,
    IonNote,
    IonButtons,
    IonBackButton,
    IonTextarea,
    IonCardContent, // <-- AJOUTÉ
    IonText // <-- AJOUTÉ
  ]
})
export class InscriptionComponent implements OnInit {
  // Votre modèle de données pour le formulaire
  formData = {
    username: '',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // 'Etudiant' ou 'Enseignant'
    niveauEtudes: [] as string[], // Pour les étudiants
    sujetsEnseignes: [] as string[], // Pour les enseignants
    bio: '' // Pour les enseignants
  };
  isLoading = false;
  isDataLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'danger';

  niveauxEtudesList: string[] = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat'];

  // Typage strict pour sujetsList
  sujetsList: { _id: string, name: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSujetsEnseignes();
  }

  // Méthode pour charger les sujets enseignés depuis l'API via AuthService
  async loadSujetsEnseignes() {
    this.isDataLoading = true;
    try {
      const sujets = await firstValueFrom(this.authService.getSubjects());
      // Assurez-vous que 'sujets' est bien un tableau (même vide si le backend ne retourne rien)
      if (Array.isArray(sujets)) {
        this.sujetsList = sujets;
      } else {
        console.warn('Le backend a retourné un format inattendu pour les sujets:', sujets);
        this.sujetsList = []; // Assurez-vous que c'est un tableau vide
      }
      console.log('Sujets enseignés chargés depuis l\'API via AuthService:', this.sujetsList);
    } catch (error) {
      console.error('Erreur lors du chargement des sujets enseignés:', error);
      this.setToast('Impossible de charger les sujets.', 'danger');
      this.sujetsList = []; // En cas d'erreur, assurez-vous que la liste est vide
    } finally {
      this.isDataLoading = false;
    }
  }

  // Fonction de validation côté client
  isValidForm(): boolean {
    const { username, nom, prenom, email, password, confirmPassword, role, niveauEtudes, sujetsEnseignes } = this.formData;

    if (!username) { this.setToast('Le nom d\'utilisateur est requis.', 'danger'); return false; }
    if (!nom) { this.setToast('Le nom est requis.', 'danger'); return false; }
    if (!prenom) { this.setToast('Le prénom est requis.', 'danger'); return false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // CORRECTION ICI : RETRAIT DES CARACTÈRES ÉCHAPPÉS BIZARRES
    if (!email || !emailRegex.test(email)) {
      this.setToast('Veuillez entrer une adresse email valide.', 'danger');
      return false;
    }

    if (!password) { this.setToast('Le mot de passe est requis.', 'danger'); return false; }
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    // CORRECTION ICI : RETRAIT DES CARACTÈRES ÉCHAPPÉS BIZARRES
    if (!passwordStrengthRegex.test(password)) {
      this.setToast('Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.', 'danger');
      return false;
    }

    if (!confirmPassword) { this.setToast('La confirmation du mot de passe est requise.', 'danger'); return false; }
    if (password !== confirmPassword) { this.setToast('Les mots de passe ne correspondent pas.', 'danger'); return false; }

    if (!role) { this.setToast('Veuillez sélectionner votre rôle.', 'danger'); return false; }

    if (role === 'Etudiant' && (!niveauEtudes || niveauEtudes.length === 0)) {
      this.setToast('Veuillez sélectionner au moins un niveau d\'études.', 'danger');
      return false;
    }
    if (role === 'Enseignant' && (!sujetsEnseignes || sujetsEnseignes.length === 0)) {
      this.setToast('Veuillez sélectionner au moins une matière enseignée.', 'danger');
      return false;
    }

    return true;
  }

  async onSubmit(form: NgForm) { // Ajoutez 'form: NgForm' pour accéder à la validité du formulaire
    this.isLoading = true;
    this.isToastOpen = false;

    // Utilisez la validité du formulaire Angular template-driven si disponible
    if (form && form.invalid) { // Vérifiez si le formulaire est invalide via NgForm
        this.setToast('Veuillez remplir tous les champs requis correctement.', 'danger');
        this.isLoading = false;
        return;
    }

    // Si vous préférez votre validation manuelle isValidForm()
    if (!this.isValidForm()) {
        this.isLoading = false;
        return;
    }

    try {
      let dataToSend: any = {
        username: this.formData.username,
        nom: this.formData.nom,
        prenom: this.formData.prenom,
        email: this.formData.email,
        password: this.formData.password,
        role: this.formData.role
      };

      if (this.formData.role === 'Etudiant') {
        dataToSend.niveauEtudes = this.formData.niveauEtudes;
      } else if (this.formData.role === 'Enseignant') {
        dataToSend.sujetsEnseignes = this.formData.sujetsEnseignes;
        dataToSend.bio = this.formData.bio;
      }

      const response = await firstValueFrom(this.authService.register(dataToSend));
      console.log('Inscription réussie :', response);
      this.setToast('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');

      setTimeout(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }, 2000);

    } catch (error: any) {
      console.error('Erreur lors de l\'inscription :', error);
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      this.setToast(errorMessage, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // Méthodes de visibilité des mots de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Méthode pour afficher le toast
  setToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.isToastOpen = true;
  }

  // Méthode pour fermer le toast (utilisée par (didDismiss) )
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}