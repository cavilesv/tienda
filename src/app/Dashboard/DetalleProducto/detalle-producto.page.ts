import { Router } from '@angular/router';
import { IonCol, IonImg, IonGrid, IonRow, IonInfiniteScroll } from "@ionic/angular/standalone";
import { CommonModule} from '@angular/common';
import { Component, ElementRef, EnvironmentInjector, EventEmitter, inject, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonContent, IonTitle, IonHeader, IonToolbar, IonButton, IonItem,
  IonMenu,
  IonMenuToggle,
  IonRadio,
  IonRadioGroup, IonAvatar, IonList, IonInput, IonTextarea, IonModal, IonAlert,
  IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ActivatedRoute,RouterModule, Routes } from '@angular/router';
import { sleep } from 'utils';
import { BotonMenuComponent } from '../BotonMenu/boton-menu.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, House, Search, Bell, Heart, BadgeDollarSign, User, ShoppingCart, ChartBarStacked, CircleHelp, Store, Trash2, SquarePen } from 'lucide-angular';
import { DashboardComponent } from '../dashboard.page';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { FileUploaderComponent } from '../FileUploader/file-uploader.component';
import { take } from 'rxjs';
import type { InfiniteScrollCustomEvent, OverlayEventDetail } from '@ionic/core';
import { ProductosSharedService } from 'src/app/productos-event-share.service';

@Component({
  standalone: true,
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  imports: [IonInfiniteScroll, IonAlert, IonModal, IonInput, 
      IonCol, 
      IonGrid, 
      IonRow, 
      IonButton, 
      IonLabel, 
      IonHeader, 
      IonToolbar, 
      IonTitle, 
      IonContent, 
      CommonModule, 
      BotonMenuComponent, 
      FormsModule, 
      IonButton,
      IonContent,
      IonHeader,
      IonItem,
      IonMenu,
      IonMenuToggle,
      IonRadio,
      IonRadioGroup,
      IonTitle,
      IonToolbar,
      IonImg, IonAvatar, IonList, IonIcon, LucideAngularModule, IonInput, IonTextarea, FileUploaderComponent, IonInfiniteScrollContent]
  
})
export class DetalleProductoComponent  implements OnInit {



  private rutaEliminarProducto = AppComponent.getDireccion() + "/eliminar_producto";
  private rutaNuevoProducto = AppComponent.getDireccion() + "/modificar_producto";
/* ----------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Constructor ---------------------------------------------------*/
/* ----------------------------------------------------------------------------------------------------- */
  constructor(private router:Router, private http:HttpClient, private productosSharedService: ProductosSharedService) { 

    this.iconsURL = "../../assets/icon/";
    this.alertaAbierta = false;
    this.valorCategoria = "";
    this.categorias = [];
    this.notificacionEliminacionAbierta = false;
    this.notificacionModificacionAbierta = false;
    DetalleProductoComponent.seBuscoCategorias = false;
    this.alertaProductoYaExistenteAbierta = false;
  }
  
  ngOnInit() {
    this.generateItems();

    this.valorInputNombre = this._nombre!;
    this.valorInputPrecio = this._precio!;
    this.valorInputCategoria = this._categoria!;
    this.valorInputDescripcion = this._descripcion!;
  }

  private _id?:string;
  private _nombre?:string;
  private _precio?:string;
  private _categoria?:string;
  private _imagen?:string;
  private _descripcion?:string;

  @Input('id')
  set id(id: string) {
    this._id = id; // Asigna un Observable a hero$
  }
  @Input('nombre')
  set nombre(nombre: string) {
    this._nombre = nombre; // Asigna un Observable a hero$
  }
  @Input('precio')
  set precio(precio: string) {
    this._precio = precio; // Asigna un Observable a hero$
  }
  @Input('categoria')
  set categoria(categoria: string) {
    this._categoria = categoria; // Asigna un Observable a hero$
  }
  @Input('imagen')
  set imagen(imagen: string) {
    console.log("la imagen es :"+ imagen);
    this._imagen = imagen; // Asigna un Observable a hero$
  }
  @Input('descripcion')
  set descripcion(descripcion: string) {
    this._descripcion = descripcion; // Asigna un Observable a hero$
  }

  @Output() eliminacionProducto = new EventEmitter<string>();
  @Output() modificacionProducto = new EventEmitter<string>();


  public getNombre()
  {
    return this._nombre;
  }

