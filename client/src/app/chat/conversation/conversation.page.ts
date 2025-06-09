// src/app/chat/conversation/conversation.page.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonFooter,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonBackButton,
  IonButtons,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, arrowBack, personOutline } from 'ionicons/icons';
import { ChatService, Message, Tutor } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonFooter,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonAvatar,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonBadge
  ]
})
export class ConversationPage implements OnInit, OnDestroy {
  @ViewChild('messagesList', { static: false }) messagesList!: ElementRef;
  
  tutorId!: string;
  currentUserId: string;
  tutor: Tutor | null = null;
  messages: Message[] = [];
  newMessage = '';
  private messagesSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {
    addIcons({ sendOutline, arrowBack, personOutline });
    this.currentUserId = this.chatService.getCurrentUserId();
  }

  ngOnInit() {
    this.tutorId = this.route.snapshot.paramMap.get('tutorId')!;
    this.loadTutorInfo();
    this.loadMessages();
    this.subscribeToMessages();
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.chatService.resetMessages();
  }

  private loadTutorInfo() {
    // Récupérer les infos du tuteur depuis la liste
    this.chatService.getTutorsForStudent().subscribe(tutors => {
      this.tutor = tutors.find(t => t.id === this.tutorId) || null;
    });
  }

  private loadMessages() {
    this.chatService.loadMessages(this.tutorId);
  }

  private subscribeToMessages() {
    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.tutorId, this.newMessage.trim());
      this.newMessage = '';
    }
  }

  onKeyPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    if (this.messagesList) {
      const element = this.messagesList.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  goBack() {
    this.router.navigate(['/chat']);
  }

  isOwnMessage(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(timestamp: Date): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }

  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;
    
    const currentMessage = this.messages[index];
    const previousMessage = this.messages[index - 1];
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  }
}