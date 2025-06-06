import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonContent, IonApp, IonRouterOutlet, NgClass],
})
export class AppComponent {

  private static direccion: string;

  private static headers: HttpHeaders;
  

  constructor() {
    AppComponent.direccion = "http://localhost";
    AppComponent.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  });
  }

  public static getDireccion(){
    return AppComponent.direccion;
  }

  public static getHeaders(){
    return AppComponent.headers;
  }
}