  public getPrecio()
  {
    return this._precio;
  }

  public getCategoria()
  {
    return this._categoria;
  }

  public getImagen()
  {
    return this._imagen;
  }

  public getDescripcion()
  {
    return this._descripcion;
  }


/* ----------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Lógica de íconos ----------------------------------------------*/
/* ----------------------------------------------------------------------------------------------------- */
  private iconoModificar = SquarePen;
  private iconoEliminar = Trash2;

  public getIconoModificar()
  {
    return this.iconoModificar;
  }

  public getIconoEliminar()
  {
    return this.iconoEliminar;
  }

  getIconsURL()
  {
    return this.iconsURL;
  }

  private iconsURL: string;



/* ----------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Lógica de rutas -----------------------------------------------*/
/* ----------------------------------------------------------------------------------------------------- */

  public irARuta(ruta:string)
  {
    this.router.navigate(["/dashboard/"+ruta]);    
  }

/* ----------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Lógica transición ver-modificar  ------------------------------*/
/* ----------------------------------------------------------------------------------------------------- */

public mostrandoModoModificar: boolean = false;

public mostrarModoModificar()
{
  this.mostrandoModoModificar = !this.mostrandoModoModificar;
}

/* ----------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Lógica de alertas ----------------------------------------------*/
/* ----------------------------------------------------------------------------------------------------- */

public alertaAbierta: boolean;
public alertButtons = [
  {
    text: 'Cancelar',
    role: 'cancel',
    handler: () => {
      this.alertaAbierta = false;
    },
  },
  {
    text: 'Confirmar',
    role: 'confirm',
    handler: () => {
      this.eliminarProducto();
    },
  },
];

public botonesAlertaModificacion = [
{
    text: 'Aceptar',
    role: 'confirm',
    handler: () => {
      this.notificacionModificacionAbierta = false;
    },
  },
];

setResult(event: CustomEvent<OverlayEventDetail>) {
  console.log(`Dismissed with role: ${event.detail.role}`);
}

  public abrirAlerta()
  {
    this.alertaAbierta = true;
  }

  public popupEliminarProducto()
  {

  }

  private notificacionEliminacionAbierta: boolean;

  public getNotificacionEliminacionAbierta(){
    return this.notificacionEliminacionAbierta;
  }

  private notificacionModificacionAbierta: boolean;

  public getNotificacionModificacionAbierta(){
    return this.notificacionModificacionAbierta;
  }

  public abrirAlertaModificacion()
  {
    this.notificacionModificacionAbierta = true;
  }

  public cerrarAlertaModificacion()
  {
    this.notificacionModificacionAbierta = false;
  }

  private alertaProductoYaExistenteAbierta: boolean;

  botonesAlertaProductoYaExistente: any = [
    {
      text: 'Aceptar',
      role: 'cancel',
      handler: () => { 
        this.setEstadoAlertaProductoYaExistente(false);   
      }
    },
  ];

  setEstadoAlertaProductoYaExistente(estado:boolean) {
    this.alertaProductoYaExistenteAbierta = estado;
  }

  getEstadoAlertaProductoYaExistente() {
    return this.alertaProductoYaExistenteAbierta;
  }

/* ----------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Eliminar producto ----------------------------------------------*/
/* ----------------------------------------------------------------------------------------------------- */
  public eliminarProducto()
  {
    return this.http.get(this.rutaEliminarProducto + "/" + this._id, {
      headers: {
        'Accept': 'application/json; charset=UTF-8' 
      }
    }).pipe(take(1)).subscribe({
        next: (respuesta) => {
          console.log('Respuesta del servidor:', respuesta);
        },
        error: (error) => {
          let erroresEncontrados: string[] = [];
          console.error('Error en la petición:', error);
          Object.keys(error.errores).forEach(error => {
            erroresEncontrados.push(error);
          });
          //this.mostrarErroresRecibidos(erroresEncontrados);
        },
        complete: () => {
          this.productosSharedService.emitirEventoEliminacionProducto(this._id);
          this.setOpen(true);
          this.irARuta("productos");
        }});
  }

  setOpen(isOpen: boolean) {
    this.notificacionEliminacionAbierta = isOpen;
  }



  alertaConfirmacionModificacionAbierta = false;
  botonesAlertaConfirmacionModificacion = ['Aceptar'];
  /* alertButtons = ['Action']; */

