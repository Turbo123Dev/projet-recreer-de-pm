import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mot-de-passe-oublie',
  templateUrl: './mot-de-passe-oublie.page.html',
  styleUrls: ['./mot-de-passe-oublie.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MotDePasseOubliePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
