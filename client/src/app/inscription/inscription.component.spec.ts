// src/app/inscription/inscription.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // RouterLink est utilisé directement dans le template pour les liens
import { AuthService } from '../services/auth.service'; // Votre service d'authentification

// IMPORTEZ LE MODULE IONIC ENTIER ICI POUR LES COMPOSANTS STANDALONE
import { IonicModule } from '@ionic/angular'; // C'est la ligne clé pour résoudre les erreurs TS-992011

// Importez firstValueFrom pour la conversion des Observables en Promises
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink, // Nécessaire pour [routerLink] dans le HTML
    IonicModule // Inclut tous les composants Ionic utilisés
    // Tous les imports individuels de composants Ionic sont supprimés d'ici
    // ex: IonHeader, IonToolbar, IonTitle, IonContent, etc.
  ]
})
export class InscriptionComponent implements OnInit {
  // Modèle de données pour le formulaire
  formData = {
    username: '', // Champ pour le nom d'utilisateur unique
    // nom: '', // <-- SUPPRIMÉ POUR ÉVITER LA REDONDANCE
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // 'Etudiant' ou 'Enseignant'
    niveauEtudes: [] as string[], // Pour les étudiants
    sujetsEnseignes: [] as string[], // Pour les enseignants (contiendra les IDs MongoDB)
    bio: '' // Pour les enseignants
  };
  isLoading = false; // Pour le spinner sur le bouton de soumission
  isDataLoading = false; // Pour les spinners pendant le chargement des listes
  showPassword = false;
  showConfirmPassword = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'danger';

  // Listes des options, pour l'instant les niveaux sont en dur, les sujets viendront de l'API
  niveauxEtudesList: string[] = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat'];
  // Typage strict pour sujetsList, correspondant au modèle Mongoose {_id, name}
  sujetsList: { _id: string, name: string }[] = [];

  constructor(
    private authService: AuthService, // Votre service d'authentification qui contient getSubjects()
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSujetsEnseignes(); // Charge les sujets au démarrage du composant
  }

  // Méthode pour charger les sujets enseignés depuis l'API via AuthService
  async loadSujetsEnseignes() {
    this.isDataLoading = true; // Active le spinner
    try {
      // Utilisation de firstValueFrom pour convertir l'Observable en Promise
      const sujets = await firstValueFrom(this.authService.getSubjects());
      
      // Assurez-vous que 'sujets' est bien un tableau du format attendu
      if (Array.isArray(sujets) && sujets.every(s => s._id && s.name)) {
        this.sujetsList = sujets;
      } else {
        console.warn('Le backend a retourné un format inattendu pour les sujets:', sujets);
        this.sujetsList = []; // Assurez-vous que c'est un tableau vide si le format est incorrect
      }
      console.log('Sujets enseignés chargés depuis l\'API via AuthService:', this.sujetsList);
    } catch (error) {
      console.error('Erreur lors du chargement des sujets enseignés:', error);
      this.presentToast('Impossible de charger les matières enseignées. Veuillez réessayer.', 'danger');
      this.sujetsList = []; // En cas d'erreur, assurez-vous que la liste est vide
    } finally {
      this.isDataLoading = false; // Désactive le spinner
    }
  }

  // Fonction de validation côté client pour les formulaires pilotés par le template
  isValidForm(): boolean {
    // Destructuring du formData pour ne pas inclure 'nom'
    const { username, prenom, email, password, confirmPassword, role, niveauEtudes, sujetsEnseignes, bio } = this.formData;

    if (!username) { this.presentToast('Le nom d\'utilisateur est requis.', 'danger'); return false; }
    if (!prenom) { this.presentToast('Le prénom est requis.', 'danger'); return false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.presentToast('Veuillez entrer une adresse email valide.', 'danger');
      return false;
    }

    if (!password) { this.presentToast('Le mot de passe est requis.', 'danger'); return false; }
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordStrengthRegex.test(password)) {
      this.presentToast('Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.', 'danger');
      return false;
    }

    if (!confirmPassword) { this.presentToast('La confirmation du mot de passe est requise.', 'danger'); return false; }
    if (password !== confirmPassword) { this.presentToast('Les mots de passe ne correspondent pas.', 'danger'); return false; }

    if (!role) { this.presentToast('Veuillez sélectionner votre rôle.', 'danger'); return false; }

    if (role === 'Etudiant' && (!niveauEtudes || niveauEtudes.length === 0)) {
      this.presentToast('Veuillez sélectionner au moins un niveau d\'études.', 'danger');
      return false;
    }
    // Pour les enseignants, assurez-vous que sujetsEnseignes est un tableau non vide
    if (role === 'Enseignant' && (!sujetsEnseignes || sujetsEnseignes.length === 0)) {
      this.presentToast('Veuillez sélectionner au moins une matière enseignée.', 'danger');
      return false;
    }

    return true; // Tous les champs sont valides
  }

  async onSubmit(form: NgForm) {
    this.isLoading = true; // Active le spinner du bouton
    this.isToastOpen = false; // Ferme tout toast précédent

    // Utilise la validité du formulaire Angular piloté par le template
    if (form && form.invalid) {
        this.presentToast('Veuillez remplir tous les champs requis correctement.', 'danger');
        this.isLoading = false;
        return;
    }

    // Valide avec notre fonction manuelle isValidForm
    if (!this.isValidForm()) {
        this.isLoading = false;
        return;
    }

    try {
      let dataToSend: any = {
        username: this.formData.username,
        prenom: this.formData.prenom,
        email: this.formData.email,
        password: this.formData.password,
        role: this.formData.role
      };

      if (this.formData.role === 'Etudiant') {
        dataToSend.niveauEtudes = this.formData.niveauEtudes;
      } else if (this.formData.role === 'Enseignant') {
        dataToSend.sujetsEnseignes = this.formData.sujetsEnseignes; // Ces IDs seront envoyés au backend
        dataToSend.bio = this.formData.bio;
      }

      // Appel au service d'authentification pour l'inscription
      const response = await firstValueFrom(this.authService.register(dataToSend));
      console.log('Inscription réussie :', response);
      this.presentToast('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');

      // Redirection après un court délai pour que l'utilisateur lise le message
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
      this.presentToast(errorMessage, 'danger');
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

  // Méthode pour afficher le toast (renommée pour plus de clarté)
  presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.isToastOpen = true;
  }

  // Méthode pour fermer le toast (utilisée par (didDismiss) de ion-toast)
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}