  /* abrirAlertaConfirmacionModificacion(estaAbierta: boolean) {
    this.alertaConfirmacionModificacionAbierta = estaAbierta;
  } */

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  items: string[] = [];

/* -------------------------------------------------------------------------------------------------------- */
/*--------------------------------------- Lógica de cargar categoria----------------------------------------*/
/* -------------------------------------------------------------------------------------------------------- */

  private readonly urlGetCategorias = AppComponent.getDireccion() + "/get_categorias";
  public static seBuscoCategorias: boolean;
  private categorias: any;
  private valorPorDefecto = "Sin categoría";
  @ViewChild('inputCategoria') inputCategoria!: ElementRef;

  public getCategorias()
  {
    return this.categorias;
  } 

  public cargarCategorias()
  {
    if (!(DetalleProductoComponent.seBuscoCategorias))
    {
      this.http.get(this.urlGetCategorias, { headers: AppComponent.getHeaders() }) // Ejemplo de API pública
      .subscribe({
        next: (respuesta) => {
          DetalleProductoComponent.seBuscoCategorias = true;
          this.categorias = respuesta;
        },
        error: (error) => {
          console.error('Error en la llamada GET', error);
        }
      });
      return;
    }
  }

  public mostrarCategorias()
  {
    if (DetalleProductoComponent.seBuscoCategorias && this.categorias.length > 0) 
    {
      return true;
    }
    return false;
  }

  private valorCategoria: string;

  public setValorCategoria(valorCategoria:string)
  {
    this.inputCategoria.nativeElement.value = valorCategoria;
    this.valorCategoria = valorCategoria;
  }

  public getValorCategoria()
  {
    return this.valorCategoria ? this.valorCategoria : this._categoria;
  }
  public getValorPorDefecto()
  {
    return this.valorPorDefecto;
  }

  /* -------------------------------------------------------------------------------------------------------- */
  /*--------------------------------------- Lógica de Modificar Producto ----------------------------------------*/
  /* -------------------------------------------------------------------------------------------------------- */

  private valorInputNombre: string|null = this._nombre!;
  private valorInputPrecio: string|null = this._precio!;
  private valorInputCategoria: string|null|undefined = this._categoria;
  private valorInputDescripcion: string|null|undefined = this._descripcion;


  public setValorInputNombre(nuevoNombre:string)
  {
    this.valorInputNombre = nuevoNombre;
  }

  public setValorInputPrecio(nuevoPrecio: string)
  {
    this.valorInputPrecio = nuevoPrecio;
  }

  public setValorInputCategoria(nuevaCategoria: string)
  {
    this.valorInputCategoria = nuevaCategoria;
  }

  public setValorInputDescripcion(nuevaDescripcion: string)
  {
    this.valorInputDescripcion = nuevaDescripcion;
  }

  public modificarProducto()
  {
    if (!this.valorInputPrecio || isNaN(Number(this.valorInputPrecio))) {
      
      console.error("El precio es inválido o está vacío.");
      return;
    }

    

    let productoModificado = {
      id: this.getId(),
      name: this.valorInputNombre,
      price: Number(this.valorInputPrecio),
      category: this.getValorCategoria(),
      description: this.valorInputDescripcion
    }

    return this.http.post(this.rutaNuevoProducto, productoModificado,{
      headers: {
        'Accept': 'application/json; charset=UTF-8' 
      }
    }).pipe(take(1)).subscribe({
        next: (respuesta) => {
          console.log('Respuesta del servidor:', respuesta);
        },
        error: (error) => {

          let erroresEncontrados: string[] = [];
          console.error('Error en la petición:', error);          
          if (error.error.errores.general[0].includes("SQLSTATE[23000]"))
          {
            this.setEstadoAlertaProductoYaExistente(true);
          }
          Object.keys(error.errores).forEach(error => {
            erroresEncontrados.push(error);
          });
          //this.mostrarErroresRecibidos(erroresEncontrados);
        },
        complete: () => {
          this.productosSharedService.emitirEventoNuevoProducto();

          this._nombre = this.valorInputNombre!;
          this._precio = this.valorInputPrecio!;
          this._categoria = this.getValorCategoria();
          this._descripcion = this.valorInputDescripcion!;

          this.abrirAlertaModificacion();
          this.mostrarModoModificar();
        }});
  }
  getId() {
    return this._id;
  }
}
