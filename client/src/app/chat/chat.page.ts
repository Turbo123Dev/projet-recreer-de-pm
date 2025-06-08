// Fichier : src/app/chat/chat.page.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Pour *ngFor
import { FormsModule } from '@angular/forms'; // Pour [(ngModel)]

// Importation de tous les composants Ionic utilisés dans le HTML
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true, // Important : indique que c'est un composant autonome
  imports: [
    // On ajoute ici tout ce dont la page a besoin
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonFooter
  ]
})
export class ChatPage implements OnInit {
  messages: any[] = []; // Il est bon de typer vos variables
  newMessage = '';
  apiUrl = 'http://localhost:3000';
  currentUser = 'Samy';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.http.get<any[]>(`${this.apiUrl}/messages`).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const messageToSend = {
      user: this.currentUser,
      text: this.newMessage
    };

    this.http.post(`${this.apiUrl}/messages`, messageToSend).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }
}