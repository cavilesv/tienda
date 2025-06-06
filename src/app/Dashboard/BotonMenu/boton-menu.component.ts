import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {IonButton,IonContent,IonHeader,IonMenu,IonMenuToggle,IonTitle,IonToolbar}from '@ionic/angular/standalone';

@Component({
  selector: 'app-boton-menu',
  templateUrl: './boton-menu.component.html',
  styleUrls: ['./boton-menu.component.scss'],
  imports: [IonButton, IonContent, IonHeader, IonMenu, IonMenuToggle, IonTitle, IonToolbar, CommonModule]
})
export class BotonMenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
