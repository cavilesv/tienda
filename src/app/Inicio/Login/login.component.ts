import { NgClass, CommonModule} from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { IonContent, IonInput, IonButton, IonLabel } from "@ionic/angular/standalone";
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { FormsModule } from '@angular/forms';
/* import { IonicModule } from '@ionic/angular'; // Importar IonicModule */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../auth.interceptor';
import { AppComponent } from 'src/app/app.component';
import { sleep } from 'utils';
import { AlertController } from '@ionic/angular';
import { EventShareService } from 'src/app/event-share.service';
import { Router } from '@angular/router';

interface Respuesta {
    access_token: string;
    token_type: string;
    expires_in: Number;
    user: object;
}

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonLabel, IonButton, IonInput, IonContent, NgClass, FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {

  @ViewChild('correoVacio') correoVacio!: ElementRef;
  @ViewChild('contrasenaVacia') contrasenaVacia!: ElementRef;
  @ViewChild('campoCorreo') campoCorreo!: ElementRef;
  @ViewChild('campoContrasena') campoContrasena!: ElementRef;
  @ViewChild('contenedorBotonGoogle') contenedorBotonGoogle!: ElementRef;

  mostrarErrorContrasenaVacia: boolean;
  mostrarErrorCorreoVacio: boolean;
  mostrarContrasena: boolean;
  correoElectronico: string;
  contrasena: string;

  private loginURL: string;

  @Output() focusEvent  = new EventEmitter<void>();
  @Output() blurEvent  = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router, private eventShareService: EventShareService, private renderer:Renderer2, private popup: AlertController) { 
    this.mostrarContrasena = false;
    this.correoElectronico = '';
    this.contrasena = '';
    this.mostrarErrorContrasenaVacia = false;
    this.mostrarErrorCorreoVacio = false;
    this.loginURL = AppComponent.getDireccion() + "/ingresar";
  }

  ngOnInit() {}

  
  public iniciarSesion()
  {
    if (!this.validarCredenciales())
    {
      this.mostrarAlertaError();
      return;
    }
    const credenciales = {
                    "email": this.correoElectronico,
                    "password": this.contrasena
                  };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    this.http.post<Respuesta>(this.loginURL, credenciales, {headers})
    .subscribe({
      next: (respuesta) => {
        console.log('Respuesta del servidor:', respuesta);
    
        localStorage.setItem('token', respuesta.access_token);

        // 🚀 Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al enviar:', error);
      }
    });

  }

  /* Hace aparecer el mensaje de advertencia */
  async mostrarErrorCampoVacio(elemento:ElementRef)
  {
    this.renderer.removeAttribute(elemento.nativeElement, "hidden");
    await sleep(5000);
    this.renderer.setAttribute(elemento.nativeElement, "hidden", "true");
  }

  /* Cambia el color de los campos Input */
  async cambiarColor(elemento:ElementRef)
  {
    this.renderer.removeClass(elemento.nativeElement, "elementoInputNormal");
    this.renderer.addClass(elemento.nativeElement, "elementoInputAdvertencia");
    await sleep(5000);
    this.renderer.removeClass(elemento.nativeElement, "elementoInputAdvertencia");
    this.renderer.addClass(elemento.nativeElement, "elementoInputNormal");
  }

  private focoInputCorreo = false;
  private focoInputContrasena = false;

  cambiarFoco(elemento:Number, movimiento:boolean)
  {
    switch (elemento)
    {
      case 1: if (movimiento)
              {
                this.focoInputCorreo = true;
                this.eventShareService.emitirFocus();
              }
              else 
              {
                this.focoInputCorreo = false;
                this.eventShareService.emitirBlur();
              }
              break;
      case 2: if (movimiento)
              {
                this.focoInputContrasena = true;
                this.eventShareService.emitirFocus();
              }
              else
              {
                this.focoInputContrasena = false;
                this.eventShareService.emitirBlur();
              }  
              break;
    }
    this.toggleBotonGoogle();
  }

  /*Esconde el botón de Google, para ahorrar espacio*/
  toggleBotonGoogle()
  {
    
    if (this.focoInputCorreo || this.focoInputContrasena)
    {
      this.renderer.setAttribute(this.contenedorBotonGoogle.nativeElement, "hidden", "true");
    }
    else
    {
      this.renderer.removeAttribute(this.contenedorBotonGoogle.nativeElement, "hidden");
    }
  }


  /* Primero se valida que los campos no estén vacíos */
  validarCredenciales():boolean
  {
    let cancelarLogin = false;
    if (this.correoElectronico.trim() == '')
    {
      this.mostrarErrorCampoVacio(this.correoVacio);
      this.cambiarColor(this.campoCorreo);
      cancelarLogin = true
    }
    if (this.contrasena.trim() == '')
    {
      this.mostrarErrorCampoVacio(this.contrasenaVacia);
      this.cambiarColor(this.campoContrasena);
      cancelarLogin = true;
    }
    
    if (cancelarLogin)
      return false;
    
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!(this.correoElectronico.trim().toLowerCase().match(re)) || !(this.contrasena.length >= 8 && this.contrasena.length <= 13))
      return false;
    return true;
  }



  /* TRABAJAR CON MODAL */
  async mostrarAlertaError() {
    const alert = await this.popup.create({
      header: 'Error',
      /* subHeader: 'Formato de l', */
      message: 'Debe ingresar correo electrónico y contraseña.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Aceptado');
            // Aquí puedes ejecutar la acción que necesites
          },
        },
      ],
    });

    await alert.present();
  }





}
