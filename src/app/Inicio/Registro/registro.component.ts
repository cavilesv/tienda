import { CommonModule, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonContent, IonInput, IonButton, IonLabel } from "@ionic/angular/standalone";
import { AlertController } from '@ionic/angular';
import { sleep } from 'utils';
import { AppComponent } from 'src/app/app.component';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [IonLabel, IonButton, IonInput, IonContent, NgClass, FormsModule, CommonModule]
})
export class RegistroComponent  implements OnInit {
  private codigosTelefonicos = [
    { nombre: "Chile", iso: "CL", codigo: "+56", value: "56" },
    { nombre: "Estados Unidos", iso: "US", codigo: "+1", value: "1"},
    { nombre: "Canadá", iso: "CA", codigo: "+1", value: "1" },
    { nombre: "México", iso: "MX", codigo: "+52", value: "52" },
    { nombre: "Argentina", iso: "AR", codigo: "+54", value: "54" },
    { nombre: "Brasil", iso: "BR", codigo: "+55", value: "55" },
    { nombre: "España", iso: "ES", codigo: "+34", value: "34" },
    { nombre: "Francia", iso: "FR", codigo: "+33", value: "33" },
    { nombre: "Reino Unido", iso: "GB", codigo: "+44", value: "44" },
    { nombre: "Alemania", iso: "DE", codigo: "+49", value: "49" },
    { nombre: "Italia", iso: "IT", codigo: "+39", value: "39" },
    { nombre: "Japón", iso: "JP", codigo: "+81", value: "81" },
    { nombre: "China", iso: "CN", codigo: "+86", value: "86" },
    { nombre: "India", iso: "IN", codigo: "+91", value: "91" },
    { nombre: "Australia", iso: "AU", codigo: "+61", value: "61" },
    { nombre: "Sudáfrica", iso: "ZA", codigo: "+27", value: "27" },
    { nombre: "Colombia", iso: "CO", codigo: "+57", value: "57" },
    { nombre: "Perú", iso: "PE", codigo: "+51", value: "51" },
    { nombre: "Venezuela", iso: "VE", codigo: "+58", value: "58" },
    { nombre: "Uruguay", iso: "UY", codigo: "+598", value: "598" }
  ];

  @ViewChild('botonMostrarContrasena') botonMostrarContrasena!: ElementRef;



  public fechaPorDefecto: string;
  private mostrarContrasena: boolean;

  constructor(private http: HttpClient, private renderer:Renderer2, private popup: AlertController) { 
    this.mostrarContrasena = false;

    this.nombre = "";
    this.correoElectronico = "";
    this.fechaNacimiento = "";
    this.prefijoFono = "";
    this.cuerpoFono = "";
    this.contrasena = "";

    this.fechaPorDefecto = '1990-01-01';
  }

  ngOnInit() {}

  public getCodigosTelefonicos()
  {
    return this.codigosTelefonicos;
  }

  public activarMostrarContrasena() {

    this.mostrarContrasena = !this.mostrarContrasena;
    if (this.mostrarContrasena)
    {
      this.renderer.setAttribute(this.campoContrasena.nativeElement, 'type', 'text');
      this.renderer.addClass(this.botonMostrarContrasena.nativeElement, "botonActivado");
    }
    else 
    {
      this.renderer.setAttribute(this.campoContrasena.nativeElement, 'type', 'password');
      this.renderer.removeClass(this.botonMostrarContrasena.nativeElement, "botonActivado");
    }

  }

  public getMostrarContrasena()
  {
    return this.mostrarContrasena;
  }



/* FUNCIONALIDAD REGISTRAR ----------------------------------------------------------------------------------------------------------*/

  /* Campos formulario */
  public nombre:string;
  public correoElectronico: string;
  public fechaNacimiento: string;
  public prefijoFono: string;
  public cuerpoFono: string;
  public contrasena: string;

  @ViewChild('nombreVacio') nombreVacio!: ElementRef;
  @ViewChild('correoVacio') correoVacio!: ElementRef;
  @ViewChild('fechaVacia') fechaVacia!: ElementRef;
  @ViewChild('fonoVacio') fonoVacio!: ElementRef;
  @ViewChild('contrasenaVacia') contrasenaVacia!: ElementRef;

