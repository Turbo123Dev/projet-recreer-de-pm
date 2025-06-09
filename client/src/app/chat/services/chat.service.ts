// src/app/chat/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Tutor {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
  subject: string;
  contractId: string;
  isOnline?: boolean;
}

export interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private apiUrl = 'http://localhost:3000/api';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  // ID de l'utilisateur actuel (étudiant)
  private currentUserId = 'student_1';

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
    this.initializeSocket();
  }

  private initializeSocket() {
    // Rejoindre la room de l'utilisateur
    this.socket.emit('join', this.currentUserId);

    // Écouter les nouveaux messages
    this.socket.on('messageReceived', (message: Message) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }

  // Récupérer la liste des tuteurs avec qui l'étudiant a un contrat
  getTutorsForStudent(): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(`${this.apiUrl}/tutors/${this.currentUserId}`);
  }

  // Récupérer l'historique des messages avec un tuteur
  getMessages(tutorId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/${this.currentUserId}/${tutorId}`);
  }

  // Envoyer un message
  sendMessage(receiverId: string, message: string) {
    const messageData = {
      senderId: this.currentUserId,
      receiverId: receiverId,
      message: message
    };

    this.socket.emit('sendMessage', messageData);
  }

  // Réinitialiser les messages (pour changer de conversation)
  resetMessages() {
    this.messagesSubject.next([]);
  }

  // Charger les messages pour une conversation spécifique
  loadMessages(tutorId: string) {
    this.getMessages(tutorId).subscribe(messages => {
      this.messagesSubject.next(messages);
    });
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }
}