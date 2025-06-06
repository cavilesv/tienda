import { NgClass, CommonModule} from '@angular/common';
import { Component, ElementRef, EnvironmentInjector, inject, Renderer2, ViewChild} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonContent, IonTitle, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule, Routes } from '@angular/router';
import { sleep } from 'utils';
import { Subscription } from 'rxjs';
import { EventShareService } from '../event-share.service';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  imports: [IonToolbar, IonHeader, IonTitle, IonContent, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, NgClass, CommonModule, RouterModule],
})
export class InicioComponent {

  @ViewChild('iconoVolverALogin') iconoVolverALogin!: ElementRef;
  @ViewChild('cuerpoFormulario') cuerpoFormulario!: ElementRef;
  public tituloMostrado: String;
  public environmentInjector = inject(EnvironmentInjector);
  public mostrarCuerpoFormulario: boolean;
  public mostrandoPanelLogin: boolean;

  private focusEventSubscription?: Subscription;
  private blurEventSubscription?: Subscription;

  constructor(private router: Router, private renderer:Renderer2, private eventShareService : EventShareService) {
    this.tituloMostrado = "Login";
    this.mostrarCuerpoFormulario = true;
    this.mostrandoPanelLogin = true;
    this.estaEnfocandoInput = false;
  }

  private setTitulo(titulo: String)
  {
    this.tituloMostrado = titulo;
  }

  public cambiarPanel()
  {
    
    this.renderer.setStyle(this.cuerpoFormulario.nativeElement, 'visibility', 'hidden');

    if (this.router.url == "/inicio/login")
    {  
      this.setTitulo("Registro");
      this.mostrandoPanelLogin = false;
      //this.renderer.removeAttribute(this.iconoVolverALogin.nativeElement, "hidden");
      this.router.navigate(['inicio/registro']); 
    }
    else 
    {
      this.setTitulo("Login");
      this.mostrandoPanelLogin = true;
      //this.renderer.setAttribute(this.iconoVolverALogin.nativeElement, "hidden", "true");
      this.router.navigate(['inicio/login']);
    }
    this.renderer.setStyle(this.cuerpoFormulario.nativeElement, 'visibility', 'visible');
  }



  private estaEnfocandoInput: boolean;

  public cambiarFocoAInput(seEnfoco: boolean)
  {
    this.estaEnfocandoInput = seEnfoco;
  }

  public getEstaEnfocandoInput()
  {
    return this.estaEnfocandoInput;
  }

  /* public irARegistrar()
  {
    this.cambiarPanel();
    this.router.navigate(['inicio/registro']);
  }*/

  /* public volverALogin()
  {
    this.cambiarPanel();
    this.router.navigate(['inicio/login']);
  }  */


  ngOnInit() 
  {
    this.focusEventSubscription = this.eventShareService.focus$.subscribe(() => {
      this.cambiarFocoAInput(true);
    });
  
    this.blurEventSubscription = this.eventShareService.blur$.subscribe(() => {
      this.cambiarFocoAInput(false);
    });
  }

  ngOnDestroy() {
    this.focusEventSubscription?.unsubscribe();
    this.blurEventSubscription?.unsubscribe();
  }
}
