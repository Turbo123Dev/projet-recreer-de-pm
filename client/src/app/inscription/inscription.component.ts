// src/app/inscription/inscription.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // IMPORTER CommonModule ici

// Imports des composants Ionic utilisés dans le template HTML
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonNote,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  standalone: true,
  imports: [ // Liste des modules et composants autonomes nécessaires
    ReactiveFormsModule, // Pour les formulaires réactifs
    RouterModule,        // Pour routerLink et la navigation
    CommonModule,         // Pour *ngIf, *ngFor, etc.
    IonHeader,           // Composants Ionic
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonSpinner,
    IonNote,
    IonSelect,
    IonSelectOption,
  ]
})
export class InscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup; // Déclaration du formulaire
  isLoading = false; // Pour gérer l'état de chargement du bouton

  // Liste des rôles possibles pour le champ "Rôle"
  roles: string[] = ['Étudiant', 'Enseignant', 'Administrateur'];

  // Liste des sujets avec IDs et noms
  subjects: { id: number; name: string }[] = [
    { id: 1, name: 'Analyse I' },
    { id: 2, name: 'Analyse II' },
    { id: 3, name: 'Programmation c' },
    { id: 4, name: 'Algebre I' },
    { id: 5, name: 'Algebre II' },
    { id: 6, name: 'Compilation' },
    { id: 7, name: 'Base de données' },
    { id: 8, name: 'Data Analysis' },
    { id: 9, name: 'Java 2EE' },
    { id: 10, name: 'Reseau/SE' },
    { id: 11, name: 'Programmation mobile' },
    { id: 12, name: 'Probabilités et statistiques' },
    { id: 13, name: 'Systemes Informatiques' },
    { id: 14, name: 'Genie logiciel' },
    { id: 15, name: 'Anglais' },
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    // Initialisation du formulaire avec les contrôles et leurs validateurs
    this.inscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        // Regex pour : au moins une majuscule, une minuscule, un chiffre et un caractère spécial
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      subjects: [[], Validators.required] // Tableau vide pour la sélection multiple
    }, {
      // Validateur personnalisé pour vérifier la correspondance des mots de passe
      validator: this.passwordMatchValidator
    });

    console.log('Liste des sujets chargée:', this.subjects);
  }

  // Getter pour accéder facilement aux contrôles du formulaire dans le template
  get f() {
    return this.inscriptionForm.controls;
  }

  // Fonction de validation personnalisée pour les mots de passe
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    this.isLoading = true; // Active l'état de chargement
    if (this.inscriptionForm.valid) {
      console.log('Formulaire valide, données:', this.inscriptionForm.value);
      // Simule un appel API ou une opération asynchrone
      setTimeout(() => {
        this.isLoading = false; // Désactive l'état de chargement
        console.log('Inscription réussie (simulation)');
        // La redirection vers '/connexion' nécessite que cette route soit définie dans app.routes.ts
        this.router.navigate(['/connexion']);
      }, 2000);
    } else {
      this.isLoading = false; // Désactive l'état de chargement
      console.log('Formulaire invalide');
      // Marque tous les contrôles comme "touchés" pour afficher les messages d'erreur
      this.inscriptionForm.markAllAsTouched();
    }
  }
}