import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

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
  arrowBack,
  searchOutline,
  star
} from 'ionicons/icons';


interface Tutor {
  id: string;
  name: string;
  subject: string;
  level: string;
  description: string;
  photoUrl: string;
  price?: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-request-session',
  templateUrl: './request-session.page.html',
  styleUrls: ['./request-session.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class RequestSessionPage implements OnInit {
  sessionForm: FormGroup;

  isDatePickerOpen = false;
  isTimePickerOpen = false;

  appFeedbackMessage: string = '';
  appFeedbackMessageType: 'success' | 'error' | 'info' | '' = '';

  // Liste complète des tuteurs fictifs avec des "placeholders"
  allTutors: Tutor[] = [
    {
      id: 'tutor123',
      name: 'Dr. Émilie Dubois',
      subject: 'Mathématiques',
      level: 'Lycée & Supérieur',
      description: 'Spécialiste en algèbre et analyse. Aide les étudiants à maîtriser les concepts complexes avec patience et clarté. 10 ans d\'expérience.',
      photoUrl: 'https://i.pravatar.cc/150?img=3',
      price: '25€',
      rating: 4.8,
      reviews: 125
    },
    {
      id: 'tutor456',
      name: 'M. Antoine Lefèvre',
      subject: 'Physique-Chimie',
      level: 'Lycée',
      description: 'Passionné de sciences, j\'aide les élèves à comprendre la physique et la chimie par des exemples concrets et des exercices pratiques. Ancien étudiant en ingénierie.',
      photoUrl: 'https://i.pravatar.cc/150?img=65',
      price: '20€',
      rating: 4.5,
      reviews: 80
    },
    {
      id: 'tutor789',
      name: 'Mlle. Sophie Moreau',
      subject: 'Informatique',
      level: 'Débutant & Intermédiaire',
      description: 'Développeuse web et enseignante en programmation (Python, JavaScript). J\'aime simplifier l\'informatique pour la rendre accessible à tous.',
      photoUrl: 'https://i.pravatar.cc/150?img=47',
      price: '28€',
      rating: 4.9,
      reviews: 95
    },
    {
      id: 'tutor101',
      name: 'Mme. Camille Bernard',
      subject: 'Français & Philosophie',
      level: 'Lycée',
      description: 'Agrégée de lettres modernes, j\'accompagne les lycéens dans la préparation du baccalauréat de français et de philosophie. Méthodologie et rigueur assurées.',
      photoUrl: 'https://i.pravatar.cc/150?img=26',
      price: '22€',
      rating: 4.7,
      reviews: 60
    },
    {
      id: 'tutor102',
      name: 'M. David Roussel',
      subject: 'Anglais',
      level: 'Tous niveaux',
      description: 'Professeur d\'anglais certifié, spécialisé dans la conversation et la préparation aux examens (TOEFL, IELTS). Mon objectif est de vous rendre fluide !',
      photoUrl: 'https://i.pravatar.cc/150?img=68',
      price: '23€',
      rating: 4.6,
      reviews: 110
    },
    {
      id: 'tutor103',
      name: 'Dr. Jean-Luc Petit',
      subject: 'Biologie',
      level: 'Lycée & Supérieur',
      description: 'Docteur en biologie, je transmets ma passion pour les sciences du vivant. Aide à la compréhension des cours et à la préparation aux examens universitaires.',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
      price: '26€',
      rating: 4.7,
      reviews: 70
    },
    {
      id: 'tutor104',
      name: 'Mlle. Léa Durand',
      subject: 'Histoire-Géographie',
      level: 'Collège & Lycée',
      description: 'Facilite la compréhension des événements historiques et des enjeux géographiques. Aide à la rédaction de dissertations et commentaires.',
      photoUrl: 'https://i.pravatar.cc/150?img=50',
      price: '19€',
      rating: 4.4,
      reviews: 45
    },
    // --- Nouveaux tuteurs plus "placeholder" ou moins détaillés ---
    {
      id: 'tutor201',
      name: 'Tuteur en Maths B',
      subject: 'Mathématiques',
      level: 'Collège',
      description: 'Aide aux devoirs et révision de base en mathématiques.',
      photoUrl: '', // Pas de photo, utilisera le placeholder
      price: '15€',
      rating: 3.5, // Note plus basse
      reviews: 10
    },
    {
      id: 'tutor202',
      name: 'Tuteur Polyvalent',
      subject: 'Aide Scolaire',
      level: 'Primaire & Collège',
      description: 'Support général pour plusieurs matières. Idéal pour les fondamentaux.',
      photoUrl: '', // Pas de photo
      price: '18€',
      rating: 3.8,
      reviews: 25
    },
    {
      id: 'tutor203',
      name: 'Nouveau Tuteur',
      subject: 'À déterminer',
      level: 'À déterminer',
      description: 'Nouveau tuteur rejoignant la plateforme. Plus d\'informations bientôt.',
      photoUrl: '', // Pas de photo
      rating: 0, // Pas encore d'avis
      reviews: 0
    }
  ];

  filteredTutors: Tutor[] = [];
  selectedTutorDetails: Tutor | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
  ) {
    this.sessionForm = new FormGroup({
      tutorSearch: new FormControl<string>(''),
      tutorId: new FormControl<string | null>(null, Validators.required),
      subject: new FormControl<string | null>(null, Validators.required),
      level: new FormControl<string | null>(null, Validators.required),
      date: new FormControl<string | null>(null, Validators.required),
      time: new FormControl<string | null>(null, Validators.required),
      duration: new FormControl<number | null>(null, Validators.required),
      mode: new FormControl<'presentiel' | 'visio'>('presentiel', Validators.required),
      videoLink: new FormControl<string>(''),
      notesForTutor: new FormControl<string>('')
    });

    addIcons({
      checkmarkCircle,
      closeCircle,
      informationCircle,
      arrowForwardOutline,
      calendarOutline,
      personOutline,
      timeOutline,
      addOutline,
      arrowBack,
      searchOutline,
      star
    });
  }

