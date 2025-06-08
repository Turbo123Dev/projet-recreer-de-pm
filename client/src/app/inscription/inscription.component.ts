// src/app/inscription/inscription.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { IonicModule } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonicModule
  ]
})
export class InscriptionComponent implements OnInit {
  formData = {
    username: '', // Le 'username' du backend, qui est le "Nom" de l'utilisateur
    email: '',
    password: '',
    confirmPassword: '',
    role: '',     // 'Etudiant' ou 'Enseignant' pour l'UI
    niveauEtudes: '', // Reviens à une SEULE chaîne de caractères, comme attendu par le backend 'level'
    sujetsEnseignes: [] as string[],
    bio: ''
  };
  isLoading = false;
  isDataLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'danger';

  niveauxEtudesList: { display: string, value: string }[] = [
    { display: 'Licence 1', value: 'Licence1' },
    { display: 'Licence 2', value: 'Licence2' },
    { display: 'Licence 3', value: 'Licence3' },
    { display: 'Master 1', value: 'Master1' },
    { display: 'Master 2', value: 'Master2' }
  ];
  sujetsList: { _id: string, name: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSujetsEnseignes();
  }

  async loadSujetsEnseignes() {
    this.isDataLoading = true;
    try {
      const sujets = await firstValueFrom(this.authService.getSubjects());
      if (Array.isArray(sujets) && sujets.every(s => typeof s._id === 'string' && typeof s.name === 'string')) {
        this.sujetsList = sujets;
      } else {
        console.warn('Le backend a retourné un format inattendu pour les sujets:', sujets);
        this.sujetsList = [];
      }
      console.log('Sujets enseignés chargés depuis l\'API via AuthService:', this.sujetsList);
    } catch (error) {
      console.error('Erreur lors du chargement des sujets enseignés:', error);
      this.presentToast('Impossible de charger les matières enseignées. Veuillez réessayer.', 'danger');
      this.sujetsList = [];
    } finally {
      this.isDataLoading = false;
    }
  }

  isValidForm(): boolean {
    // Les champs attendus par le backend (après modification du contrôleur) sont : username, email, password, level, role
    const { username, email, password, confirmPassword, role, niveauEtudes, sujetsEnseignes, bio } = this.formData;

    if (!username) { this.presentToast('Le nom d\'utilisateur est requis.', 'danger'); return false; }
    // REMARQUE: Plus de validation 'nom' et 'prenom' ici

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

    if (!niveauEtudes) {
        this.presentToast('Veuillez sélectionner votre niveau d\'études.', 'danger');
        return false;
    }

    if (role === 'Enseignant') {
        if (!sujetsEnseignes || sujetsEnseignes.length === 0) {
            this.presentToast('Veuillez sélectionner au moins une matière enseignée.', 'danger');
            return false;
        }
    }
    return true;
  }

  async onSubmit(form: NgForm) {
    this.isLoading = true;
    this.isToastOpen = false;

    if (form && form.invalid) {
        this.presentToast('Veuillez remplir tous les champs requis correctement.', 'danger');
        this.isLoading = false;
        return;
    }

    if (!this.isValidForm()) {
        this.isLoading = false;
        return;
    }

    try {
      let dataToSend: any = {
        username: this.formData.username,
        email: this.formData.email,
        password: this.formData.password,
        level: this.formData.niveauEtudes,
        role: this.formData.role === 'Etudiant' ? 'student' : 'tutor'
      };

      if (this.formData.role === 'Enseignant') {
        dataToSend.subjects = this.formData.sujetsEnseignes;
        if (this.formData.bio) {
          dataToSend.bio = this.formData.bio;
        }
      }

      console.log('Données envoyées au backend:', dataToSend);

      const response = await firstValueFrom(this.authService.register(dataToSend));
      console.log('Inscription réussie :', response);
      this.presentToast('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');

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
      } else if (error.status === 0) {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion ou l'état du backend.";
      }
      this.presentToast(errorMessage, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() { this.showPassword = !this.showPassword; }
  toggleConfirmPasswordVisibility() { this.showConfirmPassword = !this.showConfirmPassword; }
  presentToast(message: string, color: string) { this.toastMessage = message; this.toastColor = color; this.isToastOpen = true; }
  setOpen(isOpen: boolean) { this.isToastOpen = isOpen; }
}