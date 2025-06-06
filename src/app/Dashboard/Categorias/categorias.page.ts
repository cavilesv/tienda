import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-categorias',
  templateUrl: 'categorias.page.html',
  styleUrls: ['categorias.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class CategoriasComponent {
  constructor() {}
}