  @ViewChild('campoNombre') campoNombre!: ElementRef;
  @ViewChild('campoCorreo') campoCorreo!: ElementRef;
  @ViewChild('campoFecha') campoFecha!: ElementRef;
  @ViewChild('campoCuerpoFono') campoCuerpoFono!: ElementRef;
  @ViewChild('campoContrasena') campoContrasena!: ElementRef;

  /* Cambia el color de los campos Input */
  async cambiarColor(elemento:ElementRef)
  {
    this.renderer.removeClass(elemento.nativeElement, "elementoInputNormal");
    this.renderer.addClass(elemento.nativeElement, "elementoInputAdvertencia");
    await sleep(5000);
    this.renderer.removeClass(elemento.nativeElement, "elementoInputAdvertencia");
    this.renderer.addClass(elemento.nativeElement, "elementoInputNormal");
  }

  async mostrarErrorCampoVacio(elemento:ElementRef)
  {
    this.renderer.removeAttribute(elemento.nativeElement, "hidden");
    await sleep(5000);
    this.renderer.setAttribute(elemento.nativeElement, "hidden", "true");
  }


  public registrar()
  {
    if (!this.validarDatos())
    {
      this.mostrarAlertaError();
      return;
    }
    const datos = {
      'name': this.nombre.trim(),
      'email': this.correoElectronico.trim().toLowerCase(),
      'birthdate': this.fechaNacimiento.trim(),
      'phone_number': this.prefijoFono.toString().trim()+this.cuerpoFono.toString().trim(),
      'password': this.contrasena.trim(),
      "password_confirmation": this.contrasena.trim()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const url = AppComponent.getDireccion() + "/register";
    
    this.http.post(url, datos, {headers}).subscribe({
      next: (respuesta) => {
        console.log('FUNCIONO');
        alert("HOLAAAAA");
      },
      error: (error) => {
        console.error('Error al enviar:', error);
      }
    });
  }

  /* Primero se valida que los campos no estén vacíos */
  validarDatos():boolean
  {
    let cancelarLogin = false;
    if (this.nombre.trim() == '')
    {
      this.mostrarErrorCampoVacio(this.nombreVacio);
      this.cambiarColor(this.campoNombre);
      cancelarLogin = true;
    }
    
    if (this.correoElectronico.trim() == '')
    {
      this.mostrarErrorCampoVacio(this.correoVacio);
      this.cambiarColor(this.campoCorreo);
      cancelarLogin = true;
    }

    if (this.fechaNacimiento.trim() == '')
    {
        this.mostrarErrorCampoVacio(this.fechaVacia);
        this.cambiarColor(this.campoFecha);
        cancelarLogin = true;
    }

    if (this.cuerpoFono.toString().trim() == '')
    {
        this.mostrarErrorCampoVacio(this.fonoVacio);
        this.cambiarColor(this.campoCuerpoFono);
        cancelarLogin = true;
    }

    if (this.contrasena.trim() == '')
    {
      this.mostrarErrorCampoVacio(this.contrasenaVacia);
      this.cambiarColor(this.campoContrasena);
      cancelarLogin = true;
    }
    
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!(this.correoElectronico.trim().toLowerCase().match(re))){
      cancelarLogin = true;
    }
    if (!(this.contrasena.length >= 8 && this.contrasena.length <= 13)){
      cancelarLogin = true;
    }
    if (!(this.nombre.trim().toLowerCase().length <= 50) || !(this.nombre.trim().toLowerCase().length >= 10)){
      cancelarLogin = true;
    }
    let fonoCompleto = this.prefijoFono.trim() + this.cuerpoFono.toString().trim();
    if ((fonoCompleto.length >= 17) || (fonoCompleto.length <= 8)){
      cancelarLogin = true;
    }
    if (!(this.nombre.trim().toLowerCase().length <= 50) || !(this.nombre.trim().toLowerCase().length >= 10))
    {
      cancelarLogin = true;
    }
      

    if (cancelarLogin)
      return false;
    return true;
  }


  async mostrarAlertaError() {
    const alert = await this.popup.create({
      header: 'Error',
      /* subHeader: 'Formato de l', */
      message: 'Hay campos vacíos y/o datos con formato incorrecto, revise nuevamente.',
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
