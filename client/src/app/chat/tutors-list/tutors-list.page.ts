// src/app/chat/tutors-list/tutors-list.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonAvatar, IonBackButton, IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonRippleEffect, IonSkeletonText, IonTitle, IonToolbar, IonButtons } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, personOutline, schoolOutline, arrowBack } from 'ionicons/icons';
import { ChatService, Tutor } from '../services/chat.service';

@Component({
  selector: 'app-tutors-list',
  standalone: true,
  templateUrl: './tutors-list.page.html',
  styleUrls: ['./tutors-list.page.scss'],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class TutorsListPage implements OnInit {
  tutors: Tutor[] = [];
  isLoading = true;

  // Liste de tuteurs par défaut (mock)
  defaultTutors: Tutor[] = [
    {
      id: 'tutor123',
      name: 'Dr. Émilie Dubois',
      email: 'emilie.dubois@example.com',
      profilePicture: 'https://i.pravatar.cc/150?img=3',
      role: 'tutor',
      subject: 'Mathématiques',
      contractId: 'contract123',
      isOnline: true
    },
    {
      id: 'tutor456',
      name: 'M. Antoine Lefèvre',
      email: 'antoine.lefevre@example.com',
      profilePicture: 'https://i.pravatar.cc/150?img=65',
      role: 'tutor',
      subject: 'Physique-Chimie',
      contractId: 'contract456',
      isOnline: false
    },
    {
      id: 'tutor789',
      name: 'Mlle. Sophie Moreau',
      email: 'sophie.moreau@example.com',
      profilePicture: 'https://i.pravatar.cc/150?img=47',
      role: 'tutor',
      subject: 'Informatique',
      contractId: 'contract789',
      isOnline: true
    },
    {
      id: 'tutor101',
      name: 'Mme. Camille Bernard',
      email: 'camille.bernard@example.com',
      profilePicture: 'https://i.pravatar.cc/150?img=26',
      role: 'tutor',
      subject: 'Français & Philosophie',
      contractId: 'contract101',
      isOnline: false
    },
    {
      id: 'tutor102',
      name: 'M. David Roussel',
      email: 'david.roussel@example.com',
      profilePicture: 'https://i.pravatar.cc/150?img=68',
      role: 'tutor',
      subject: 'Anglais',
      contractId: 'contract102',
      isOnline: true
    }
  ];

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {
    addIcons({ chatbubbleOutline, personOutline, schoolOutline, arrowBack });
  }

  ngOnInit() {
    this.loadTutors();
  }

  loadTutors() {
    this.chatService.getTutorsForStudent().subscribe({
      next: (tutors) => {
        this.tutors = tutors.length ? tutors : this.defaultTutors;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tuteurs:', error);
        this.tutors = this.defaultTutors; // fallback
        this.isLoading = false;
      }
    });
  }

  startChat(tutor: Tutor) {
    this.router.navigate(['/chat/conversation', tutor.id]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
