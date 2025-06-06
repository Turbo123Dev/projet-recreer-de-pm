import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

// Imports des icônes Ionic utilisées dans le template
import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  closeCircle,
  informationCircle,
  arrowForwardOutline,
  calendarOutline,
  personOutline,
  timeOutline,
  addOutline,
  arrowBack
} from 'ionicons/icons';


@Component({
  selector: 'app-request-session',
  templateUrl: './request-session.page.html',
  styleUrls: ['./request-session.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Contient déjà IonIcon et autres composants Ionic
    CommonModule, // Contient déjà DatePipe et autres pipes/directives standards
    ReactiveFormsModule, // Pour FormGroup, FormControl, etc.
  ]
})
export class RequestSessionPage implements OnInit {
  sessionForm: FormGroup; // Déclaration du FormGroup pour ton formulaire

  isDatePickerOpen = false; // Pour contrôler l'ouverture/fermeture du popover de date
  isTimePickerOpen = false; // Pour contrôler l'ouverture/fermeture du popover d'heure

  // Variables pour les messages de feedback de l'application (succès/erreur de soumission)
  appFeedbackMessage: string = '';
  appFeedbackMessageType: 'success' | 'error' | 'info' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    // Si tu avais un FormBuilder, tu le décommenterais ici : private formBuilder: FormBuilder,
    // ... tes autres services (AuthService, SessionService)
  ) {
    // Initialisation du FormGroup dans le constructeur avec les FormControl et Validators
    this.sessionForm = new FormGroup({
      date: new FormControl<string | null>(null, Validators.required), // Champ date, requis
      time: new FormControl<string | null>(null, Validators.required), // Champ heure, requis
      tutorId: new FormControl<string | null>(null, Validators.required), // Champ tuteur, requis
      mode: new FormControl<'presentiel' | 'visio'>('presentiel', Validators.required), // Champ mode, par défaut 'presentiel', requis
      videoLink: new FormControl<string>(''), // Champ lien vidéo, facultatif
      userFeedback: new FormControl<string>('') // NOUVEAU : Champ pour le feedback de l'utilisateur
      // Si le feedback utilisateur est obligatoire, utilise : userFeedback: new FormControl<string>('', Validators.required)
    });

    // Enregistrement des icônes utilisées dans le HTML
    addIcons({
      checkmarkCircle,
      closeCircle,
      informationCircle,
      arrowForwardOutline,
      calendarOutline,
      personOutline,
      timeOutline,
      addOutline,
      arrowBack
    });
  }

  ngOnInit() {
    // Définition des valeurs initiales pour les contrôles de date et d'heure
    const now = new Date();
    this.sessionForm.patchValue({
      date: now.toISOString(), // Définit la date actuelle
      time: now.toISOString()  // Définit l'heure actuelle
    });

    // Assure-toi que les popovers sont fermés au chargement de la page
    this.isDatePickerOpen = false;
    this.isTimePickerOpen = false;

    // Logique optionnelle: pré-sélectionner un tuteur si l'ID est passé dans l'URL (ex: depuis un profil de tuteur)
    const tutorIdFromUrl = this.route.snapshot.paramMap.get('id');
    if (tutorIdFromUrl) {
      this.sessionForm.patchValue({ tutorId: tutorIdFromUrl });
    }

    // S'abonner aux changements du mode de session pour réinitialiser le lien vidéo si le mode n'est plus "visio"
    this.sessionForm.get('mode')?.valueChanges.subscribe(mode => {
      if (mode !== 'visio') {
        this.sessionForm.get('videoLink')?.setValue(''); // Vide le champ lien vidéo
      }
    });
  }

  // Gère le changement de date depuis le sélecteur (ion-datetime)
  onDateChange(event: any) {
    // Le FormControl 'date' est automatiquement mis à jour par [formControlName]
    // Il suffit de fermer le popover après sélection
    this.isDatePickerOpen = false;
    console.log('Date sélectionnée :', this.sessionForm.get('date')?.value);
  }

  // Gère le changement d'heure depuis le sélecteur (ion-datetime)
  onTimeChange(event: any) {
    // Le FormControl 'time' est automatiquement mis à jour par [formControlName]
    // Il suffit de fermer le popover après sélection
    this.isTimePickerOpen = false;
    console.log('Heure sélectionnée :', this.sessionForm.get('time')?.value);
  }

  async submitRequest() {
    // Réinitialise les messages de feedback de l'application
    this.appFeedbackMessage = '';
    this.appFeedbackMessageType = '';

    if (this.sessionForm.invalid) {
      // Marque tous les contrôles comme "touchés" pour afficher les messages de validation dans le HTML
      this.sessionForm.markAllAsTouched();
      await this.presentToast('Veuillez remplir tous les champs obligatoires.', 'danger', 3000, 'top');
      this.appFeedbackMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      this.appFeedbackMessageType = 'error';
      return; // Arrête la fonction si le formulaire est invalide
    }

    // Récupère les valeurs du formulaire validées
    const formValues = this.sessionForm.value;
    const sessionDateString = formValues.date; // Chaîne ISO de la date sélectionnée
    const sessionTimeString = formValues.time; // Chaîne ISO de l'heure sélectionnée

    // Combine la date et l'heure en un objet Date JavaScript complet
    // On prend la partie date de sessionDateString (YYYY-MM-DD) et la partie heure de sessionTimeString (HH:MM:SS.mmmZ)
    const combinedDate = new Date(sessionDateString.split('T')[0] + 'T' + sessionTimeString.split('T')[1]);

    // Calcule l'heure de fin (exemple: 1 heure après l'heure de début)
    const endTime = new Date(combinedDate.getTime() + (60 * 60 * 1000)); // Ajoute 1 heure en millisecondes

    // Construit l'objet de données de session à envoyer à l'API
    const sessionData = {
      tuteurId: formValues.tutorId,
      etudiantId: 'ID_DE_L_ETUDIANT_CONNECTE', // TODO: Remplacer par l'ID réel de l'utilisateur connecté (ex: this.authService.getCurrentUserId())
      matiere: 'Informatique', // Exemple, à rendre dynamique si nécessaire (ex: via un autre champ de formulaire)
      niveau: 'NIV1',          // Exemple, à rendre dynamique si nécessaire
      date: combinedDate.toISOString().split('T')[0], // Juste la date au format YYYY-MM-DD
      heureDebut: combinedDate.toISOString(), // Heure de début complète au format ISO 8601
      heureFin: endTime.toISOString(), // Heure de fin complète au format ISO 8601
      mode: formValues.mode,
      lieu: formValues.mode === 'presentiel' ? 'À définir avec le tuteur' : '', // Champ conditionnel pour le lieu
      lienVisio: formValues.mode === 'visio' ? formValues.videoLink : '', // Champ conditionnel pour le lien visio
      userFeedback: formValues.userFeedback // NOUVEAU : Ajoute le feedback de l'utilisateur ici
    };

    console.log('Données de la demande de séance à envoyer:', sessionData);

    // ----- SIMULATION DE L'APPEL API (À SUPPRIMER UNE FOIS LE BACKEND CONNECTÉ) -----
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simule un délai réseau de 1.5 seconde

        await this.presentToast('Demande de séance simulée envoyée !', 'success', 3000, 'bottom');
        this.appFeedbackMessage = 'Votre demande a été envoyée avec succès !';
        this.appFeedbackMessageType = 'success';
        this.router.navigate(['/dashboard']); // Redirection vers le dashboard après succès simulé
        this.sessionForm.reset({ mode: 'presentiel' }); // Réinitialise le formulaire, avec le mode par défaut
    } catch (error) {
        console.error('Erreur lors de l\'envoi simulé:', error);
        await this.presentToast('Échec de l\'envoi simulé. Veuillez réessayer.', 'danger', 4000, 'bottom');
        this.appFeedbackMessage = 'Une erreur est survenue lors de l\'envoi simulé. Veuillez réessayer.';
        this.appFeedbackMessageType = 'error';
    }
    // --------------------------------------------------------------------------------
  }

  /**
   * Affiche un message Toast Ionic pour le feedback utilisateur.
   * @param message Le texte du message à afficher.
   * @param color La couleur du Toast (e.g., 'primary', 'success', 'danger', 'warning').
   * @param duration La durée d'affichage du Toast en millisecondes.
   * @param position La position du Toast ('top', 'middle', 'bottom').
   */
  async presentToast(message: string, color: string = 'primary', duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
      buttons: [
        {
          text: 'Fermer',
          role: 'cancel', // Permet à l'utilisateur de fermer manuellement le toast
          handler: () => {
            console.log('Toast fermé par l\'utilisateur.');
          }
        }
      ]
    });
    toast.present();
  }

  // Fonction pour retourner au dashboard (utilisée si tu as un bouton "Retour" autre que ion-back-button)
  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}