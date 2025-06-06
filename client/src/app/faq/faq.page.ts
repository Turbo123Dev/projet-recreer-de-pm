import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonTextarea, IonButtons, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonTextarea, IonButtons, IonList,
    CommonModule, FormsModule
  ]
})
export class FaqPage implements OnInit {

  nouvelleQuestion: string = '';

  questions: any[] = [];

  constructor() { }

  ngOnInit() {
    this.questions = [
      {
        id: 1,
        titre: 'Collaborative #FAQ',
        contenu: 'How do I improve my coding skills?',
        auteur: 'Yannick T.',
        date: new Date(),
        reponses: [
          { auteur: 'Admin', contenu: 'Start with mini-projects', date: new Date() },
          { auteur: 'Etienne', contenu: 'Practice on LeetCode', date: new Date() }
        ]
      },
      {
        id: 2,
        titre: 'Common #Java issues',
        contenu: 'What are some common mistakes beginners make in Java?',
        auteur: 'Sophie D.',
        date: new Date(),
        reponses: []
      }
    ];
  }
  ajouterQuestion() {
    const nouvelle = {
      id: this.questions.length + 1,
      titre: 'Nouvelle #Question',
      contenu: this.nouvelleQuestion,
      auteur: 'Moi',
      date: new Date(),
      reponses: []
    };
    this.questions.unshift(nouvelle);
    this.nouvelleQuestion = '';
  }

  reponseEnCours: { [id: number]: string } = {};

  ajouterReponse(questionId: number) {
    const question = this.questions.find(q => q.id === questionId);
    const contenu = this.reponseEnCours[questionId]?.trim();

    if (question && contenu) {
      question.reponses.push({
        auteur: 'Moi',
        contenu,
        date: new Date()
      });

      this.reponseEnCours[questionId] = '';
    }
  }

}