  ngOnInit() {
    // Filtrer pour afficher d'abord les tuteurs avec un rating élevé ou une photo
    // Ceci est une logique simple pour trier, adapte-la selon tes critères de "visibilité"
    this.filteredTutors = [...this.allTutors].sort((a, b) => {
      // Tri par rating décroissant
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // Ensuite, tuteurs avec photo avant ceux sans
      if (a.photoUrl && !b.photoUrl) return -1;
      if (!a.photoUrl && b.photoUrl) return 1;
      // Enfin, par ordre alphabétique
      return a.name.localeCompare(b.name);
    });


    const now = new Date();
    this.sessionForm.patchValue({
      date: now.toISOString(),
      time: now.toISOString(),
      duration: 60
    });

    const tutorIdFromUrl = this.route.snapshot.paramMap.get('id');
    if (tutorIdFromUrl) {
      const preselectedTutor = this.allTutors.find(t => t.id === tutorIdFromUrl);
      if (preselectedTutor) {
        this.sessionForm.patchValue({ tutorId: tutorIdFromUrl });
        this.sessionForm.get('tutorSearch')?.setValue(preselectedTutor.name);
        this.selectedTutorDetails = preselectedTutor;
      }
    }

    this.sessionForm.get('mode')?.valueChanges.subscribe(mode => {
      if (mode !== 'visio') {
        this.sessionForm.get('videoLink')?.setValue('');
        this.sessionForm.get('videoLink')?.clearValidators();
      } else {
        this.sessionForm.get('videoLink')?.setValidators(Validators.required);
      }
      this.sessionForm.get('videoLink')?.updateValueAndValidity();
    });

    this.sessionForm.get('tutorId')?.valueChanges.subscribe(tutorId => {
      this.selectedTutorDetails = this.allTutors.find(t => t.id === tutorId) || null;
      if (this.selectedTutorDetails) {
        // Pré-remplir la matière/niveau si le tuteur sélectionné a ces informations
        this.sessionForm.patchValue({
          subject: this.selectedTutorDetails.subject,
          level: this.selectedTutorDetails.level
        });
      }
    });

    this.sessionForm.get('tutorSearch')?.valueChanges.subscribe(searchValue => {
      this.filterTutors({ detail: { value: searchValue } });
      if (!searchValue || searchValue.trim() === '') {
        this.sessionForm.get('tutorId')?.setValue(null);
        // Ne pas réinitialiser selectedTutorDetails ici pour ne pas effacer la carte si l'utilisateur efface la recherche mais a déjà sélectionné un tuteur.
        // On pourrait réinitialiser si l'utilisateur sélectionne un tuteur qui ne correspond plus à la recherche.
      }
    });
  }

