import { Component, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {

  constructor(private alert: AlertController) {}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async mostrarAlerta() {
    const alert = await this.alert.create({
      header: '¡Alerta!',
      message: 'Este es un mensaje de prueba.',
      buttons: ['OK']
    });

    await alert.present();
}
}
