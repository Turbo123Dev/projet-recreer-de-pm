import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements AfterViewChecked, OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: { sender: string; text: string; }[] = [];
  newMessage: string = '';
  private socket!: Socket;
  public currentSenderId: string = '';
  public targetRecipientId: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentSenderId = this.authService.getUserId() || 'unknown_user';
    console.log('Utilisateur actuel (currentSenderId):', this.currentSenderId);

    this.route.paramMap.subscribe(params => {
      this.targetRecipientId = params.get('tutorId') || 'general_chat';
      console.log('ID du destinataire (targetRecipientId):', this.targetRecipientId);
    });

    // Charger l'historique des messages via HTTP (API REST)
    this.http.get<any[]>(`${environment.apiUrl}/api/messages`).subscribe({
      next: (data) => {
        this.messages = data.map(msg => ({ sender: msg.sender, text: msg.text }));
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement de l\'historique des messages :', err);
      }
    });

    this.socket = io(environment.apiUrl);

    // CETTE PARTIE GÈRE MAINTENANT TOUS LES AJOUTS DE MESSAGES
    this.socket.on('chat message', (msg: { _id: string, text: string, sender: string, recipient: string, timestamp: string }) => {
        // Ajoute le message UNIQUEMENT LORSQU'IL EST REÇU DU SERVEUR
        this.messages.push({ sender: msg.sender, text: msg.text });
        this.scrollToBottom();
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Erreur de connexion Socket.IO :', error);
    });
    this.socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO avec l\'ID :', this.socket.id);
    });
    this.socket.on('disconnect', (reason: any) => {
        console.log('Déconnecté du serveur Socket.IO, raison :', reason);
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const messageToSend = {
      sender: this.currentSenderId,
      recipient: this.targetRecipientId,
      text: this.newMessage
    };

    // Émet le message au serveur.
    // Le message sera ajouté à la liste 'messages' UNIQUEMENT quand le serveur le renverra
    this.socket.emit('chat message', messageToSend);

    this.newMessage = ''; // Réinitialise le champ de saisie
  }

  startChat() {
    this.newMessage = 'Bonjour, je souhaite commencer la discussion !';
    this.sendMessage();
  }

  scrollToBottom() {
    const container = this.messagesContainer?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
}