  filterTutors(event: any) {
    const searchTerm = (event.detail.value || '').toLowerCase();
    this.filteredTutors = this.allTutors.filter(tutor =>
      tutor.name.toLowerCase().includes(searchTerm) ||
      tutor.subject.toLowerCase().includes(searchTerm) ||
      tutor.description.toLowerCase().includes(searchTerm) ||
      tutor.level.toLowerCase().includes(searchTerm)
    );
  }

  onDateChange(event: any) {
    this.isDatePickerOpen = false;
    console.log('Date sélectionnée :', this.sessionForm.get('date')?.value);
  }

  onTimeChange(event: any) {
    this.isTimePickerOpen = false;
    console.log('Heure sélectionnée :', this.sessionForm.get('time')?.value);
  }

  async submitRequest() {
    this.appFeedbackMessage = '';
    this.appFeedbackMessageType = '';

    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      await this.presentToast('Veuillez remplir tous les champs obligatoires.', 'danger', 3000, 'top');
      this.appFeedbackMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      this.appFeedbackMessageType = 'error';
      return;
    }

    const formValues = this.sessionForm.value;
    const sessionDateString = formValues.date;
    const sessionTimeString = formValues.time;
    const durationMinutes = formValues.duration;

    const combinedDate = new Date(sessionDateString.split('T')[0] + 'T' + sessionTimeString.split('T')[1]);
    const endTime = new Date(combinedDate.getTime() + (durationMinutes * 60 * 1000));

    const sessionData = {
      tuteurId: formValues.tutorId,
      etudiantId: 'ID_DE_L_ETUDIANT_CONNECTE',
      matiere: formValues.subject,
      niveau: formValues.level,
      date: combinedDate.toISOString().split('T')[0],
      heureDebut: combinedDate.toISOString(),
      heureFin: endTime.toISOString(),
      mode: formValues.mode,
      lieu: formValues.mode === 'presentiel' ? 'À définir avec le tuteur' : '',
      lienVisio: formValues.mode === 'visio' ? formValues.videoLink : '',
      notesForTutor: formValues.notesForTutor
    };

    console.log('Données de la demande de séance à envoyer:', sessionData);

    // ----- SIMULATION DE L'APPEL API (À SUPPRIMER UNE FOIS LE BACKEND CONNECTÉ) -----
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        await this.presentToast('Demande de séance simulée envoyée !', 'success', 3000, 'bottom');
        this.appFeedbackMessage = 'Votre demande a été envoyée avec succès !';
        this.appFeedbackMessageType = 'success';
        this.router.navigate(['/dashboard']);
        this.sessionForm.reset({
          tutorSearch: '',
          tutorId: null,
          subject: null,
          level: null,
          date: new Date().toISOString(),
          time: new Date().toISOString(),
          duration: 60,
          mode: 'presentiel',
          videoLink: '',
          notesForTutor: ''
        });
        this.filteredTutors = [...this.allTutors];
        this.selectedTutorDetails = null;
    } catch (error) {
        console.error('Erreur lors de l\'envoi simulé:', error);
        await this.presentToast('Échec de l\'envoi simulé. Veuillez réessayer.', 'danger', 4000, 'bottom');
        this.appFeedbackMessage = 'Une erreur est survenue lors de l\'envoi simulé. Veuillez réessayer.';
        this.appFeedbackMessageType = 'error';
    }
  }

  async presentToast(message: string, color: string = 'primary', duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
      buttons: [
        {
          text: 'Fermer',
          role: 'cancel',
          handler: () => {
            console.log('Toast fermé par l\'utilisateur.');
          }
        }
      ]
    });
    toast.present();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}